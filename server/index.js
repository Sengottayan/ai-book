import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/messages', messageRoutes);
import newsletterRoutes from './routes/newsletterRoutes.js';
app.use('/api/newsletter', newsletterRoutes);
import offerRoutes from './routes/offerRoutes.js';
app.use('/api/offers', offerRoutes);
import categoryRoutes from './routes/categoryRoutes.js';
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
