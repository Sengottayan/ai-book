import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
  index?: number;
}

const BookCard = ({ book, index = 0 }: BookCardProps) => {
  const { addToCart } = useCart();

  const discount = book.originalPrice 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {book.bestseller && (
          <Badge className="bg-accent text-accent-foreground">
            Bestseller
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-primary text-primary-foreground">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card hover:text-accent">
        <Heart className="h-4 w-4" />
      </button>

      {/* Cover Image */}
      <Link to={`/book/${book.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {book.category}
          </span>
        </div>
        
        <Link to={`/book/${book.id}`}>
          <h3 className="font-serif font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mt-1">
          by {book.author}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{book.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({book.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{book.price}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{book.originalPrice}
              </span>
            )}
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              addToCart(book);
            }}
            className="gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
