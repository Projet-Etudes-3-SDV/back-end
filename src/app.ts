import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/product.routes';
// import paymentRoutes from './src/routes/paymentRoutes';
import userRoute from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import subscriptionRoutes from './routes/subscription.routes';
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger.middleware';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/subscription', subscriptionRoutes);
// app.use('/api/payments', paymentRoutes);

app.use(errorHandler)

export default app;
