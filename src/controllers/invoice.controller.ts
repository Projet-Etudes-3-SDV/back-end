import { NextFunction, Response } from "express";
import { InvoiceService } from "../services/invoice.service";
import { EncodedRequest } from "../utils/EncodedRequest";


export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  async generateAndSendInvoice(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subscriptionId } = req.params;
      await this.invoiceService.generateAndSendInvoice(req.decoded.user.id, subscriptionId);
      res.status(200).json("La facture a été générée et envoyée par e-mail avec succès.");
    } catch (error) {
      next(error);
    }
  }
}