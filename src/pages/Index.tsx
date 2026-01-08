import Hero from '@/components/home/Hero';
import FeaturedVehicles from '@/components/home/FeaturedVehicles';
import Features from '@/components/home/Features';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedVehicles />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
