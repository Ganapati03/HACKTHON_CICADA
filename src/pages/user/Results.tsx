import { motion } from 'motion/react';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Download, Sparkles } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

export default function Results() {
  const results = [
    {
      id: 1,
      exam: 'JavaScript Fundamentals',
      date: 'Nov 1, 2024',
      score: 92,
      total: 100,
      percentage: 92,
      passed: true,
      feedback: 'Excellent performance! Strong understanding of closures, async/await, and ES6 features. Consider reviewing prototypal inheritance.',
    },
    {
      id: 2,
      exam: 'Data Structures & Algorithms',
      date: 'Oct 28, 2024',
      score: 85,
      total: 100,
      percentage: 85,
      passed: true,
      feedback: 'Great work on tree and graph algorithms. Focus on optimizing time complexity for dynamic programming problems.',
    },
    {
      id: 3,
      exam: 'Cloud Architecture Basics',
      date: 'Oct 25, 2024',
      score: 88,
      total: 100,
      percentage: 88,
      passed: true,
      feedback: 'Solid understanding of AWS services and cloud patterns. Explore more about serverless architectures and cost optimization.',
    },
  ];

  const handleDownload = (examName: string) => {
    toast.success('PDF Downloaded', {
      description: `${examName} results certificate downloaded`,
    });
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl text-[#f1f5f9] mb-2">Exam Results</h1>
        <p className="text-[#94a3b8] mb-8">View your performance and AI-powered feedback</p>

        <div className="space-y-6">
          {results.map((result, index) => {
            const chartData = [
              { name: 'Correct', value: result.score, color: '#10b981' },
              { name: 'Incorrect', value: result.total - result.score, color: '#334155' },
            ];

            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Score Chart */}
                    <div className="flex flex-col items-center justify-center">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="text-center mt-4">
                        <p className="text-4xl text-[#10b981] mb-1">{result.percentage}%</p>
                        <p className="text-[#94a3b8]">{result.score}/{result.total}</p>
                      </div>
                    </div>

                    {/* Exam Details */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl text-[#f1f5f9] mb-1">{result.exam}</h3>
                          <p className="text-[#94a3b8] text-sm">{result.date}</p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-sm ${
                          result.passed
                            ? 'bg-[#10b981]/20 text-[#10b981]'
                            : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>

                      <div className="bg-[#6366f1]/10 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-[#6366f1] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[#6366f1] mb-1 text-sm">AI Feedback</p>
                            <p className="text-[#f1f5f9] text-sm">{result.feedback}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleDownload(result.exam)}
                        className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF Certificate
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <GlassCard>
            <h2 className="text-2xl text-[#f1f5f9] mb-4">Overall Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl text-[#6366f1] mb-2">87%</p>
                <p className="text-[#94a3b8]">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-4xl text-[#14b8a6] mb-2">3</p>
                <p className="text-[#94a3b8]">Exams Completed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl text-[#10b981] mb-2">100%</p>
                <p className="text-[#94a3b8]">Pass Rate</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </UserLayout>
  );
}
