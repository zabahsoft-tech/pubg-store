
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
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
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Server, RefreshCcw, Code, Terminal, Loader2 } from 'lucide-react';
import { Button } from './components/ui/Button';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BlogManager } from './pages/admin/BlogManager';
import { BlogEditor } from './pages/admin/BlogEditor';
import { ProductManager } from './pages/admin/ProductManager';
import { ProductEditor } from './pages/admin/ProductEditor';

const Footer: React.FC = () => {
  const { pages } = useStore();
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

const CriticalErrorScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-dark-800 border border-red-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-red-500/5">
                <Server className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-4">Backend Configuration Error</h1>
            <p className="text-gray-400 mb-8 text-lg">
                Your Laravel backend is missing a required Rate Limiter. This must be fixed in your PHP code.
            </p>
            
            <div className="space-y-6 text-left">
                <div className="bg-dark-900 rounded-2xl border border-dark-700 overflow-hidden shadow-inner">
                    <div className="bg-dark-700/50 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <Code className="w-4 h-4 text-brand-400" />
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AppServiceProvider.php</span>
                        </div>
                        <Terminal className="w-4 h-4 text-gray-600" />
                    </div>
                    <pre className="p-6 overflow-x-auto text-[13px] leading-relaxed text-brand-300 font-mono">
{`use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;

public function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });
}`}
                    </pre>
                </div>

                <Button 
                    onClick={() => { window.localStorage.removeItem('api_critical_error'); window.location.reload(); }} 
                    className="w-full py-4 text-lg"
                >
                    <RefreshCcw className="w-5 h-5 mr-2" /> I've fixed it, try again
                </Button>
            </div>
        </div>
    </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const criticalError = window.localStorage.getItem('api_critical_error');

  if (criticalError) {
      return <CriticalErrorScreen message={criticalError} />;
  }

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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isAuthLoading } = useStore();
    const hasToken = localStorage.getItem('auth_token');

    // While determining auth status on refresh
    if (isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="animate-spin h-12 w-12 text-brand-500" />
                <p className="text-gray-500 font-medium">Securing session...</p>
            </div>
        );
    }

    // Only redirect if we definitely don't have a token or the auth check failed
    if (!isAuthenticated && !hasToken) {
        return <Navigate to="/admin/login" replace />;
    }
    
    return <>{children}</>;
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
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/page/:slug" element={<PageViewer />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/mobile-topup" element={<ProtectedRoute><MobileTopUp /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/blogs" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
            <Route path="/admin/blogs/new" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
            <Route path="/admin/blogs/:id/edit" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
            <Route path="/admin/products/new" element={<ProtectedRoute><ProductEditor /></ProtectedRoute>} />
            <Route path="/admin/products/:id/edit" element={<ProtectedRoute><ProductEditor /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
