import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderItem {
    title: string;
    qty: number;
    image: string;
    price: number;
    product: string;
}

interface Order {
    _id: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: string;
    isDelivered: boolean;
    status: string;
    createdAt: string;
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    }
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await api.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (error: any) {
                console.error(error);
                if (error.response?.status === 401) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    return (
        <>
            <Helmet>
                <title>My Orders | BookHaven</title>
            </Helmet>
            <Layout>
                <div className="bg-secondary/30 py-8 border-b border-border">
                    <div className="container mx-auto px-4">
                        <h1 className="font-serif text-3xl font-bold text-foreground">My Orders</h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {loading ? (
                        <div>Loading...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-semibold mb-4">No orders found</h2>
                            <p className="text-muted-foreground">Start shopping to see your orders here.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                                >
                                    <div className="bg-secondary/20 p-4 flex flex-wrap gap-4 justify-between items-center border-b border-border">
                                        <div className="flex gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Order Placed</p>
                                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Total</p>
                                                <p className="font-medium">₹{order.totalPrice}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Order ID</p>
                                                <p className="font-mono text-xs mt-1">{order._id}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/order/${order._id}/invoice`)}
                                            >
                                                Invoice
                                            </Button>

                                            {/* Cancel Button Logic */}
                                            {['Processing', 'Pending', 'Confirmed', 'Packed'].includes(order.status) && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to cancel this order?')) {
                                                            try {
                                                                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                                                                await api.put(`/api/orders/${order._id}/cancel`, {}, config);
                                                                // Refresh orders locally
                                                                const updatedOrders = orders.map(o =>
                                                                    o._id === order._id ? { ...o, status: 'Cancelled' } : o
                                                                );
                                                                setOrders(updatedOrders);
                                                                // Also toast import might be missing, assuming simplified for now or rely on global
                                                            } catch (err) {
                                                                console.error(err);
                                                                alert('Failed to cancel order');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Cancel Order
                                                </Button>
                                            )}

                                            {order.isPaid ? <Badge className="bg-green-600">Paid</Badge> : <Badge variant="destructive">Not Paid</Badge>}
                                            <Badge variant={order.status === 'Cancelled' ? 'destructive' : 'outline'}>{order.status}</Badge>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <img src={item.image} alt={item.title} className="w-16 h-24 object-cover rounded" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                                                </div>
                                                <p className="font-medium">₹{item.price * item.qty}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </Layout>
        </>
    );
};

export default Orders;
