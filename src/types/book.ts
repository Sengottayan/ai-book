export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  genre: string;
  stock: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  publishedDate: string;
  isbn: string;
  pages: number;
  language: string;
  featured?: boolean;
  bestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bookCount: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  address?: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}
