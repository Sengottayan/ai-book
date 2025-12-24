import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedBooks from '@/components/home/FeaturedBooks';
import CategorySection from '@/components/home/CategorySection';
import BestsellerSection from '@/components/home/BestsellerSection';
import AIFeatureSection from '@/components/home/AIFeatureSection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>BookHaven - Discover Your Next Great Read | AI-Powered Book Store</title>
        <meta
          name="description"
          content="Explore millions of books with AI-powered recommendations. Find bestsellers, discover new authors, and shop securely at BookHaven."
        />
      </Helmet>
      <Layout>
        <HeroSection />
        <FeaturedBooks />
        <CategorySection />
        <BestsellerSection />
        <AIFeatureSection />
      </Layout>
    </>
  );
};

export default Index;
