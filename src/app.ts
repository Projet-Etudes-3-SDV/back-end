// Installation des dépendances nécessaires
// npm init -y
// npm install express mongoose jsonwebtoken bcryptjs dotenv cors swagger-jsdoc swagger-ui-express stripe paypal-rest-sdk

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// import authRoutes from './src/routes/authRoutes';
// import productRoutes from './src/routes/productRoutes';
// import paymentRoutes from './src/routes/paymentRoutes';
import userRoute from './routes/user.route';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoute);

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/payments', paymentRoutes);

app.use(errorHandler)

export default app;
