import { join } from "path";
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { EmailAttachment, sendHtmlEmail } from "./mail.service";
import { UserRepository } from "../repositories/user.repository";
import { SubscriptionService } from "./subscription.service";
import { UserNotFound } from "../types/errors/user.errors";
import { SubscriptionNotFound } from "../types/errors/subscription.errors";
import puppeteer from "puppeteer";
import { IUserSubscription } from "../models/subscription.model";

export interface IClientInfo {
  name: string;
  email: string;
  street?: string;
  zipCodeAndCity?: string;
}

export interface IInvoiceData {
  invoiceNumber: string;
  subscription: IUserSubscription;
  client: IClientInfo;
  tvaRate?: number;
  generateDate?: Date;
}

export interface IInvoiceCalculations {
  totalHT: string;
  TVAOnly: string;
  totalTTC: string;
  totalReduction: string;
  tvaMessage: string;
}

export class InvoiceService {
  private templatePath: string;
  private compiledTemplate: HandlebarsTemplateDelegate | null = null;
  private userRepository: UserRepository;
  private subscriptionService: SubscriptionService;

  constructor(templatePath?: string) {
    this.templatePath = templatePath || join(process.cwd(), 'templates', 'invoice-template.html');
    this.initializeHelpers();
    this.userRepository = new UserRepository();
    this.subscriptionService = new SubscriptionService();
  }

  private initializeHelpers(): void {
    Handlebars.registerHelper('formatDate', (date: Date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    });
    Handlebars.registerHelper('formatCurrency', (amount: number, currency: string = 'EUR') => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency.toUpperCase()
      }).format(amount);
    });
  }

  private loadTemplate(): HandlebarsTemplateDelegate {
    if (!this.compiledTemplate) {
      try {
        const templateContent = readFileSync(this.templatePath, 'utf-8');
        this.compiledTemplate = Handlebars.compile(templateContent);
      } catch (error) {
        throw new Error(`Impossible de charger le template de facture: ${error}`);
      }
    }
    return this.compiledTemplate;
  }

  private calculateAmounts(subscription: IUserSubscription, tvaRate: number = 20): IInvoiceCalculations {
    let baseAmount = subscription.price;
    if (subscription.coupon) {
      if (subscription.coupon.reductionType === 'percentage') {
        baseAmount = baseAmount * (1 - subscription.coupon.reduction / 100);
      } else {
        baseAmount = Math.max(0, baseAmount - subscription.coupon.reduction);
      }
    }

    const totalHT = subscription.status === 'trialing' ? 0 : baseAmount;
    const TVAAmount = totalHT * (tvaRate / 100);
    const totalTTC = totalHT + TVAAmount;
    const totalReduction = subscription.status === 'trialing' ? 0 : baseAmount - subscription.price;

    return {
      totalHT: totalHT.toFixed(2),
      TVAOnly: TVAAmount.toFixed(2),
      totalTTC: totalTTC.toFixed(2),
      totalReduction: totalReduction.toFixed(2),
      tvaMessage: tvaRate > 0
        ? `TVA ${tvaRate}% incluse`
        : 'TVA non applicable'
    };
  }

  private formatSubscriptionForInvoice(subscription: IUserSubscription): string {
    const periodText = subscription.planType === 'monthly' ? 'mensuel' : 'annuel';
    const startDate = new Intl.DateTimeFormat('fr-FR').format(subscription.startDate);
    const endDate = new Intl.DateTimeFormat('fr-FR').format(subscription.endDate);

    let details = `<div class="row">
      <div class="col1">
        <strong>${subscription.name}</strong><br>
        ${subscription.description}<br>
        Abonnement ${periodText}<br>
        Période: ${startDate} - ${endDate}
      </div>
      <div class="col">1</div>
      <div class="col">${subscription.price.toFixed(2)} €</div>
      <div class="col">${subscription.price.toFixed(2)} €</div>
    </div>`;
    if (subscription.coupon) {
      const reductionAmount = subscription.coupon.reductionType === 'percentage'
        ? subscription.price * (subscription.coupon.reduction / 100)
        : subscription.coupon.reduction;

      details += `<div class="row">
        <div class="col1">
          <strong>Réduction - ${subscription.coupon.name}</strong><br>
          ${subscription.coupon.reductionType === 'percentage'
          ? `${subscription.coupon.reduction}%`
          : `${subscription.coupon.reduction} €`}
        </div>
        <div class="col">1</div>
        <div class="col">-${reductionAmount.toFixed(2)} €</div>
        <div class="col">-${reductionAmount.toFixed(2)} €</div>
      </div>`;
    }

    return details;
  }

  public async generateInvoiceHTML(invoiceData: IInvoiceData): Promise<string> {
    try {
      const template = this.loadTemplate();
      const dateFormatter = (date: Date | undefined) =>
        date ? new Intl.DateTimeFormat('fr-FR').format(date) : '';
      const calculations = this.calculateAmounts(invoiceData.subscription,  invoiceData.tvaRate);

      invoiceData.subscription.name = invoiceData.subscription.status === "trialing" ? "Période d'essai de " + invoiceData.subscription.name : invoiceData.subscription.name

      const invoiceDataWithFormattedDatesAndPrices = {
        ...invoiceData,
        startDateFormatted: dateFormatter(invoiceData.subscription.startDate),
        endDateFormatted: dateFormatter(invoiceData.subscription.endDate),
        generateDateFormatted: dateFormatter(invoiceData.generateDate),
        total: calculations.totalHT,
        reduction: calculations.totalReduction,
        basePrice: invoiceData.subscription.status === "trialing" ? 0 : invoiceData.subscription.price.toFixed(2),
      };
      

      return template(invoiceDataWithFormattedDatesAndPrices);
    } catch (error) {
      throw new Error(`Erreur lors de la génération de la facture HTML: ${error}`);
    }
  }

  public async generateInvoice(invoiceData: IInvoiceData): Promise<{
    html: string;
    invoiceNumber: string;
    totalAmount: number;
    currency: string;
  }> {
    const html = await this.generateInvoiceHTML(invoiceData);
    const calculations = this.calculateAmounts(invoiceData.subscription, invoiceData.tvaRate);

    return {
      html,
      invoiceNumber: invoiceData.invoiceNumber,
      totalAmount: parseFloat(calculations.totalTTC),
      currency: invoiceData.subscription.currency
    };
  }

  public generateInvoiceNumber(subscription: IUserSubscription, sequence?: number): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const seq = String(sequence || Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    return `FACT-${year}-${month}-${seq}`;
  }

  public validateInvoiceData(invoiceData: IInvoiceData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!invoiceData.invoiceNumber?.trim()) {
      errors.push('Le numéro de facture est obligatoire');
    }

    if (!invoiceData.client?.name?.trim()) {
      errors.push('Le nom du client est obligatoire');
    }

    if (!invoiceData.client?.email?.trim()) {
      errors.push('L\'email du client est obligatoire');
    }

    if (!invoiceData.subscription) {
      errors.push('Les informations d\'abonnement sont obligatoires');
    } else {
      if (invoiceData.subscription.price <= 0) {
        errors.push('Le prix de l\'abonnement doit être supérieur à 0');
      }

      if (!invoiceData.subscription.name?.trim()) {
        errors.push('Le nom de l\'abonnement est obligatoire');
      }
    }
    if (invoiceData.tvaRate !== undefined && (invoiceData.tvaRate < 0 || invoiceData.tvaRate > 100)) {
      errors.push('Le taux de TVA doit être compris entre 0 et 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async generateAndSendInvoice(
    userId: string,
    subscriptionId: string
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UserNotFound()
      }
      const subscription = await this.subscriptionService.getSubscriptionById(subscriptionId);
      if (!subscription) {
        throw new SubscriptionNotFound()
      }

      const clientInfo: IClientInfo = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        street: user.addresses[0]?.street ?? '',
        zipCodeAndCity: user.addresses[0] ? `${user.addresses[0].postalCode} ${user.addresses[0].city}` : ''
      };

      const invoiceData: IInvoiceData = {
        invoiceNumber: this.generateInvoiceNumber(subscription),
        subscription: subscription,
        client: clientInfo,
        tvaRate: 20, // 20% TVA par défaut
        generateDate: new Date()
      };

      const validation = this.validateInvoiceData(invoiceData);
      if (!validation.isValid) {
        throw new Error(`Données de facture invalides: ${validation.errors.join(', ')}`);
      }
      const invoiceResult = await this.generateInvoice(invoiceData);
      const pdfFilePath = await this.saveInvoiceToStorage(user.id, invoiceData, invoiceResult.html);
      await this.sendInvoiceByEmail(user.email, invoiceResult, invoiceData, pdfFilePath);


    } catch (error) {
      console.error('❌ Erreur lors de la génération/envoi de facture:', error);
      throw error;
    }
  }

  private async sendInvoiceByEmail(
    userEmail: string,
    invoiceResult: { html: string; invoiceNumber: string; totalAmount: number; currency: string },
    invoiceData: IInvoiceData,
    pdfFilePath: string
  ): Promise<void> {
    const subject = `Cyna: Votre facture ${invoiceResult.invoiceNumber}`;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const pdfBuffer = fs.readFileSync(pdfFilePath);

    const attachments: EmailAttachment[] = [
      {
        filename: `${invoiceResult.invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ];

    const templateContent = readFileSync(join(process.cwd(), 'templates', 'send-invoice-template.html'), 'utf-8');
    const htmlTemplate = Handlebars.compile(templateContent);
  
    sendHtmlEmail(
      userEmail,
      subject,
      htmlTemplate({ 
        invoiceResult: invoiceResult,
        invoiceData: invoiceData, 
        date: new Intl.DateTimeFormat('fr-FR').format(new Date()), 
        startDate: new Intl.DateTimeFormat('fr-FR').format(new Date(invoiceData.subscription.startDate)),
        endDate: new Intl.DateTimeFormat('fr-FR').format(new Date(invoiceData.subscription.endDate)), 
        planType: invoiceData.subscription.planType === 'monthly' ? ' Mensuel' : ' Annuel',
      }),
      attachments
    );
  }

  private async saveInvoiceToStorage(
    userId: string,
    invoiceData: IInvoiceData,
    html: string
  ): Promise<string> {
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs').promises;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const invoiceDir = path.join(
      process.cwd(),
      'storage',
      'invoices',
      year.toString(),
      month,
      `user-${userId}`
    );

    await fs.mkdir(invoiceDir, { recursive: true });

    const pdfFilePath = path.join(invoiceDir, `${invoiceData.invoiceNumber}.pdf`);
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: pdfFilePath, format: 'A4' });

    await browser.close();

    return pdfFilePath;
  }
}