import axios from 'axios';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

// @desc    Generate Razorpay Order
// @route   POST /api/payment/create-session
// @access  Private
const createPaymentSession = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    try {
        const options = {
            amount: Math.round(order.totalPrice * 100), // Amount in paise
            currency: "INR",
            receipt: order._id.toString(),
            payment_capture: 1
        };

        const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');

        const response = await axios.post('https://api.razorpay.com/v1/orders', options, {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            order_id: response.data.id,
            amount: response.data.amount,
            currency: response.data.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500);
        throw new Error(error.response?.data?.error?.description || 'Razorpay order creation failed');
    }
});

// @desc    Verify Payment Status
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const order = await Order.findById(orderId);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: razorpay_payment_id,
                status: 'success',
                update_time: Date.now().toString(),
                email_address: ""
            };
            await order.save();
            res.json({ message: "Payment Verified", verified: true });
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } else {
        res.status(400);
        throw new Error("Invalid signature");
    }
});

export { createPaymentSession, verifyPayment };
