import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner@2.0.3';
import GlassCard from '../components/GlassCard';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('user');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      toast.success('Welcome back!', {
        description: 'Login successful',
      });
      
      const from = (location.state as any)?.from || (role === 'user' ? '/user/dashboard' : `/admin/${role}`);
      navigate(from);
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your credentials',
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
          <h1 className="text-3xl text-[#f1f5f9] mb-2">Welcome Back</h1>
          <p className="text-[#94a3b8]">Login to access your portal</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[#f1f5f9] mb-2 block">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#6366f1]/30">
                  <SelectItem value="user">User / Candidate</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="hr">HR Manager</SelectItem>
                  <SelectItem value="examiner">Examiner</SelectItem>
                </SelectContent>
              </Select>
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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg py-6"
            >
              Login
            </Button>

            <p className="text-center text-[#94a3b8]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#6366f1] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </GlassCard>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <GlassCard hover={false} className="bg-[#6366f1]/10">
            <p className="text-[#94a3b8] text-sm">
              💡 Demo: Use any email/password to login. Select your role to access different dashboards.
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
