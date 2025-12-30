import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, BookOpen, DollarSign, MessageSquare, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { motion, Variants } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        totalUsers: 0,
        totalProducts: 0,
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user?.token}` },
                    params: {
                        startDate: dateRange.start,
                        endDate: dateRange.end
                    }
                };

                const { data } = await api.get('/api/orders/stats', config);

                setStats({
                    totalOrders: data.totalOrders,
                    totalSales: data.totalSales,
                    totalUsers: data.totalUsers,
                    totalProducts: data.totalBooks,
                });
            } catch (error) {
                toast.error('Failed to load dashboard stats');
            } finally {
                setLoading(false);
            }
        };

        if (user?.isAdmin) {
            fetchStats();
        }
    }, [user, dateRange]);

    const statCards = [
        { title: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', gradient: 'from-green-500 to-emerald-700' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500', gradient: 'from-blue-500 to-indigo-700' },
        { title: 'Total Books', value: stats.totalProducts, icon: BookOpen, color: 'bg-orange-500', gradient: 'from-orange-500 to-red-700' },
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-500', gradient: 'from-purple-500 to-pink-700' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Admin Dashboard | BookHaven</title>
            </Helmet>

            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-serif text-foreground mb-2">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">Welcome back, <span className="text-primary font-semibold">{user?.name}</span>.</p>
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border shadow-sm">
                        <div className="flex flex-col">
                            <label className="text-[10px] text-muted-foreground ml-1">From</label>
                            <input
                                type="date"
                                className="bg-transparent text-sm p-1 outline-none"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className="h-8 w-[1px] bg-border"></div>
                        <div className="flex flex-col">
                            <label className="text-[10px] text-muted-foreground ml-1">To</label>
                            <input
                                type="date"
                                className="bg-transparent text-sm p-1 outline-none"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            />
                        </div>
                        {(dateRange.start || dateRange.end) && (
                            <button
                                onClick={() => setDateRange({ start: '', end: '' })}
                                className="text-xs text-red-500 hover:underline px-2"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-10"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statCards.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="relative bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <stat.icon className="h-24 w-24" />
                                    </div>
                                    <div className="relative z-10 flex flex-col justify-between h-full">
                                        <div className={`p-3 rounded-lg w-fit mb-4 bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                                            <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                                        </div>
                                        <div className="mt-4 flex items-center text-xs text-green-600 font-medium bg-green-500/10 w-fit px-2 py-1 rounded-full">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            +4.5% from last week
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Quick Actions */}
                            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                                <h2 className="text-xl font-bold font-serif">Quick Actions</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <Link to="/admin/productlist" className="bg-card hover:bg-accent/5 border border-border p-4 rounded-xl shadow-sm flex items-center gap-4 transition-all group">
                                        <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">Manage Products</h3>
                                            <p className="text-xs text-muted-foreground">Add, edit, or remove books</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <Link to="/admin/categorylist" className="bg-card hover:bg-accent/5 border border-border p-4 rounded-xl shadow-sm flex items-center gap-4 transition-all group">
                                        <div className="bg-blue-500/10 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">Categories</h3>
                                            <p className="text-xs text-muted-foreground">Organize your catalog</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <Link to="/admin/messagelist" className="bg-card hover:bg-accent/5 border border-border p-4 rounded-xl shadow-sm flex items-center gap-4 transition-all group">
                                        <div className="bg-purple-500/10 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">Inbox</h3>
                                            <p className="text-xs text-muted-foreground">View customer inquiries</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Recent Orders Overview (Mock or partial) */}
                            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold font-serif">Recent Activity</h2>
                                    <Link to="/admin/orderlist" className="text-sm text-primary hover:underline">View All Orders</Link>
                                </div>
                                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full min-h-[250px] flex items-center justify-center">
                                    <div className="flex flex-col items-center justify-center text-center p-6">
                                        <div className="bg-secondary p-4 rounded-full mb-4">
                                            <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-50" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-1">Check Orders Tab</h3>
                                        <p className="text-muted-foreground max-w-xs">Visit the Orders page to manage and fulfill the latest customer orders.</p>
                                        <Link to="/admin/orderlist" className="mt-4">
                                            <div className="text-primary font-medium flex items-center gap-1 hover:underline">
                                                Go to Orders <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
