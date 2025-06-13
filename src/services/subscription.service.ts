import {
  SubscriptionNotFound,
} from "../types/errors/subscription.errors";
import Stripe from "stripe";
import { IUserSubscription } from "../models/subscription.model";
import { ISubscriptionCoupon } from "../models/coupons.model";

export class SubscriptionService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async getUserSubscription(stripeCustomerId: string): Promise<IUserSubscription[]> {
    let subscriptions: IUserSubscription[] = [];
    try {
      const customerSubscriptions = await this.stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'all'
      });

      const allSubscriptions = await Promise.all(
        customerSubscriptions.data.map(async (subscription) => {
          const subscriptionItems = await this.stripe.subscriptionItems.list({
            subscription: subscription.id,
            expand: ['data.price.product']
          });

          const products = subscriptionItems.data.map(item => {
            const product = item.price.product as Stripe.Product;
            return {
              name: product.name || 'Produit',
              description: product.description || '',
              price: item.price.unit_amount ? item.price.unit_amount / 100 : 0,
              currency: item.price.currency || 'eur',
              productId: product.id,
              recurring: item.price.recurring
            };
          });

          if (products.length === 0) return undefined;

          const combinedName = products.map(p => p.name).join(' + ');
          const combinedDescription = products.map(p => p.description).filter(d => d).join(' | ');

          const firstRecurringItem = products.find(p => p.recurring);
          const planType = firstRecurringItem ? this.getPlanType(firstRecurringItem.recurring!) : 'monthly';

          let coupon: ISubscriptionCoupon | undefined;
          if (subscription.discount) {
            coupon = await this.getSubscriptionCoupon(subscription.discount);
          }

          const userSubscription: IUserSubscription = {
            id: subscription.id,
            name: combinedName,
            description: combinedDescription,
            price: subscriptionItems.data[0].price.unit_amount ? subscriptionItems.data[0].price.unit_amount / 100 : 0,
            currency: products[0].currency,
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
            status: subscription.status as IUserSubscription['status'],
            planType: planType,
            coupon: coupon,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            productId: products.map(p => p.productId).join(','), // Joindre les IDs des produits
            createdAt: new Date(subscription.created * 1000),
          };

          return userSubscription;
        })
      );

      subscriptions = allSubscriptions.filter((sub): sub is IUserSubscription => sub !== undefined);
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements Stripe:', error);
      subscriptions = [];
    }
    return subscriptions
  }

  getPlanType(recurring: Stripe.Price.Recurring): IUserSubscription['planType'] {
    if (!recurring) return 'monthly'; // Valeur par défaut

    const { interval, interval_count } = recurring;

    if (interval === 'month' && interval_count === 1) return 'monthly';
    if (interval === 'year' && interval_count === 1) return 'yearly';

    return 'monthly';
  }

  async getSubscriptionCoupon(discount: Stripe.Discount): Promise<ISubscriptionCoupon | undefined> {
    try {
      const coupon = discount.coupon;

      if (!coupon) return undefined;

      let reduction: number;
      let reductionType: 'percentage' | 'fixed';

      if (coupon.percent_off) {
        reduction = coupon.percent_off;
        reductionType = 'percentage';
      } else if (coupon.amount_off) {
        reduction = coupon.amount_off;
        reductionType = 'fixed';
      } else {
        return undefined;
      }

      const subscriptionCoupon: ISubscriptionCoupon = {
        name: coupon.name || discount.promotion_code?.toString() || 'Réduction',
        reduction,
        reductionType,
        startDate: new Date(discount.start * 1000),
        endDate: discount.end ? new Date(discount.end * 1000) : undefined
      };

      return subscriptionCoupon;
    } catch (error) {
      console.error('Erreur lors de la récupération du coupon:', error);
      return undefined;
    }
  }

  async getSubscriptions(): Promise<IUserSubscription[]> {
    try {
      const subscriptionsData = await this.stripe.subscriptions.list();

      const userSubscriptions = await Promise.all(
        subscriptionsData.data.map(async (subscription) => {
          const subscriptionItems = await this.stripe.subscriptionItems.list({
            subscription: subscription.id,
            expand: ['data.price.product']
          });

          const item = subscriptionItems.data[0];
          const product = item.price.product as Stripe.Product;

          if (!item.price.recurring) return undefined;
          const planType = this.getPlanType(item.price.recurring);

          let coupon: ISubscriptionCoupon | undefined;
          if (subscription.discount) {
            coupon = await this.getSubscriptionCoupon(subscription.discount);
          }

          const userSubscription: IUserSubscription = {
            id: subscription.id,
            name: product.name || 'Abonnement',
            description: product.description || '',
            price: item.price.unit_amount ? item.price.unit_amount / 100 : 0,
            currency: item.price.currency || 'eur',
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
            status: subscription.status as IUserSubscription['status'],
            planType: planType,
            coupon: coupon,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            productId: product.id,
            createdAt: new Date(subscription.created * 1000),
          };

          return userSubscription;
        })
      );

      const subscriptions = userSubscriptions.filter((sub): sub is IUserSubscription => sub !== undefined);

      subscriptions.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return subscriptions
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements:', error);
      return [];
    }
  }

  async getSubscriptionById(subscriptionId: string): Promise<IUserSubscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price.product']
      });

      const item = subscription.items.data[0];
      const product = item.price.product as Stripe.Product;

      if (!item.price.recurring) return null;
      const planType = this.getPlanType(item.price.recurring);

      let coupon: ISubscriptionCoupon | undefined;
      if (subscription.discount) {
        coupon = await this.getSubscriptionCoupon(subscription.discount);
      }

      const userSubscription: IUserSubscription = {
        id: subscription.id,
        name: product.name || 'Abonnement',
        description: product.description || '',
        price: item.price.unit_amount ? item.price.unit_amount / 100 : 0,
        currency: item.price.currency || 'eur',
        startDate: new Date(subscription.current_period_start * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        status: subscription.status as IUserSubscription['status'],
        planType: planType,
        coupon: coupon,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        productId: product.id,
        createdAt: new Date(subscription.created * 1000),
      };

      return userSubscription;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      // Vérifier que l'abonnement existe
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      if (!subscription) {
        throw new SubscriptionNotFound();
      }

      // Annuler l'abonnement à la fin de la période de facturation
      const canceledSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });

      return canceledSubscription;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      if (error instanceof Stripe.errors.StripeError && error.code === 'resource_missing') {
        throw new SubscriptionNotFound();
      }
      throw error;
    }
  }

  async reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      // Vérifier que l'abonnement existe
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      if (!subscription) {
        throw new SubscriptionNotFound();
      }

      // Réactiver l'abonnement en annulant la programmation d'annulation
      const reactivatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });

      return reactivatedSubscription;
    } catch (error) {
      console.error('Erreur lors de la réactivation de l\'abonnement:', error);
      if (error instanceof Stripe.errors.StripeError && error.code === 'resource_missing') {
        throw new SubscriptionNotFound();
      }
      throw error;
    }
  }
}
