import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/users/forgotpassword', { email });
            setSubmitted(true);
            toast.success('Password reset link sent to your email');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password | BookHaven</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-sm"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="font-serif text-2xl font-bold text-foreground">
                            Book<span className="text-primary">Haven</span>
                        </span>
                    </Link>

                    {!submitted ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                                    Forgot Password?
                                </h1>
                                <p className="text-muted-foreground">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
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
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                    {!loading && <ArrowRight className="h-5 w-5" />}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <Mail className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-2">Check your email</h2>
                                <p className="text-muted-foreground">
                                    We've sent a password reset link to <strong>{email}</strong>
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setSubmitted(false)}
                            >
                                Try different email
                            </Button>
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
