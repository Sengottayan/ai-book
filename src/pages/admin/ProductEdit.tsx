import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Loader2 } from 'lucide-react';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [featured, setFeatured] = useState(false);
    const [bestseller, setBestseller] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        if (!user || (user && !user.isAdmin)) {
            // navigate('/login'); // Do not navigate here, let the second check handle it or protect route
            // Actually, usually we redirect if not admin.
        }

        const fetchProduct = async () => {
            if (!id) return;
            try {
                const { data } = await api.get(`/api/books/${id}`);
                setTitle(data.title);
                setAuthor(data.author);
                setPrice(data.price);
                setDescription(data.description);
                setCategory(data.category);
                setImage(data.image);
                setCountInStock(data.countInStock);
                setFeatured(data.featured);
                setBestseller(data.bestseller);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch product');
                navigate('/admin/productlist');
                setLoading(false);
            }
        };

        if (user && user.isAdmin) {
            fetchProduct();
        } else if (!user) {
            navigate('/login');
        }
    }, [id, user, navigate]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };

            await api.put(
                `/api/books/${id}`,
                {
                    title,
                    author,
                    price,
                    description,
                    category,
                    image,
                    countInStock,
                    // featured, // Removed as per snippet, but consider if this was intentional
                    // bestseller // Removed as per snippet, but consider if this was intentional
                },
                config
            );
            toast.success('Product updated successfully');
            navigate('/admin/productlist');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Edit Product | BookHaven</title>
            </Helmet>

            <div className="max-w-2xl mx-auto">
                <Link to="/admin/productlist" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                    <ChevronLeft className="h-4 w-4" /> Back to Products
                </Link>

                <h1 className="text-3xl font-bold font-serif mb-8">Edit Product</h1>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Count</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-32"
                                required
                            />
                        </div>

                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="featured"
                                    checked={featured}
                                    onCheckedChange={(checked) => setFeatured(checked as boolean)}
                                />
                                <Label htmlFor="featured">Featured Product</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="bestseller"
                                    checked={bestseller}
                                    onCheckedChange={(checked) => setBestseller(checked as boolean)}
                                />
                                <Label htmlFor="bestseller">Bestseller</Label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loadingUpdate}>
                            {loadingUpdate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Product
                        </Button>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProductEdit;
