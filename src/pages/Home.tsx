import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Cloud, Globe, TrendingUp, Users, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [counters, setCounters] = useState({ projects: 0, clients: 0, experts: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        projects: Math.min(prev.projects + 5, 250),
        clients: Math.min(prev.clients + 2, 150),
        experts: Math.min(prev.experts + 1, 50),
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { icon: Brain, title: 'AI Solutions', description: 'Cutting-edge artificial intelligence' },
    { icon: Cloud, title: 'Cloud Services', description: 'Scalable cloud infrastructure' },
    { icon: Globe, title: 'Web Development', description: 'Modern web applications' },
    { icon: TrendingUp, title: 'Analytics', description: 'Data-driven insights' },
    { icon: Zap, title: 'Automation', description: 'Streamlined workflows' },
    { icon: Users, title: 'Consulting', description: 'Expert guidance' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'CTO, TechCorp', text: 'Mastersolis transformed our business with innovative AI solutions.' },
    { name: 'Michael Chen', role: 'CEO, DataFlow', text: 'Outstanding service and cutting-edge technology expertise.' },
    { name: 'Emily Rodriguez', role: 'Director, CloudNet', text: 'The team delivered beyond our expectations every time.' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#14b8a6]/10" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1
              className="text-5xl md:text-7xl text-[#f1f5f9] mb-6 bg-gradient-to-r from-[#6366f1] via-[#14b8a6] to-[#f97316] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Building the Future with Intelligence 🌐
            </motion.h1>
            <p className="text-xl text-[#94a3b8] mb-8 max-w-2xl mx-auto">
              AI-powered solutions that transform businesses and empower innovation
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {user ? (
                <Link to={user.role !== 'user' ? `/admin/${user.role}` : '/user/dashboard'}>
                  <Button className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-full px-8 py-6 hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all">
                    Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-full px-8 py-6 hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all">
                      Join Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="rounded-full px-8 py-6 border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats Counters */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <GlassCard>
              <div className="text-center">
                <p className="text-4xl text-[#6366f1] mb-2">{counters.projects}+</p>
                <p className="text-[#94a3b8]">Projects Delivered</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center">
                <p className="text-4xl text-[#14b8a6] mb-2">{counters.clients}+</p>
                <p className="text-[#94a3b8]">Happy Clients</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center">
                <p className="text-4xl text-[#f97316] mb-2">{counters.experts}+</p>
                <p className="text-[#94a3b8]">Expert Team</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl text-[#f1f5f9] text-center mb-12"
          >
            Our Services
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="group hover:border-[#6366f1] transition-colors">
                  <div className="relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#14b8a6] opacity-0 group-hover:opacity-10 transition-opacity"
                    />
                    <service.icon className="w-12 h-12 text-[#6366f1] mb-4" />
                    <h3 className="text-xl text-[#f1f5f9] mb-2">{service.title}</h3>
                    <p className="text-[#94a3b8]">{service.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-[#1e293b]/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl text-[#f1f5f9] text-center mb-12"
          >
            What Our Clients Say
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <p className="text-[#94a3b8] mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t border-[#6366f1]/20 pt-4">
                    <p className="text-[#f1f5f9]">{testimonial.name}</p>
                    <p className="text-[#6366f1] text-sm">{testimonial.role}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[#6366f1]/20">
        <div className="max-w-7xl mx-auto text-center text-[#94a3b8]">
          <p>© 2024 Mastersolis Infotech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
