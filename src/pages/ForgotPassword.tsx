import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await api.post('/api/users/forgotpassword', { email, password });
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
                                    Reset Password
                                </h1>
                                <p className="text-muted-foreground">
                                    Enter your email and new password to reset it directly.
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

                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button variant="gold" size="lg" className="w-full gap-2" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                    {!loading && <ArrowRight className="h-5 w-5" />}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-2">Password Updated</h2>
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
