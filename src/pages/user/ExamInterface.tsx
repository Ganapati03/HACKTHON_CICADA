import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { AlertTriangle, ChevronLeft, ChevronRight, Flag, Sparkles, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { examAPI } from '../../api/client';

export default function ExamInterface() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getById(examId);
      const examData = response.data.exam;
      setExam(examData);
      setTimeLeft(examData.duration * 60); // Convert minutes to seconds
    } catch (error) {
      console.error('Failed to fetch exam:', error);
      toast.error('Failed to load exam');
      navigate('/user/exams');
    } finally {
      setLoading(false);
    }
  };

  const questions = exam?.questions || [];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        toast.error('🚨 Tab Switch Detected!', {
          description: 'Please stay on this tab during the exam',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Prevent copy/paste
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Copying is disabled during exam');
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('paste', preventCopy);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('paste', preventCopy);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex.toString() });
  };

  const handleAutoSubmit = () => {
    calculateScore();
  };

  const handleSubmit = async () => {
    try {
      setShowSubmitDialog(false);
      setSubmitting(true);

      const response = await examAPI.submit(examId, {
        answers,
        tabSwitches,
      });

      const result = response.data.result;
      setFinalScore(result.percentage);
      setShowResultDialog(true);
    } catch (error: any) {
      console.error('Submit exam error:', error);
      toast.error('Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] !== undefined && parseInt(answers[index]) === q.correctAnswer) {
        correct++;
      }
    });
    const percentage = Math.round((correct / questions.length) * 100);
    setFinalScore(percentage);
    setShowResultDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader className="w-12 h-12 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#94a3b8] text-lg mb-4">Exam not found or no questions available</p>
          <Button onClick={() => navigate('/user/exams')} className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]">
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Header Bar */}
      <div className="bg-[#1e293b] border-b border-[#6366f1]/20 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <h1 className="text-base sm:text-xl text-[#f1f5f9] line-clamp-1">{exam.title}</h1>
            {tabSwitches > 0 && (
              <div className="flex items-center gap-1 sm:gap-2 text-[#f97316] bg-[#f97316]/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shrink-0">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{tabSwitches} warning{tabSwitches > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className={`text-base sm:text-xl ${
              timeLeft < 300 ? 'text-[#ef4444]' : 'text-[#6366f1]'
            }`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10"
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#1e293b] px-3 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
            <span className="text-[#94a3b8]">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-[#94a3b8]">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#1e293b]/40 backdrop-blur-xl border border-[#6366f1]/20 rounded-2xl p-4 sm:p-6 lg:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl text-[#f1f5f9] pr-0 sm:pr-4">{currentQ.question}</h2>
                <Button variant="outline" size="icon" className="border-[#6366f1] text-[#6366f1] shrink-0">
                  <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-3 sm:p-4 rounded-lg text-left transition-all text-sm sm:text-base ${
                      answers[currentQuestion] === index.toString()
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                        : 'bg-[#0f172a]/50 text-[#f1f5f9] hover:bg-[#0f172a]/80 border border-[#6366f1]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm shrink-0 ${
                          answers[currentQuestion] === index.toString()
                            ? 'border-white bg-white text-[#6366f1]'
                            : 'border-[#6366f1]'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="break-words">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#1e293b] border-t border-[#6366f1]/20 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-[#6366f1] text-[#6366f1] w-full sm:w-auto text-sm h-9 sm:h-10"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Previous
          </Button>

          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto justify-center">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm shrink-0 ${
                  index === currentQuestion
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                    : answers[index] !== undefined
                    ? 'bg-[#10b981] text-white'
                    : 'bg-[#334155] text-[#94a3b8]'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === questions.length - 1}
            className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] w-full sm:w-auto text-sm h-9 sm:h-10"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9]">
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[#94a3b8]">
              You have answered {Object.keys(answers).length} out of {questions.length} questions.
            </p>
            <p className="text-[#94a3b8]">Are you sure you want to submit your exam?</p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSubmitDialog(false)}
                variant="outline"
                className="flex-1 border-[#6366f1] text-[#6366f1]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9]">
          <DialogHeader>
            <DialogTitle>Exam Completed!</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#6366f1] to-[#14b8a6] rounded-full flex items-center justify-center">
              <div className="text-4xl text-white">{finalScore}%</div>
            </div>
            
            <div className="bg-[#6366f1]/10 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-[#6366f1] mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-[#6366f1] mb-1 text-sm">AI Feedback</p>
                  <p className="text-[#f1f5f9] text-sm">
                    {finalScore >= 80
                      ? 'Excellent performance! You have a strong understanding of React concepts.'
                      : finalScore >= 60
                      ? 'Good work! Consider reviewing hooks and component lifecycle.'
                      : 'Keep practicing! Focus on fundamental React concepts and build more projects.'}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/user/results')}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              View Detailed Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
