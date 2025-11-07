import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { AlertTriangle, ChevronLeft, ChevronRight, Flag, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { toast } from 'sonner@2.0.3';

export default function ExamInterface() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: 'What is the purpose of React Hooks?',
      options: [
        'To add styling to components',
        'To manage state and side effects in functional components',
        'To create class components',
        'To handle routing',
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Which hook is used for side effects in React?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: 'What does the virtual DOM do?',
      options: [
        'Replaces the real DOM completely',
        'Provides a lightweight copy for efficient updates',
        'Stores user data',
        'Handles API requests',
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: 'What is JSX?',
      options: [
        'A JavaScript extension for XML-like syntax',
        'A CSS framework',
        'A database query language',
        'A testing library',
      ],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: 'How do you pass data from parent to child in React?',
      options: ['Through state', 'Through props', 'Through context', 'Through refs'],
      correctAnswer: 1,
    },
  ];

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

  const handleSubmit = () => {
    setShowSubmitDialog(false);
    calculateScore();
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

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Header Bar */}
      <div className="bg-[#1e293b] border-b border-[#6366f1]/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl text-[#f1f5f9]">React Developer Assessment</h1>
            {tabSwitches > 0 && (
              <div className="flex items-center gap-2 text-[#f97316] bg-[#f97316]/10 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{tabSwitches} warning{tabSwitches > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-xl ${timeLeft < 300 ? 'text-[#ef4444]' : 'text-[#6366f1]'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#1e293b] px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#94a3b8] text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-[#94a3b8] text-sm">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#1e293b]/40 backdrop-blur-xl border border-[#6366f1]/20 rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl text-[#f1f5f9]">{currentQ.question}</h2>
                <Button variant="outline" size="icon" className="border-[#6366f1] text-[#6366f1]">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      answers[currentQuestion] === index.toString()
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                        : 'bg-[#0f172a]/50 text-[#f1f5f9] hover:bg-[#0f172a]/80 border border-[#6366f1]/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          answers[currentQuestion] === index.toString()
                            ? 'border-white bg-white text-[#6366f1]'
                            : 'border-[#6366f1]'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#1e293b] border-t border-[#6366f1]/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-[#6366f1] text-[#6366f1]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-lg ${
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
            className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
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
