import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import BookCard from '@/components/books/BookCard';
import { Book } from '@/types/book';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<ExtendedBook | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);

  // Extend Book type locally to include reviews if not in main type
  interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    user: string;
    createdAt: string;
  }

  interface ExtendedBook extends Book {
    reviews?: Review[];
  }

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingReview(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      await axios.post(
        `http://localhost:5000/api/books/${id}/reviews`,
        { rating, comment },
        config
      );
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      // Refetch book to show new review
      const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
      data.id = data._id;
      setBook(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Review submission failed');
    } finally {
      setLoadingReview(false);
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
        // Map _id to id
        data.id = data._id;
        setBook(data);

        // Fetch related books
        const relatedRes = await axios.get(`http://localhost:5000/api/books?category=${data.category}`);
        const related = relatedRes.data
          .filter((b: any) => b._id !== data._id)
          .map((b: any) => ({ ...b, id: b._id }))
          .slice(0, 4);
        setRelatedBooks(related);

      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the book you're looking for.</p>
          <Link to="/books">
            <Button>Browse All Books</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <>
      <Helmet>
        <title>{`${book.title} by ${book.author} | BookHaven`}</title>
        <meta name="description" content={book.description} />
      </Helmet>
      <Layout>
        {/* Breadcrumb */}
        <div className="bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/books" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Books
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{book.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Book Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="sticky top-24">
                <div className="relative aspect-[3/4] max-w-md mx-auto rounded-xl overflow-hidden shadow-elevated">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {book.bestseller && (
                      <Badge className="bg-accent text-accent-foreground">Bestseller</Badge>
                    )}
                    {discount > 0 && (
                      <Badge className="bg-primary text-primary-foreground">{discount}% OFF</Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Category */}
              <div>
                <Link
                  to={`/books?category=${book.category.toLowerCase()}`}
                  className="text-sm text-primary font-medium uppercase tracking-wider hover:underline"
                >
                  {book.category}
                </Link>
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  by <span className="text-foreground font-medium">{book.author}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(book.rating)
                        ? 'fill-primary text-primary'
                        : 'text-muted'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{book.rating}</span>
                <span className="text-muted-foreground">
                  ({book.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-foreground">
                  ₹{book.price}
                </span>
                {book.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{book.originalPrice}
                    </span>
                    <Badge variant="outline" className="text-primary border-primary">
                      Save ₹{book.originalPrice - book.price}
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${book.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                <span className="text-sm">
                  {book.stock > 10 ? 'In Stock' : `Only ${book.stock} left`}
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-md hover:bg-card flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    className="h-10 w-10 rounded-md hover:bg-card flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => addToCart(book, quantity)}
                  className="flex-1 md:flex-none gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => {
                    if (isInWishlist(book.id)) {
                      removeFromWishlist(book.id);
                    } else {
                      addToWishlist(book);
                    }
                  }}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(book.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
                {[
                  { icon: Truck, title: 'Free Delivery', desc: 'Orders over ₹499' },
                  { icon: Shield, title: 'Secure Payment', desc: 'Cashfree Gateway' },
                  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="pt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
                </TabsContent>
                <TabsContent value="details" className="pt-4">
                  <dl className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'ISBN', value: book.isbn },
                      { label: 'Pages', value: book.pages },
                      { label: 'Language', value: book.language },
                      { label: 'Published', value: new Date(book.publishedDate).toLocaleDateString() },
                      { label: 'Category', value: book.category },
                      { label: 'Genre', value: book.genre },
                    ].map((detail) => (
                      <div key={detail.label}>
                        <dt className="text-sm text-muted-foreground">{detail.label}</dt>
                        <dd className="font-medium">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold">Customer Reviews</h3>
                    {book.reviews && book.reviews.length === 0 ? (
                      <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    ) : (
                      book.reviews?.map((review: any) => (
                        <div key={review._id} className="bg-secondary/20 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">{review.name}</span>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{review.createdAt?.substring(0, 10)}</p>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {user ? (
                    <div className="bg-card border border-border p-6 rounded-xl">
                      <h4 className="font-bold mb-4">Write a Customer Review</h4>
                      <form onSubmit={submitReviewHandler} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Rating</Label>
                          <Select onValueChange={(v) => setRating(Number(v))} value={rating.toString()}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Poor</SelectItem>
                              <SelectItem value="2">2 - Fair</SelectItem>
                              <SelectItem value="3">3 - Good</SelectItem>
                              <SelectItem value="4">4 - Very Good</SelectItem>
                              <SelectItem value="5">5 - Excellent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Comment</Label>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                        <Button type="submit" disabled={loadingReview}>
                          {loadingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to write a review
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <section className="mt-16 pt-16 border-t border-border">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedBooks.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
};

export default BookDetail;
