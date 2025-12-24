import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-[120px]" />
      </div>

      {/* Floating Books Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BookOpen className="w-16 h-16 md:w-24 md:h-24" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Recommendations</span>
            </motion.div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-paper leading-tight mb-6">
              Discover Your{' '}
              <span className="text-gradient-gold">Next Great</span>{' '}
              Adventure
            </h1>

            <p className="text-lg md:text-xl text-paper/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Explore millions of books from bestsellers to rare finds. Let our AI assistant help you discover your perfect read.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/books">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Start Exploring
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="paper" size="xl" className="w-full sm:w-auto">
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-paper/10"
            >
              {[
                { value: '50K+', label: 'Books' },
                { value: '10K+', label: 'Authors' },
                { value: '500K+', label: 'Readers' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-paper/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image/Books Stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Stacked Books Visual */}
              {[
                { rotate: -15, translate: { x: -20, y: 20 }, z: 1 },
                { rotate: -5, translate: { x: 0, y: 0 }, z: 2 },
                { rotate: 8, translate: { x: 30, y: -10 }, z: 3 },
              ].map((book, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-48 h-72 rounded-lg shadow-elevated overflow-hidden"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${book.rotate}deg) translateX(${book.translate.x}px) translateY(${book.translate.y}px)`,
                    zIndex: book.z,
                  }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={[
                      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
                      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
                      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
                    ][i]}
                    alt="Book cover"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/30 blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/30 blur-2xl"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
