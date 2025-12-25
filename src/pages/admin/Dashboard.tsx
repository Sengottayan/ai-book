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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((card, index) => (
                            <Link key={index} to={card.link} className="block group">
                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div className={`p-3 rounded-xl ${card.bg}`}>
                                            <card.icon className={`h-6 w-6 ${card.color}`} />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                                            +2.5%
                                        </span>
                                    </div>
                                    <h3 className="text-muted-foreground text-sm font-medium relative z-10">{card.title}</h3>
                                    <p className="text-2xl font-bold mt-2 relative z-10">{card.value}</p>
                                    <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full ${card.bg} opacity-20 group-hover:scale-150 transition-transform duration-500`} />
                                </div>
                            </Link>
                        ))}
                    </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold font-serif mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            <Link to="/admin/productlist" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Manage Products</h3>
                                        <p className="text-sm text-muted-foreground">Add or edit books</p>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/admin/categorylist" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Manage Categories</h3>
                                        <p className="text-sm text-muted-foreground">Update book categories</p>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/admin/messagelist" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group">
                                    <div className="p-2 bg-pink-100 text-pink-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Customer Messages</h3>
                                        <p className="text-sm text-muted-foreground">View inquiries</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Orders Placeholder (Would ideally fetch real recent orders) */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold font-serif">Recent Orders</h2>
                            <Link to="/admin/orderlist" className="text-sm text-primary hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Order #{Math.floor(Math.random() * 10000)}</p>
                                            <p className="text-sm text-muted-foreground">Just now - Pending</p>
                                        </div>
                                    </div>
                                    <span className="font-bold">₹{(Math.random() * 1000).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
