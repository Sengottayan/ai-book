import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async ({ to, subject, html }) => {
    // Check if RESEND_API_KEY is present
    if (!process.env.RESEND_API_KEY) {
        console.warn('[EMAIL] RESEND_API_KEY is missing. Using Mock.');
        console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
        return Promise.resolve({ response: 'Mock success' });
    }

    try {
        const response = await axios.post(
            'https://api.resend.com/emails',
            {
                from: 'BookHaven <onboarding@resend.dev>', // Default Resend testing domain
                to: [to],
                subject: subject,
                html: html,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                },
            }
        );

        console.log('[EMAIL] Sent via Resend:', response.data.id);
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            console.warn('[EMAIL] Resend Sandbox Mode Restriction:');
            console.warn(`[EMAIL] Failed to send to ${to}. Verify domain or use verified email.`);
            // Don't throw, just log.
            return { success: false, reason: 'sandbox_restriction' };
        }
        console.error('[EMAIL] Resend Error:', error.response?.data || error.message);
        // Fallback or just log
        // throw new Error('Email sending failed'); 
    }
};

export default sendEmail;
