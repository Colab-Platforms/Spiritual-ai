import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StarField from './StarField';
import FloatingPlanets from './FloatingPlanets';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Effects */}
      <StarField />
      <FloatingPlanets />
      
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
