import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, BookOpen, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { examAPI, examRequestAPI } from '../../api/client';

export default function ExamBooking() {
  const [bookedExams, setBookedExams] = useState([]);
  const [exams, setExams] = useState([]);
  const [examRequests, setExamRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableExams();
  }, []);

  const fetchAvailableExams = async () => {
    try {
      setLoading(true);
      // Fetch all exams and exam requests
      const [examsRes, requestsRes] = await Promise.all([
        examAPI.getAll(),
        examRequestAPI.getAll(),
      ]);
      
      const allExams = examsRes.data.exams || [];
      const allRequests = requestsRes.data.requests || [];
      
      // Filter exams that are linked to completed requests
      const completedRequestExamIds = allRequests
        .filter((req: any) => req.status === 'completed' && req.examId)
        .map((req: any) => req.examId._id || req.examId);
      
      // Show only exams that are from completed requests OR all active exams
      const availableExams = allExams.filter((exam: any) => 
        exam.status === 'Active' && 
        (completedRequestExamIds.includes(exam._id) || completedRequestExamIds.length === 0)
      );
      
      setExams(availableExams);
      setExamRequests(allRequests);
      console.log('📝 Available exams for booking:', availableExams.length);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleBookExam = (examId: string, examTitle: string) => {
    setBookedExams([...bookedExams, examId as any]);
    toast.success('Exam booked successfully!', {
      description: `${examTitle} has been added to your schedule`,
    });
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl text-[#f1f5f9] mb-2">Book Exam</h1>
        <p className="text-[#94a3b8] mb-8">Choose from available assessments approved by HR</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 bg-[#1e293b]/40 rounded-lg border border-[#6366f1]/20">
            <BookOpen className="w-16 h-16 text-[#94a3b8] mx-auto mb-4" />
            <h3 className="text-xl text-[#f1f5f9] mb-2">No Exams Available</h3>
            <p className="text-[#94a3b8]">No approved exams available for booking at the moment.</p>
            <p className="text-[#94a3b8] text-sm mt-2">HR will request exams to be created by examiners soon.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exams.map((exam: any, index) => {
            const isBooked = bookedExams.includes(exam._id);
            
            return (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl text-[#f1f5f9]">{exam.title}</h3>
                    <Badge className={`${
                      exam.difficulty === 'beginner'
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : exam.difficulty === 'intermediate'
                        ? 'bg-[#f97316]/20 text-[#f97316]'
                        : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }`}>
                      {exam.difficulty}
                    </Badge>
                  </div>

                  <p className="text-[#94a3b8] mb-4">{exam.description}</p>

                  <div className="flex items-center gap-6 mb-4 text-[#94a3b8] text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{exam.questions?.length || 0} questions</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBookExam(exam._id, exam.title)}
                    disabled={isBooked}
                    className={`w-full mt-auto ${
                      isBooked
                        ? 'bg-[#10b981]'
                        : 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6]'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Booked
                      </>
                    ) : (
                      'Book Now'
                    )}
                  </Button>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
        )}
      </motion.div>
    </UserLayout>
  );
}
