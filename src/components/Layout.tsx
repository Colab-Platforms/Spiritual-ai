import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import cosmicBg from '@/assets/cosmic-constellation-bg.jpg';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Constellation Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${cosmicBg})`,
          zIndex: -2,
        }}
        aria-hidden="true"
      />
      
      {/* Dark overlay for better text readability */}
      <div 
        className="fixed inset-0 bg-background/40"
        style={{ zIndex: -1 }}
        aria-hidden="true"
      />
      
      {/* Grain overlay for texture */}
      <div className="grain-overlay" />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
