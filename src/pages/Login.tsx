import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Brain, Users, Shield, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import GlassCard from '../components/GlassCard';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#14b8a6]/10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-2xl relative z-10"
      >
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-[#6366f1]" />
            </motion.div>
            <span className="text-xl sm:text-2xl text-[#f1f5f9]">Mastersolis</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl text-[#f1f5f9] mb-2">Choose Login Type</h1>
          <p className="text-sm sm:text-base text-[#94a3b8]">Select your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link to="/login/user">
            <GlassCard className="h-full">
              <div className="text-center p-4 sm:p-6">
                <div className="mb-3 sm:mb-4 inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#6366f1]/20">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#6366f1]" />
                </div>
                <h2 className="text-lg sm:text-2xl text-[#f1f5f9] mb-2">User Login</h2>
                <p className="text-xs sm:text-sm text-[#94a3b8] mb-4 sm:mb-6">
                  Access your candidate portal, take assessments, and track your progress
                </p>
                <Button className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg text-sm sm:text-base">
                  Continue as User
                </Button>
              </div>
            </GlassCard>
          </Link>

          <Link to="/admin/login">
            <GlassCard className="h-full">
              <div className="text-center p-4 sm:p-6">
                <div className="mb-3 sm:mb-4 inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#14b8a6]/20">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#14b8a6]" />
                </div>
                <h2 className="text-lg sm:text-2xl text-[#f1f5f9] mb-2">Admin Login</h2>
                <p className="text-xs sm:text-sm text-[#94a3b8] mb-4 sm:mb-6">
                  Access admin dashboard for developers, HR managers, and examiners
                </p>
                <Button className="w-full bg-gradient-to-r from-[#14b8a6] to-[#6366f1] rounded-lg text-sm sm:text-base">
                  Continue as Admin
                </Button>
              </div>
            </GlassCard>
          </Link>
        </div>

        <p className="text-center text-xs sm:text-sm text-[#94a3b8] mt-4 sm:mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#6366f1] hover:underline">
            Sign up as user
          </Link>
          {' '}or{' '}
          <Link to="/admin/signup" className="text-[#14b8a6] hover:underline">
            request admin access
          </Link>
        </p>

        <div className="text-center mt-4 sm:mt-6">
          <Link to="/">
            <Button className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg px-4 sm:px-6 text-sm sm:text-base">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
