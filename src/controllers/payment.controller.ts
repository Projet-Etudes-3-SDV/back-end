import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { EncodedRequest } from '../utils/EncodedRequest';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { CartStatus } from '../models/cart.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

const userService = new UserService();
const cartService = new CartService();

export const createCheckoutSession = async (req: EncodedRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.decoded.user.id);
    console.log("cart: ", cart);
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
    });
    console.log("session: ", session.id, session.url, session)

    // get id, save to user, return url
    const sessionId = session.id;
    console.log("sessionId: ", sessionId);

    // save session.id to the user in your database
    await userService.updateUserPaymentSessionId(req.decoded.user.id, sessionId)
    await cartService.updateCartStatus(req.decoded.user.id, CartStatus.PENDING)

    res.json({ url: session.url })
  } catch (e) {
    next(e);
  }
}

export const stripeWebhook = async (req: EncodedRequest, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Paiement réussi pour la session :', session.id);

        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Paiement réussi pour la session :', session.id);
        
        const user = await userService.getUserByPaymentSessionId(session.id);
        const cart = await cartService.validateCart(user.id)
        console.log('✅ Panier validé pour l\'utilisateur :', user.id, cart.id);
        
        await userService.updateUserPaymentSessionId(req.decoded.user.id, '')
        await cartService.updateCartStatus(req.decoded.user.id, CartStatus.READY)
        break;
      }
  
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('❌ Échec du paiement pour la session :', session.id);

        await userService.updateUserPaymentSessionId(req.decoded.user.id, '')
        await cartService.updateCartStatus(req.decoded.user.id, CartStatus.READY)

        break;
      }

      default: {
        console.log(`ℹ️ Événement non géré : ${event.type}`);

        await userService.updateUserPaymentSessionId(req.decoded.user.id, '')
        await cartService.updateCartStatus(req.decoded.user.id, CartStatus.READY)
      }
        
    }
  
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }  
};
