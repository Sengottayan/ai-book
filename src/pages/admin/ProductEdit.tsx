import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/layout/Layout';
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
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchBook = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
                setTitle(data.title);
                setPrice(data.price);
                setImage(data.coverImage);
                setAuthor(data.author);
                setCategory(data.category);
                setCountInStock(data.stock);
                setDescription(data.description);
                setFeatured(data.featured);
                setBestseller(data.bestseller);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch book details');
                setLoading(false);
            }
        };

        fetchBook();
    }, [id, user, navigate]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
            };

            await axios.put(
                `http://localhost:5000/api/books/${id}`,
                {
                    title,
                    price,
                    coverImage: image,
                    author,
                    category,
                    description,
                    stock: countInStock,
                    featured,
                    bestseller
                },
                config
            );
            toast.success('Book updated successfully');
            navigate('/admin/productlist');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Edit Product | BookHaven</title>
            </Helmet>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
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
        </Layout>
    );
};

export default ProductEdit;
