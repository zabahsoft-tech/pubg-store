import React from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
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
import { PageViewer } from './pages/PageViewer';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BlogManager } from './pages/admin/BlogManager';
import { BlogEditor } from './pages/admin/BlogEditor';
import { ProductManager } from './pages/admin/ProductManager';
import { ProductEditor } from './pages/admin/ProductEditor';

// Separate Footer Component to access Store Context
const Footer: React.FC = () => {
  const { pages } = useStore();
  // Filter pages that should be shown in footer
  const footerPages = pages.filter(p => p.showInFooter);

  return (
    <footer className="border-t border-dark-800 bg-dark-900 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <div className="flex justify-center flex-wrap gap-6 mb-4">
          {footerPages.map(page => (
            <Link 
              key={page.id} 
              to={`/page/${page.slug}`}
              className="hover:text-brand-400 cursor-pointer transition-colors"
            >
              {page.title}
            </Link>
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
    <div className="min-h-screen bg-dark-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white flex flex-col pb-16 md:pb-0">
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
            
            {/* Dynamic Page Routes */}
            <Route path="/page/:slug" element={<PageViewer />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mobile-topup" element={<MobileTopUp />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            <Route path="/admin/blogs" element={<BlogManager />} />
            <Route path="/admin/blogs/new" element={<BlogEditor />} />
            <Route path="/admin/blogs/:id/edit" element={<BlogEditor />} />
            
            <Route path="/admin/products" element={<ProductManager />} />
            <Route path="/admin/products/new" element={<ProductEditor />} />
            <Route path="/admin/products/:id/edit" element={<ProductEditor />} />

          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;