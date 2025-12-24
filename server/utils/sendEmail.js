import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"BookHaven" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        // MOCK EMAIL for Stability (Prevents Render Timeouts)
        console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
        return Promise.resolve({ response: 'Email simulated' });

        // const info = await transporter.sendMail(mailOptions);
        // console.log('Email sent: ' + info.response);
        // return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to avoid breaking the main flow if email fails
    }
};

export default sendEmail;
