import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Brain, Cloud, Code, Database, Lock, TrendingUp } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Brain,
      title: 'Artificial Intelligence',
      description: 'Machine learning, NLP, and computer vision solutions',
      features: ['Custom AI Models', 'Predictive Analytics', 'Automation', 'Deep Learning'],
      color: 'from-[#6366f1] to-[#8b5cf6]',
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and migration services',
      features: ['AWS/Azure/GCP', 'Cloud Migration', 'DevOps', 'Serverless'],
      color: 'from-[#14b8a6] to-[#06b6d4]',
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Modern, responsive web applications and platforms',
      features: ['React/Next.js', 'Full-stack Development', 'API Integration', 'UI/UX Design'],
      color: 'from-[#f97316] to-[#fb923c]',
    },
    {
      icon: TrendingUp,
      title: 'Data Analytics',
      description: 'Transform data into actionable business insights',
      features: ['Business Intelligence', 'Data Visualization', 'Real-time Analytics', 'Reporting'],
      color: 'from-[#ec4899] to-[#f472b6]',
    },
    {
      icon: Database,
      title: 'Database Management',
      description: 'Efficient database design and optimization',
      features: ['SQL/NoSQL', 'Data Modeling', 'Performance Tuning', 'Backup Solutions'],
      color: 'from-[#10b981] to-[#34d399]',
    },
    {
      icon: Lock,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions and audits',
      features: ['Security Audits', 'Penetration Testing', 'Compliance', 'Threat Detection'],
      color: 'from-[#ef4444] to-[#f87171]',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl text-[#f1f5f9] mb-6">Our Services</h1>
            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full group relative overflow-hidden">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl text-[#f1f5f9] mb-3">{service.title}</h3>
                    <p className="text-[#94a3b8] mb-4">{service.description}</p>
                    
                    <div className="space-y-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`} />
                          <span className="text-[#94a3b8] text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <motion.div
                      className={`mt-6 h-1 rounded-full bg-gradient-to-r ${service.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-20 text-center"
          >
            <GlassCard className="max-w-2xl mx-auto">
              <h2 className="text-3xl text-[#f1f5f9] mb-4">Ready to Transform Your Business?</h2>
              <p className="text-[#94a3b8] mb-6">
                Let's discuss how our services can help you achieve your goals
              </p>
              <a href="/contact">
                <button className="px-8 py-3 bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-full text-white hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all">
                  Get Started
                </button>
              </a>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
