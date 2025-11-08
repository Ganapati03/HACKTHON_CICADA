import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import GlassCard from '../components/GlassCard';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await signup(email, password, name);
      toast.success('Account created!', {
        description: 'Welcome to Mastersolis Infotech',
      });
      navigate('/user/dashboard');
    } catch (error) {
      toast.error('Signup failed', {
        description: 'Please try again',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#14b8a6]/10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="w-10 h-10 text-[#6366f1]" />
            </motion.div>
            <span className="text-2xl text-[#f1f5f9]">Mastersolis</span>
          </Link>
          <h1 className="text-3xl text-[#f1f5f9] mb-2">Create Account</h1>
          <p className="text-[#94a3b8]">Join us as a candidate and start your journey</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[#f1f5f9] mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#f1f5f9] mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#f1f5f9] mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#f1f5f9] mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg py-6"
            >
              Create Account
            </Button>

            <p className="text-center text-[#94a3b8]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6366f1] hover:underline">
                Login
              </Link>
            </p>

            <p className="text-center text-[#94a3b8] text-sm">
              Need admin access?{' '}
              <Link to="/admin/signup" className="text-[#14b8a6] hover:underline">
                Request here
              </Link>
            </p>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
