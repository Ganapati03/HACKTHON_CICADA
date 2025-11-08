import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Play, Loader } from 'lucide-react';
import { examAPI } from '../../api/client';
import { toast } from 'sonner';

export default function MyExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getAll();
      setExams(response.data.exams || []);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return <Badge className="bg-[#10b981]/20 text-[#10b981]">Available</Badge>;
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#f1f5f9] mb-2">Available Exams</h1>
        <p className="text-sm sm:text-base text-[#94a3b8] mb-6 sm:mb-8">Take exams and test your knowledge</p>

        {loading ? (
          <div className="flex justify-center py-12 sm:py-20">
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-[#6366f1] animate-spin" />
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-[#1e293b]/40 rounded-lg border border-[#6366f1]/20">
            <p className="text-[#94a3b8] text-base sm:text-lg">No exams available at the moment</p>
          </div>
        ) : (
        <div className="space-y-3 sm:space-y-4">
          {exams.map((exam: any, index) => (
            <motion.div
              key={exam._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                      <h3 className="text-lg sm:text-xl text-[#f1f5f9]">{exam.title}</h3>
                      {getStatusBadge(exam.status)}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-[#94a3b8] text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Duration: {exam.duration} mins</span>
                      </div>
                      <Badge variant="outline" className="border-[#6366f1] text-[#6366f1] text-xs">
                        {exam.difficulty}
                      </Badge>
                      <span>Questions: {exam.questions?.length || 0}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Link to={`/user/exam/${exam._id}`} className="block">
                      <Button className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10">
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                        Start Exam
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        )}
      </motion.div>
    </UserLayout>
  );
}
