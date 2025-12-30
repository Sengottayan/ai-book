import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, X, Edit, Truck } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import AdminLayout from '@/components/layout/AdminLayout';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Dialog State
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    const STATUS_OPTIONS = [
        'Pending',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
        'Refunded'
    ];

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

    const handleEditStatus = (order: any) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsDialogOpen(true);
    };

    const saveStatus = async () => {
        if (!selectedOrder) return;
        setUpdating(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
            };
            await api.put(`/api/orders/${selectedOrder._id}/status`, { status: newStatus }, config);
            toast.success('Order status updated');
            setIsDialogOpen(false);
            fetchOrders(); // Refresh list
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Admin Orders | BookHaven</title>
            </Helmet>

            <div className="w-full">
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
                                    <TableHead>STATUS</TableHead>
                                    <TableHead>PAID</TableHead>
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
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {order.isPaid ? (
                                                <div className="text-green-600 flex items-center gap-1">
                                                    <Check className="h-4 w-4" /> {order.paidAt?.substring(0, 10)}
                                                </div>
                                            ) : (
                                                <X className="h-4 w-4 text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => handleEditStatus(order)}
                                            >
                                                <Edit className="h-4 w-4" /> Update
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Status Update Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Current Status: <span className="font-bold">{selectedOrder?.status}</span></Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">New Status</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={updating}>Cancel</Button>
                        <Button onClick={saveStatus} disabled={updating}>
                            {updating ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default OrderList;
