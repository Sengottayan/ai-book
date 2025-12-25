import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

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
    }

    return (
        <Layout>
            <Helmet>
                <title>Messages | Admin BookHaven</title>
            </Helmet>
            <div className="container mx-auto px-4 py-8">
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
                                                <Button variant="ghost" size="icon" onClick={() => window.location.href = `mailto:${msg.email}`}>
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(msg._id)}>
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
        </Layout>
    );
};

export default MessageList;
