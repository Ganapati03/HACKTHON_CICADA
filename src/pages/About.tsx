import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Target, Eye, Award } from 'lucide-react';

export default function About() {
  const milestones = [
    { year: '2018', event: 'Company Founded' },
    { year: '2019', event: 'First AI Product Launch' },
    { year: '2021', event: '100+ Clients Milestone' },
    { year: '2023', event: 'Global Expansion' },
    { year: '2024', event: 'Industry Leader Award' },
  ];

  const team = [
    { name: 'Dr. Alex Thompson', role: 'Chief AI Officer', bio: 'PhD in Machine Learning, 15+ years experience' },
    { name: 'Sarah Martinez', role: 'CTO', bio: 'Former Senior Engineer at Google, Cloud Expert' },
    { name: 'James Wilson', role: 'Head of Innovation', bio: 'Serial entrepreneur, AI visionary' },
    { name: 'Lisa Chen', role: 'Lead Developer', bio: 'Full-stack expert, Open source contributor' },
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
            <h1 className="text-5xl text-[#f1f5f9] mb-6">About Mastersolis</h1>
            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
              Pioneering the future of technology with AI-driven innovation and excellence
            </p>
          </motion.div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard>
                <Target className="w-12 h-12 text-[#6366f1] mb-4" />
                <h3 className="text-xl text-[#f1f5f9] mb-3">Our Mission</h3>
                <p className="text-[#94a3b8]">
                  To empower businesses worldwide with intelligent solutions that drive growth and innovation.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <Eye className="w-12 h-12 text-[#14b8a6] mb-4" />
                <h3 className="text-xl text-[#f1f5f9] mb-3">Our Vision</h3>
                <p className="text-[#94a3b8]">
                  To be the global leader in AI-powered technology solutions and digital transformation.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard>
                <Award className="w-12 h-12 text-[#f97316] mb-4" />
                <h3 className="text-xl text-[#f1f5f9] mb-3">Our Values</h3>
                <p className="text-[#94a3b8]">
                  Innovation, integrity, excellence, and customer success are at the heart of everything we do.
                </p>
              </GlassCard>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-20"
          >
            <h2 className="text-3xl text-[#f1f5f9] text-center mb-12">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#6366f1] via-[#14b8a6] to-[#f97316]" />
              
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <GlassCard hover={false}>
                      <p className="text-[#6366f1]">{milestone.year}</p>
                      <p className="text-[#f1f5f9]">{milestone.event}</p>
                    </GlassCard>
                  </div>
                  <div className="w-4 h-4 bg-[#6366f1] rounded-full border-4 border-[#0f172a] z-10" />
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-3xl text-[#f1f5f9] text-center mb-12">AI-Powered Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6366f1] to-[#14b8a6] rounded-full mx-auto mb-4" />
                    <h3 className="text-[#f1f5f9] text-center mb-1">{member.name}</h3>
                    <p className="text-[#6366f1] text-sm text-center mb-3">{member.role}</p>
                    <p className="text-[#94a3b8] text-sm text-center">{member.bio}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
