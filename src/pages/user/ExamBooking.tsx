import { motion } from 'motion/react';
import { useState } from 'react';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function ExamBooking() {
  const [bookedExams, setBookedExams] = useState<number[]>([]);

  const exams = [
    {
      id: 1,
      title: 'React Developer Assessment',
      description: 'Test your React.js skills with advanced concepts',
      duration: '60 mins',
      questions: '40',
      difficulty: 'Intermediate',
      topics: ['React', 'JavaScript', 'Hooks', 'State Management'],
    },
    {
      id: 2,
      title: 'Python Programming Test',
      description: 'Comprehensive Python assessment for all levels',
      duration: '45 mins',
      questions: '30',
      difficulty: 'Advanced',
      topics: ['Python', 'OOP', 'Data Structures', 'Algorithms'],
    },
    {
      id: 3,
      title: 'Cloud Architecture Exam',
      description: 'AWS and Azure cloud solutions assessment',
      duration: '90 mins',
      questions: '50',
      difficulty: 'Advanced',
      topics: ['AWS', 'Azure', 'DevOps', 'Kubernetes'],
    },
    {
      id: 4,
      title: 'Data Structures & Algorithms',
      description: 'Core DSA concepts and problem solving',
      duration: '75 mins',
      questions: '35',
      difficulty: 'Intermediate',
      topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
    },
    {
      id: 5,
      title: 'Machine Learning Basics',
      description: 'Fundamentals of ML and AI concepts',
      duration: '60 mins',
      questions: '40',
      difficulty: 'Beginner',
      topics: ['ML', 'Statistics', 'Python', 'scikit-learn'],
    },
    {
      id: 6,
      title: 'Full Stack Development',
      description: 'End-to-end web development assessment',
      duration: '120 mins',
      questions: '60',
      difficulty: 'Advanced',
      topics: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    },
  ];

  const handleBookExam = (examId: number, examTitle: string) => {
    setBookedExams([...bookedExams, examId]);
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
        <p className="text-[#94a3b8] mb-8">Choose from available assessments</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exams.map((exam, index) => {
            const isBooked = bookedExams.includes(exam.id);
            
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl text-[#f1f5f9]">{exam.title}</h3>
                    <Badge className={`${
                      exam.difficulty === 'Beginner'
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : exam.difficulty === 'Intermediate'
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
                      <span>{exam.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{exam.questions} questions</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[#94a3b8] text-sm mb-2">Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {exam.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="bg-[#6366f1]/10 border-[#6366f1] text-[#6366f1]">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBookExam(exam.id, exam.title)}
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
      </motion.div>
    </UserLayout>
  );
}
