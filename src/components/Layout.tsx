import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CosmicBackground from './CosmicBackground';
import ScrollStorytelling from './ScrollStorytelling';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Cosmic Background - base layer */}
      <CosmicBackground />
      
      {/* Scroll-driven storytelling elements - blended on top */}
      <ScrollStorytelling />
      
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
