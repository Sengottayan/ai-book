import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { generateInvoiceTemplate } from '../utils/invoiceTemplate.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // Check stock and deduct
        for (const item of orderItems) {
            const book = await mongoose.model('Book').findById(item.product);
            if (!book) {
                res.status(404);
                throw new Error(`Book not found: ${item.title}`);
            }
            if (book.stock < item.qty) {
                res.status(400);
                throw new Error(`Not enough stock for ${item.title}`);
            }
            book.stock -= item.qty;
            await book.save();
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();


        // Send Email with Invoice
        const invoiceHtml = generateInvoiceTemplate(createdOrder, req.user);

        await sendEmail({
            to: req.user.email,
            subject: `Invoice for Order #${createdOrder._id} - BookHaven`,
            html: invoiceHtml
        });

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    const users = await User.countDocuments();
    // Assuming Book model is registered
    const books = await mongoose.model('Book').countDocuments();

    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
    const totalPaidOrders = orders.filter(order => order.isPaid).length;

    res.json({
        totalOrders,
        totalSales,
        totalPaidOrders,
        totalUsers: users,
        totalBooks: books
    });
});

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    getDashboardStats
};
