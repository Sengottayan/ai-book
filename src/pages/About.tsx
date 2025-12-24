import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <Layout>
            <Helmet>
                <title>About Us | BookHaven</title>
            </Helmet>
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <h1 className="font-serif text-4xl font-bold text-center mb-8">About BookHaven</h1>
                    <div className="prose prose-lg dark:prose-invert mx-auto">
                        <p className="lead text-xl text-muted-foreground text-center mb-8">
                            We are passionate about connecting readers with their next favorite story.
                        </p>

                        <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Our Story</h2>
                        <p>
                            Founded in 2024, BookHaven started with a simple mission: to make discovering great books easier and more enjoyable.
                            What began as a small online collection has grown into a comprehensive digital bookstore featuring millions of titles
                            across every genre imaginable.
                        </p>

                        <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Our Mission</h2>
                        <p>
                            We believe that books have the power to transform lives. Whether it's learning a new skill, escaping to a fantasy world,
                            or gaining a fresh perspective, every book offers a unique journey. Our goal is to provide a seamless, personalized
                            shopping experience that helps you find exactly what you're looking for.
                        </p>

                        <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Why Choose Us?</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Curated Selection:</strong> From bestsellers to hidden gems, our collection is carefully managed.</li>
                            <li><strong>AI Recommendations:</strong> Our smart algorithms suggest books based on your reading preferences.</li>
                            <li><strong>Fast Shipping:</strong> We ensure your books arrive quickly and in perfect condition.</li>
                            <li><strong>Community:</strong> Join thousands of other book lovers in our reviews and discussions.</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default About;
