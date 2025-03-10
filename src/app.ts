import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// import authRoutes from './src/routes/authRoutes';
import productRoutes from './routes/product.routes';
// import paymentRoutes from './src/routes/paymentRoutes';
import userRoute from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// app.use('/api/auth', authRoutes);
// app.use('/api/payments', paymentRoutes);

app.use(errorHandler)

export default app;
