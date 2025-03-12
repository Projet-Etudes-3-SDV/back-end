import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import userRoute from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import subscriptionRoutes from './routes/subscription.routes';
import addressRoutes from './routes/address.routes';
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(logger);


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cyna API",
      version: "1.0.0",
      description: "Documentation de l'API pour le projet Cyna",
    },
  },
  apis: [path.join(__dirname, "routes/*.ts")], // Résolution correcte du chemin
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/addresses', addressRoutes);
// app.use('/api/payments', paymentRoutes);

app.use(errorHandler)

export default app;
