import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Play } from 'lucide-react';

export default function MyExams() {
  const exams = [
    {
      id: 1,
      title: 'React Developer Assessment',
      status: 'active',
      scheduledDate: 'Nov 12, 2024',
      scheduledTime: '10:00 AM',
      duration: '60 mins',
    },
    {
      id: 2,
      title: 'Python Programming Test',
      status: 'booked',
      scheduledDate: 'Nov 15, 2024',
      scheduledTime: '2:00 PM',
      duration: '45 mins',
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      status: 'completed',
      scheduledDate: 'Nov 1, 2024',
      scheduledTime: '11:00 AM',
      duration: '45 mins',
      score: 92,
    },
    {
      id: 4,
      title: 'Data Structures & Algorithms',
      status: 'completed',
      scheduledDate: 'Oct 28, 2024',
      scheduledTime: '3:00 PM',
      duration: '75 mins',
      score: 85,
    },
    {
      id: 5,
      title: 'Cloud Architecture Basics',
      status: 'completed',
      scheduledDate: 'Oct 25, 2024',
      scheduledTime: '10:00 AM',
      duration: '60 mins',
      score: 88,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-[#10b981]/20 text-[#10b981]">Active - Start Now</Badge>;
      case 'booked':
        return <Badge className="bg-[#f97316]/20 text-[#f97316]">Booked</Badge>;
      case 'completed':
        return <Badge className="bg-[#6366f1]/20 text-[#6366f1]">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl text-[#f1f5f9] mb-2">My Exams</h1>
        <p className="text-[#94a3b8] mb-8">Track your booked and completed exams</p>

        <div className="space-y-4">
          {exams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl text-[#f1f5f9]">{exam.title}</h3>
                      {getStatusBadge(exam.status)}
                    </div>
                    
                    <div className="flex items-center gap-6 text-[#94a3b8] text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{exam.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{exam.scheduledTime}</span>
                      </div>
                      <span>Duration: {exam.duration}</span>
                      {exam.status === 'completed' && (
                        <span className="text-[#10b981]">Score: {exam.score}%</span>
                      )}
                    </div>
                  </div>

                  <div>
                    {exam.status === 'active' && (
                      <Link to={`/user/exam/${exam.id}`}>
                        <Button className="bg-gradient-to-r from-[#10b981] to-[#14b8a6]">
                          <Play className="w-4 h-4 mr-2" />
                          Start Exam
                        </Button>
                      </Link>
                    )}
                    {exam.status === 'completed' && (
                      <Link to="/user/results">
                        <Button variant="outline" className="border-[#6366f1] text-[#6366f1]">
                          View Results
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </UserLayout>
  );
}
