
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const { register, isAuthenticated } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password_confirmation) {
        setError("Passwords do not match");
        return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-brand-500/20 rounded-full flex items-center justify-center mb-4">
             <UserPlus className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account? <Link to="/admin/login" className="font-medium text-brand-400 hover:text-brand-300">Sign in</Link>
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl" onSubmit={handleSubmit}>
          {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
             </div>
          )}
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              icon={<User className="w-5 h-5" />}
            />
            <Input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              icon={<Mail className="w-5 h-5" />}
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              icon={<Lock className="w-5 h-5" />}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              required
              icon={<Lock className="w-5 h-5" />}
            />
          </div>

          <Button type="submit" className="w-full py-3" isLoading={isLoading}>
            Sign Up
          </Button>
          
          <p className="text-xs text-center text-gray-500">
             By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};
