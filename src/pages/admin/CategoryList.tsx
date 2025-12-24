import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Category {
    _id: string;
    name: string;
    description: string;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [createLoading, setCreateLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/api/categories');
            setCategories(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch categories');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }
        fetchCategories();
    }, [user, navigate]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory) return;

        setCreateLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
            };
            await api.post('/api/categories', { name: newCategory, description: newDesc }, config);
            toast.success('Category created');
            setNewCategory('');
            setNewDesc('');
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
            };
            await api.delete(`/api/categories/${id}`, config);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Categories | Admin</title>
            </Helmet>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/admin/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold font-serif">Manage Categories</h1>
                </div>

                {/* Create Form */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                    <form onSubmit={handleCreate} className="flex gap-4 items-end">
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium">Name</label>
                            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Fiction" required />
                        </div>
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium">Description</label>
                            <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Optional description" />
                        </div>
                        <Button type="submit" disabled={createLoading}>
                            {createLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
                            Add
                        </Button>
                    </form>
                </div>

                {/* List */}
                {loading ? <div>Loading...</div> : (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((cat) => (
                                    <TableRow key={cat._id}>
                                        <TableCell className="font-mono text-xs">{cat._id}</TableCell>
                                        <TableCell className="font-medium">{cat.name}</TableCell>
                                        <TableCell>{cat.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cat._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No categories found. Start adding some!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CategoryList;
