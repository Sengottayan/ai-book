import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Edit, Trash2, Plus } from 'lucide-react';
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

const ProductList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchBooks();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const fetchBooks = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await api.get('/api/books', config);
            setBooks(data);
        } catch (error) {
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };
                await api.delete(`/api/books/${id}`, config);
                toast.success('Book deleted successfully');
                fetchBooks();
            } catch (error) {
                toast.error('Failed to delete book');
            }
        }
    };

    const createBookHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await api.post('/api/books', {}, config);
            toast.success('Sample book created');
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            toast.error('Failed to create book');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Admin Products | BookHaven</title>
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold font-serif">Products</h1>
                    <Button onClick={createBookHandler} className="gap-2">
                        <Plus className="h-4 w-4" /> Create Product
                    </Button>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>NAME</TableHead>
                                    <TableHead>PRICE</TableHead>
                                    <TableHead>CATEGORY</TableHead>
                                    <TableHead>AUTHOR</TableHead>
                                    <TableHead>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.map((book: any) => (
                                    <TableRow key={book._id}>
                                        <TableCell className="font-mono text-xs">{book._id}</TableCell>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>₹{book.price}</TableCell>
                                        <TableCell>{book.category}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/admin/product/${book._id}/edit`)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive/90"
                                                    onClick={() => deleteHandler(book._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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

export default ProductList;
