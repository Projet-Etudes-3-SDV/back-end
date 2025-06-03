import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import userRoute from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import subscriptionRoutes from './routes/subscription.routes';
import addressRoutes from './routes/address.routes';
import couponRoutes from './routes/coupon.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import logger from './middlewares/logger.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { EncodedRequest } from './utils/EncodedRequest';
import paymentRoutes from './routes/payment.route';
import landingRoutes from './routes/landing.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(logger as express.RequestHandler);
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next(); // ne pas parser ici
  } else {
    express.json()(req, res, next);
  }
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cyna API",
      version: "1.0.0",
      description: "Documentation de l'API pour le projet Cyna",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "routes/*.ts")],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/landings', landingRoutes);
app.use('/api/orders', orderRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => errorHandler(err, req as EncodedRequest, res, next));

export default app;
