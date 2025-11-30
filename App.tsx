import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { MobileTopUp } from './pages/MobileTopUp';
import { ProductDetails } from './pages/ProductDetails';
import { BlogPostPage } from './pages/BlogPost';
import { BlogList } from './pages/BlogList';

// Separate Footer Component to access Store Context
const Footer: React.FC = () => {
  const { pages } = useStore();
  const footerPages = pages.filter(p => p.showInFooter);

  return (
    <footer className="border-t border-dark-800 bg-dark-900 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <div className="flex justify-center space-x-6 mb-4 rtl:space-x-reverse">
          {footerPages.map(page => (
            <span key={page.id} className="hover:text-brand-400 cursor-pointer transition-colors">
              {page.title}
            </span>
          ))}
          <span className="hover:text-brand-400 cursor-pointer transition-colors">Support</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Rahat Pay. All rights reserved.</p>
      </div>
    </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Public Blog Routes */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mobile-topup" element={<MobileTopUp />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;