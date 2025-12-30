import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Send, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';

const Newsletter = () => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
            };

            const { data } = await api.post('/api/newsletter/send', { subject, message }, config);

            setSuccess(data.message);
            setSubject('');
            setMessage('');
            toast.success('Newsletter sent successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send newsletter');
            toast.error('Failed to send newsletter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Newsletter | BookHaven Admin</title>
            </Helmet>

            <div className="max-w-2xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif mb-2">Newsletter Marketing</h1>
                    <p className="text-muted-foreground">Make announcements, share offers, and keep your subscribers engaged.</p>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
                    {success && (
                        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSend} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Email Subject</Label>
                            <Input
                                id="subject"
                                type="text"
                                placeholder="e.g., Big Sale on Fantasy Books!"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message Body (HTML supported)</Label>
                            <Textarea
                                id="message"
                                placeholder="Type your message here... You can use HTML tags for formatting."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="min-h-[200px] font-mono text-sm leading-relaxed"
                            />
                            <p className="text-xs text-muted-foreground">
                                Tip: You can simple text or full HTML for rich emails.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" /> Send to All Subscribers
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Newsletter;
