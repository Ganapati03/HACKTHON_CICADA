import { motion } from 'motion/react';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Calendar, FileText, Briefcase, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function UserDashboard() {
  const stats = [
    { icon: Calendar, label: 'Upcoming Exams', value: '2', color: 'text-[#6366f1]' },
    { icon: FileText, label: 'Completed Exams', value: '5', color: 'text-[#14b8a6]' },
    { icon: Briefcase, label: 'Applications', value: '3', color: 'text-[#f97316]' },
    { icon: TrendingUp, label: 'Avg. Score', value: '87%', color: 'text-[#10b981]' },
  ];

  const upcomingExams = [
    { id: 1, title: 'React Developer Assessment', date: 'Nov 12, 2024', time: '10:00 AM' },
    { id: 2, title: 'Python Programming Test', date: 'Nov 15, 2024', time: '2:00 PM' },
  ];

  const recentApplications = [
    { id: 1, job: 'Senior AI Engineer', status: 'Under Review', date: 'Nov 3, 2024' },
    { id: 2, job: 'Full Stack Developer', status: 'Interview Scheduled', date: 'Nov 1, 2024' },
  ];

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl text-[#f1f5f9] mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#94a3b8] text-sm mb-1">{stat.label}</p>
                    <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Exams */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[#f1f5f9]">Upcoming Exams</h2>
                <Link to="/user/exam-booking">
                  <Button size="sm" className="bg-[#6366f1]">Book More</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-4 bg-[#0f172a]/50 rounded-lg border border-[#6366f1]/20"
                  >
                    <h3 className="text-[#f1f5f9] mb-2">{exam.title}</h3>
                    <div className="flex items-center gap-4 text-[#94a3b8] text-sm">
                      <span>{exam.date}</span>
                      <span>•</span>
                      <span>{exam.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[#f1f5f9]">Recent Applications</h2>
                <Link to="/user/applications">
                  <Button size="sm" className="bg-[#14b8a6]">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-[#0f172a]/50 rounded-lg border border-[#6366f1]/20"
                  >
                    <h3 className="text-[#f1f5f9] mb-2">{app.job}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        app.status === 'Interview Scheduled'
                          ? 'bg-[#10b981]/20 text-[#10b981]'
                          : 'bg-[#f97316]/20 text-[#f97316]'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-[#94a3b8] text-sm">{app.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </UserLayout>
  );
}
