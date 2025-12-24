import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, X } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await api.get('/api/orders', config);
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Admin Orders | BookHaven</title>
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold font-serif mb-6">Orders</h1>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>USER</TableHead>
                                    <TableHead>DATE</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                    <TableHead>PAID</TableHead>
                                    <TableHead>DELIVERED</TableHead>
                                    <TableHead>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order: any) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-mono text-xs">{order._id}</TableCell>
                                        <TableCell>{order.user && order.user.name}</TableCell>
                                        <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                                        <TableCell>₹{order.totalPrice}</TableCell>
                                        <TableCell>
                                            {order.isPaid ? (
                                                <div className="text-green-600 flex items-center gap-1">
                                                    <Check className="h-4 w-4" /> {order.paidAt.substring(0, 10)}
                                                </div>
                                            ) : (
                                                <X className="h-4 w-4 text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {order.isDelivered ? (
                                                <div className="text-green-600 flex items-center gap-1">
                                                    <Check className="h-4 w-4" /> {order.deliveredAt.substring(0, 10)}
                                                </div>
                                            ) : (
                                                <X className="h-4 w-4 text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/order/${order._id}`)} // TODO: Create Admin Order Details view logic locally or reuse
                                            >
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default OrderList;
