import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { categories, books } from '@/data/mockBooks';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  return (
    <>
      <Helmet>
        <title>Browse Categories | BookHaven</title>
        <meta
          name="description"
          content="Explore our book categories including Fiction, Non-Fiction, Mystery, Romance, Science Fiction, and more at BookHaven."
        />
      </Helmet>
      <Layout>
        <div className="bg-secondary/30 py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                Browse by Category
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our diverse collection organized by genre. Find exactly what you're looking for.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category, index) => {
              const categoryBooks = books.filter(
                b => b.category.toLowerCase() === category.name.toLowerCase()
              );
              const sampleBooks = categoryBooks.slice(0, 3);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/books?category=${category.slug}`}
                    className="group block bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-4xl mb-2 block">{category.icon}</span>
                        <h2 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          {category.bookCount} books available
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Sample Books */}
                    {sampleBooks.length > 0 && (
                      <div className="flex gap-3 mt-6">
                        {sampleBooks.map((book) => (
                          <div key={book.id} className="flex-1">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full aspect-[3/4] object-cover rounded-lg shadow-soft group-hover:shadow-card transition-shadow"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Categories;
