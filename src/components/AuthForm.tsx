import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { Mail, Lock, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          toast.success('Welcome to CodeDaily!');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          toast.success('Welcome back!');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <label className="block text-sm font-medium text-gray-200">Email</label>
        <div className="mt-1 relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Password</label>
        <div className="mt-1 relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={6}
          />
          <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? <Loader className="animate-spin h-5 w-5" /> : (isRegistering ? 'Sign Up' : 'Sign In')}
      </button>

      <button
        type="button"
        onClick={() => setIsRegistering(!isRegistering)}
        className="w-full text-sm text-blue-400 hover:text-blue-300"
      >
        {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
      </button>
    </form>
  );
}