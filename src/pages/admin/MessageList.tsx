import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, Mail, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const MessageList = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Reply Modal State
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replySubject, setReplySubject] = useState('');
    const [replyBody, setReplyBody] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (user && !user.isAdmin) {
            navigate('/');
        }
        fetchMessages();
    }, [user, navigate]);

    const fetchMessages = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
            };
            const { data } = await api.get('/api/messages', config);
            setMessages(data);
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user?.token}` },
                };
                await api.delete(`/api/messages/${id}`, config);
                toast.success('Message deleted');
                fetchMessages();
            } catch (error) {
                toast.error('Failed to delete message');
            }
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
            };
            await api.put(`/api/messages/${id}/read`, {}, config);
            toast.success('Message marked as read');
            fetchMessages();
        } catch (error) {
            toast.error('Failed to update message status');
        }
    };

    const openReplyModal = (msg: Message) => {
        setSelectedMessage(msg);
        setReplySubject(`Re: ${msg.subject}`);
        setReplyBody(`Dear ${msg.name},\n\nThank you for reaching out to BookHaven.\n\nWith regards,\nBookHaven Support Team`);
        setIsReplyOpen(true);
    };

    const handleSendReply = async () => {
        if (!selectedMessage || !replyBody) return;

        if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
            toast.error("EmailJS configuration missing");
            return;
        }

        setSending(true);

        try {
            // Construct Email Logic
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
                    <p>${replyBody.replace(/\n/g, '<br/>')}</p>
                    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">
                        <strong>Original Message from ${selectedMessage.name}:</strong><br/>
                        ${selectedMessage.message}
                    </p>
                </div>
            `;

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_email: selectedMessage.email,
                    subject: replySubject,
                    html_content: htmlContent,
                },
                EMAILJS_PUBLIC_KEY
            );

            toast.success(`Reply sent to ${selectedMessage.email}`);
            setIsReplyOpen(false);

            // Optionally mark as read
            if (!selectedMessage.isRead) {
                markAsRead(selectedMessage._id);
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Messages | Admin BookHaven</title>
            </Helmet>
            <div className="w-full">
                <h1 className="text-3xl font-bold font-serif mb-8 flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    User Messages
                </h1>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((msg) => (
                                    <TableRow key={msg._id} className={msg.isRead ? 'opacity-60' : ''}>
                                        <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{msg.name}</div>
                                                <div className="text-xs text-muted-foreground">{msg.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{msg.subject}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{msg.message}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {msg.isRead ? (
                                                <span className="text-green-600 text-xs font-medium px-2 py-1 bg-green-100 rounded-full">Read</span>
                                            ) : (
                                                <span className="text-yellow-600 text-xs font-medium px-2 py-1 bg-yellow-100 rounded-full">New</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {!msg.isRead && (
                                                    <Button variant="ghost" size="icon" onClick={() => markAsRead(msg._id)} title="Mark as Read">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" onClick={() => openReplyModal(msg)} title="Reply">
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(msg._id)} title="Delete">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {messages.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                No messages found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={replySubject}
                                onChange={(e) => setReplySubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={replyBody}
                                onChange={(e) => setReplyBody(e.target.value)}
                                className="min-h-[150px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReplyOpen(false)} disabled={sending}>Cancel</Button>
                        <Button onClick={handleSendReply} disabled={sending} className="gap-2">
                            {sending ? 'Sending...' : 'Send Reply'}
                            {!sending && <Send className="h-4 w-4" />}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default MessageList;
