import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { EncodedRequest } from '../utils/EncodedRequest';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { CartStatus } from '../models/cart.model';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '../models/order.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

const userService = new UserService();
const cartService = new CartService();
const orderService = new OrderService();

export const createCheckoutSession = async (req: EncodedRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.decoded.user.id);
    let total = 0;
    for (const product of cart.products) {
      total += product.product.monthlyPrice * product.quantity;
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `https://example.com/success`,
      cancel_url: `https://example.com/failure`,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Panier utilisateur',
            },
            unit_amount: total * 100, // Prix en centime
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card']
    });

    // get id, save to user, return url
    const sessionId = session.id;

    // save session.id to the user in your database
    const updatedUser = await userService.updateUserPaymentSessionId(req.decoded.user.id, sessionId)
    await cartService.updateCartStatus(req.decoded.user.id, CartStatus.PENDING)
    await orderService.createOrder(
      {
        user: updatedUser._id,
        total: total,
        status: OrderStatus.PENDING,
        sessionId: sessionId,
        products: cart.products.map(product => ({
          product: product.product._id,
          plan: product.plan,
        })),
      }
    )
    res.json({ url: session.url })
  } catch (e) {
    next(e);
  }
}

export const stripeWebhook = async (req: EncodedRequest, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('✅ Paiement réussi pour la session :', session.id);
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        try {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log('✅ Paiement réussi pour la session :', session.id);

          // On récupère l’utilisateur lié à cette session
          const user = await userService.getUserByPaymentSessionId(session.id);
          console.log('✅ Utilisateur trouvé :', user.id);

          const cart = await cartService.validateCart(user.id);
          console.log('✅ Panier validé pour l\'utilisateur :', user.id, cart.id);

          await userService.updateUserPaymentSessionId(user.id, '');
          await orderService.updateOrderStatusBySessionId(session.id, OrderStatus.PAID);
          console.log('✅ Commande mise à jour pour la session :', session.id, OrderStatus.PAID);

        } catch (err) {
          console.error('❌ Erreur webhook Stripe :', err);
        }

        break;
        }
  
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('❌ Échec du paiement pour la session :', session.id);
        const user = await userService.getUserByPaymentSessionId(session.id);

        await userService.updateUserPaymentSessionId(user.id, '')
        await cartService.updateCartStatus(user.id, CartStatus.READY)
        await orderService.updateOrderStatusBySessionId(session.id, OrderStatus.CANCELLED)

        break;
      }
      case 'charge.updated':
      case 'charge.succeeded':
      case 'payment_intent.created':
      case 'payment_intent.succeeded': {
        break;
      }

      default: {
        console.log(`ℹ️ Événement non géré : ${event.type}`);

        await userService.updateUserPaymentSessionId(req.decoded.user.id, session.id)
        await cartService.updateCartStatus(req.decoded.user.id, CartStatus.READY)
        await orderService.updateOrderStatusBySessionId(session.id, OrderStatus.CANCELLED)

      }
        
    }
  
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }  
};
