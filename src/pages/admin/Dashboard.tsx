import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, BookOpen, DollarSign, MessageSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        totalPaidOrders: 0,
        totalUsers: 0,
        totalBooks: 0
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user?.token}` },
                };
                const { data } = await api.get('/api/orders/stats', config);
                setStats(data);
            } catch (error) {
                toast.error('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.isAdmin) {
            fetchStats();
        }
    }, [user]);

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalSales.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/20',
            link: '/admin/orderlist'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            link: '/admin/orderlist'
        },
        {
            title: 'Total Books',
            value: stats.totalBooks,
            icon: BookOpen,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/20',
            link: '/admin/productlist'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100 dark:bg-indigo-900/20',
            link: '/admin/userlist'
        },
    ];

    return (
        <Layout>
            <Helmet>
                <title>Admin Dashboard | BookHaven</title>
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold font-serif mb-8">Admin Dashboard</h1>

                {loading ? (
                    <div>Loading stats...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {statCards.map((card, index) => (
                            <Link key={index} to={card.link}>
                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-full ${card.bg}`}>
                                            <card.icon className={`h-6 w-6 ${card.color}`} />
                                        </div>
                                    </div>
                                    <h3 className="text-muted-foreground text-sm font-medium">{card.title}</h3>
                                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                                </div>
                            </Link>
                        ))}
                        <Link to="/admin/messagelist">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex items-center justify-between">
                                <div>
                                    <h3 className="text-muted-foreground text-sm font-medium">Messages</h3>
                                    <p className="text-lg font-bold mt-1">View Inquiries</p>
                                </div>
                                <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/20">
                                    <MessageSquare className="h-6 w-6 text-pink-600" />
                                </div>
                            </div>
                        </Link>
                        <Link to="/admin/categorylist">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex items-center justify-between">
                                <div>
                                    <h3 className="text-muted-foreground text-sm font-medium">Categories</h3>
                                    <p className="text-lg font-bold mt-1">Manage Categories</p>
                                </div>
                                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                                    <BookOpen className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
