import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/api/messages', formData);
            toast.success('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Contact Us | BookHaven</title>
                <meta name="description" content="Get in touch with BookHaven. We are here to help with any questions or concerns." />
            </Helmet>

            <div className="bg-secondary/30 py-12 border-b border-border">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Contact Us</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Have a question about an order, a book, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="font-serif text-2xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-muted-foreground mb-8">
                                Fill out the form and our team will get back to you within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Our Location</h3>
                                    <p className="text-muted-foreground">
                                        123 Book Street, Library District,<br />
                                        New Delhi, India - 110001
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Phone Support</h3>
                                    <p className="text-muted-foreground">+91 98765 43210</p>
                                    <p className="text-xs text-muted-foreground mt-1">Mon-Fri from 9am to 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Email Us</h3>
                                    <p className="text-muted-foreground">support@bookhaven.com</p>
                                    <p className="text-xs text-muted-foreground mt-1">We'll reply as soon as possible</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card p-8 rounded-2xl shadow-soft border border-border"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Your message here..."
                                    className="min-h-[150px]"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button type="submit" variant="gold" className="w-full gap-2" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
