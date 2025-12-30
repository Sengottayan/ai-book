import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Users, Shield, ShieldAlert, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';

interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && !currentUser.isAdmin) {
            navigate('/');
        }
        fetchUsers();
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser?.token}` },
            };
            const { data } = await api.get('/api/users', config);
            setUsers(data);
        } catch (error) {
            toast.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${currentUser?.token}` },
                };
                await api.delete(`/api/users/${id}`, config);
                toast.success('User deleted');
                fetchUsers();
            } catch (error) {
                toast.error('Error deleting user');
            }
        }
    };

    const makeAdminHandler = async (id: string, isAdmin: boolean) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser?.token}`
                },
            };
            await api.put(`/api/users/${id}`, { isAdmin: !isAdmin }, config);
            toast.success(isAdmin ? 'User removed from admin' : 'User made admin');
            fetchUsers();
        } catch (error) {
            toast.error('Error updating user');
        }
    };

    // Note: To implement "Make Admin" functionality, you'd typically need a backend endpoint like PUT /api/users/:id
    // For now, we are just listing users and allowing delete. 
    // If you need "Make Admin" feature, we can add it.

    return (
        <AdminLayout>
            <Helmet>
                <title>Users | Admin BookHaven</title>
            </Helmet>
            <div className="w-full">
                <h1 className="text-3xl font-bold font-serif mb-8 flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    Users & Admins
                </h1>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-mono text-xs">{user._id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell><a href={`mailto:${user.email}`} className="text-primary hover:underline">{user.email}</a></TableCell>
                                        <TableCell>
                                            {user.isAdmin ? (
                                                <div className="flex items-center gap-1 text-green-600 font-medium">
                                                    <Shield className="h-4 w-4" /> Admin
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Users className="h-4 w-4" /> User
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {user._id !== currentUser?._id && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => makeAdminHandler(user._id, user.isAdmin)}
                                                        className={user.isAdmin ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                                    >
                                                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteHandler(user._id)}
                                                    disabled={user._id === currentUser?._id} // Prevent deleting self
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
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
        </AdminLayout>
    );
};

export default UserList;
