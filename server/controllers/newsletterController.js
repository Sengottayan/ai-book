import asyncHandler from 'express-async-handler';
import Newsletter from '../models/Newsletter.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeToNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Basic validation
    if (!email) {
        res.status(400);
        throw new Error('Please provide an email');
    }

    // Check if already subscribed
    const exists = await Newsletter.findOne({ email });

    if (exists) {
        res.status(400);
        throw new Error('This email is already subscribed');
    }

    // Create subscription
    const newsletter = await Newsletter.create({ email });

    if (newsletter) {
        // Send Welcome Email
        try {
            await sendEmail({
                to: email,
                subject: 'Welcome to BookHaven Newsletter!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #d97706;">Welcome to BookHaven!</h1>
                        <p>Hi there,</p>
                        <p>Thank you for subscribing to our newsletter. You're now part of a community of book lovers!</p>
                        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">Here is your welcome gift:</p>
                            <h2 style="margin: 10px 0; color: #d97706;">10% OFF</h2>
                            <p style="margin: 0;">Use code <strong>WELCOME10</strong> at checkout on your first order.</p>
                        </div>
                        <p>Stay tuned for updates on new arrivals, bestsellers, and exclusive offers.</p>
                        <p>Happy Reading,<br/>The BookHaven Team</p>
                    </div>
                `
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            // Don't fail the request if email fails, just continue
        }

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter',
            data: newsletter
        });
    } else {
        res.status(400);
        throw new Error('Invalid newsletter data');
    }
});

export { subscribeToNewsletter };
