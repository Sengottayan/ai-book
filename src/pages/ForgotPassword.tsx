import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, BookOpen, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/axios';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Credentials are loaded from .env file (VITE_EMAILJS_...)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ForgotPassword = () => {
    // Steps: 'email' -> 'otp' -> 'password' -> 'success'
    const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Step 1: Handle Email Submission & Send OTP
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Check if user exists in database
            await api.post('/api/users/check-email', { email });

            // 2. Generate 6-digit OTP
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(newOtp);

            // 3. Send OTP via EmailJS
            if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
                toast.error("EmailJS credentials not found. Please check your .env file.");
                console.error("Missing keys. Ensure VITE_EMAILJS_... variables are set in .env");
                return;
            } else {
                // Match the "Universal Template" structure used by the backend
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
                        <h2 style="color: #d97706;">Verification Code</h2>
                        <p>Hello,</p>
                        <p>Use the code below to reset your BookHaven password:</p>
                        <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #18181b;">${newOtp}</span>
                        </div>
                        <p style="font-size: 14px; color: #71717a;">This code expires in 10 minutes.</p>
                    </div>
                `;

                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        to_email: email,
                        subject: "Your Verification Code",
                        html_content: htmlContent,
                    },
                    EMAILJS_PUBLIC_KEY
                );
            }

            toast.success('OTP sent to your email!');
            setStep('otp');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'User not found or failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simple comparison
        if (otp === generatedOtp) {
            toast.success('OTP Verified Successfully');
            setStep('password');
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
        setLoading(false);
    };

    // Step 3: Reset Password
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Using the existing endpoint which updates password directly
            await api.post('/api/users/forgotpassword', { email, password });
            setStep('success');
            toast.success('Password successfully reset!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Reset Password | BookHaven</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={step} // Animate between steps
                    className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-sm"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="font-serif text-2xl font-bold text-foreground">
                            Book<span className="text-primary">Haven</span>
                        </span>
                    </Link>

                    {step === 'email' && (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                                    Forgot Password?
                                </h1>
                                <p className="text-muted-foreground">
                                    Enter your email address to receive a verification code.
                                </p>
                            </div>
                            <form onSubmit={handleEmailSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button variant="gold" size="lg" className="w-full gap-2" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                    {!loading && <ArrowRight className="h-5 w-5" />}
                                </Button>
                            </form>
                        </>
                    )}

                    {step === 'otp' && (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                                    Enter OTP
                                </h1>
                                <p className="text-muted-foreground">
                                    We sent a 6-digit code to <strong>{email}</strong>
                                </p>
                            </div>
                            <form onSubmit={handleOtpSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="123456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="pl-10 tracking-widest text-lg"
                                            required
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                                <Button variant="gold" size="lg" className="w-full" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="w-full text-sm text-primary hover:underline mt-2"
                                >
                                    Wrong email? Go back
                                </button>
                            </form>
                        </>
                    )}

                    {step === 'password' && (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                                    Set New Password
                                </h1>
                                <p className="text-muted-foreground">
                                    Create a strong password for your account.
                                </p>
                            </div>
                            <form onSubmit={handlePasswordReset} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button variant="gold" size="lg" className="w-full" disabled={loading}>
                                    {loading ? 'Updating...' : 'Reset Password'}
                                </Button>
                            </form>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-2">Password Reset!</h2>
                                <p className="text-muted-foreground">
                                    Your password has been successfully updated.
                                </p>
                            </div>
                            <Link to="/login">
                                <Button className="w-full">
                                    Login Now
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ForgotPassword;
