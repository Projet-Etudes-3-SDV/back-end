import { Response, NextFunction, Request } from 'express';
import Stripe from 'stripe';
import { EncodedRequest } from '../utils/EncodedRequest';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '../models/order.model';
import { ProductService } from '../services/product.service';
import { AppError } from '../utils/AppError';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

const userService = new UserService()
const cartService = new CartService()
const orderService = new OrderService()
const productService = new ProductService()

export const createCheckoutSession = async (req: EncodedRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.decoded.user.id);
    let total = 0
    const lineItems = []
    let isMonthly = false
    let isYearly = false
    const user = await userService.getUserBy({id: req.decoded.user.id, page: 1, limit: 1});

    for (const product of cart.products) {
      const productData = await productService.getProduct(product.product.id);
      let stripePriceId = '';

      if (!productData || !productData.stripePriceId) {
        throw new Error(`Stripe price not found for product ${product.product.name}`);
      }

      if (product.plan === 'monthly' && productData.stripePriceId) {
        isMonthly = true
        stripePriceId = productData.stripePriceId;
        total += productData.monthlyPrice;
      } else if (product.plan === 'yearly' && productData.stripePriceIdYearly) {
        isYearly = true
        stripePriceId = productData.stripePriceIdYearly;
        total += productData.yearlyPrice;
      } else {
        throw new Error(`Price plan mismatch for product ${product.product.name}`);
      }

      if (isMonthly && isYearly) {
        throw new AppError('Cannot mix monthly and yearly plans in a single checkout session', 400, [], 'DIFFERENT_PLANS');
      }

      lineItems.push({
        price: stripePriceId,
        quantity: product.quantity,
      });
    }
    const sessionId = `session_${Date.now()}_${req.decoded.user.id}`;
    const updatedUser = await userService.updateUserPaymentSessionId(req.decoded.user.id, sessionId);

    await orderService.createOrder({
      user: updatedUser._id,
      total: total,
      status: OrderStatus.PENDING,
      sessionId: sessionId,
      products: cart.products.map(product => ({
        product: product.product._id,
        plan: product.plan,
      })),
    });

    let sessionUrl = '';
    if (!user.stripeCustomerId){
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:8100/checkout-success?session_id=${sessionId}`,
        cancel_url: `http://localhost:8100/checkout-failure`,
        line_items: lineItems,
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: req.decoded.user.email,
        allow_promotion_codes: true,
        subscription_data: {
          trial_period_days: 14,
        },
      });
      sessionUrl = session.url ?? '';
    } else {
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:8100/checkout-success?session_id=${sessionId}`,
        cancel_url: `http://localhost:8100/checkout-failure`,
        line_items: lineItems,
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: user.stripeCustomerId,
        allow_promotion_codes: true,
      });
      sessionUrl = session.url ?? '';
    }

    res.json({ url: sessionUrl });

  } catch (e) {
    next(e);
  }
};


export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case 'checkout.session.completed': {
        break;
      }

      case 'checkout.session.payment_succeeded': {
        break;
        }
  
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const user = await userService.getUserByPaymentSessionId(session.id);

        await userService.updateUserPaymentSessionId(user.id, '')
        await orderService.updateOrderStatusBySessionId(session.id, OrderStatus.CANCELLED)

        break;
      }

      case 'customer.created': {
        const email = event.data.object.email as string;
        const user = await userService.getUserBy({ email: email, page: 1, limit: 1 });
        await userService.patchUser(user.id, {
          stripeCustomerId: event.data.object.id,
        });
        break;
      }
      
      case 'invoice.paid': {
        try {
          const session = event.data.object as Stripe.Checkout.Session;

          const stripeCustomerId = session.customer as string;
          const user = await userService.getUserBy({
            stripeCustomerId,
            page: 1,
            limit: 1
          });
          console.log('✅ Payment Intent réussi pour l\'utilisateur:', user.id, user.paymentSessionId);

          await cartService.validateCart(user.id);
          if (user.paymentSessionId) await orderService.updateOrderStatusBySessionId(user.paymentSessionId, OrderStatus.PAID);
          await userService.updateUserPaymentSessionId(user.id, '');

        } catch (err) {
          console.error('❌ Erreur webhook Stripe :', err);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment Intent échoué:', paymentIntent.id);

        await orderService.updateOrderStatusBySessionId(session.id, OrderStatus.CANCELLED)
        break;
      }

      default: {
        console.log(`ℹ️ Événement non géré : ${event.type}`);
      }
    }

    
  
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }  
};
