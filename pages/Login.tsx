
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, t } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-brand-500/20 rounded-full flex items-center justify-center mb-4">
             <LogIn className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign in to RahatPay</h2>
          <p className="mt-2 text-sm text-gray-400">
            Or <Link to="/admin/register" className="font-medium text-brand-400 hover:text-brand-300">create a new account</Link>
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
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-5 h-5" />}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock className="w-5 h-5" />}
            />
          </div>

          <Button type="submit" className="w-full py-3" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
