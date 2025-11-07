import { motion } from 'motion/react';
import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import GlassCard from '../../components/GlassCard';
import { FileText, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from 'sonner@2.0.3';

export default function ExaminerDashboard() {
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: 'intermediate',
  });

  const stats = [
    { label: 'Total Exams', value: '42', icon: FileText, color: 'text-[#6366f1]' },
    { label: 'Active Exams', value: '12', icon: Clock, color: 'text-[#14b8a6]' },
    { label: 'Completed', value: '385', icon: CheckCircle, color: 'text-[#10b981]' },
    { label: 'Cheat Detections', value: '7', icon: AlertTriangle, color: 'text-[#f97316]' },
  ];

  const examRequests = [
    {
      id: 1,
      title: 'React Assessment for Senior Role',
      requestedBy: 'HR Team',
      date: 'Nov 5, 2024',
      status: 'pending',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Python Backend Developer Test',
      requestedBy: 'HR Team',
      date: 'Nov 4, 2024',
      status: 'accepted',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Cloud Architecture Assessment',
      requestedBy: 'HR Team',
      date: 'Nov 3, 2024',
      status: 'completed',
      priority: 'high',
    },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Create Python Exam Questions',
      assignedBy: 'HR - Sarah M.',
      dueDate: 'Nov 10, 2024',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Review React Assessment Results',
      assignedBy: 'HR - John D.',
      dueDate: 'Nov 8, 2024',
      status: 'accepted',
    },
    {
      id: 3,
      title: 'Update Cloud Exam Questions',
      assignedBy: 'Developer - Alex T.',
      dueDate: 'Nov 6, 2024',
      status: 'done',
    },
  ];

  const cheatLogs = [
    {
      id: 1,
      candidate: 'John Smith',
      exam: 'React Assessment',
      violations: ['Tab Switch x3', 'Copy Attempt'],
      aiProbability: 85,
      date: 'Nov 5, 2024',
    },
    {
      id: 2,
      candidate: 'Emily Johnson',
      exam: 'Python Test',
      violations: ['Tab Switch x1'],
      aiProbability: 35,
      date: 'Nov 4, 2024',
    },
  ];

  const handleCreateExam = () => {
    toast.success('Exam created successfully!', {
      description: 'AI has generated initial question set',
    });
    setShowExamDialog(false);
    setExamForm({ title: '', description: '', duration: '', difficulty: 'intermediate' });
  };

  const handleTaskStatus = (taskId: number, newStatus: string) => {
    toast.success(`Task ${newStatus}!`);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-[#f1f5f9] mb-2">Examiner Dashboard</h1>
            <p className="text-[#94a3b8]">Manage exams and monitor integrity</p>
          </div>
          <Button
            onClick={() => setShowExamDialog(true)}
            className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>

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

        {/* Exam Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl text-[#f1f5f9] mb-6">HR Exam Requests</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {examRequests.map((request) => (
              <GlassCard key={request.id}>
                <div className="flex items-start justify-between mb-4">
                  <Badge className={
                    request.status === 'pending'
                      ? 'bg-[#f97316]/20 text-[#f97316]'
                      : request.status === 'accepted'
                      ? 'bg-[#14b8a6]/20 text-[#14b8a6]'
                      : 'bg-[#10b981]/20 text-[#10b981]'
                  }>
                    {request.status}
                  </Badge>
                  <Badge variant="outline" className={
                    request.priority === 'high'
                      ? 'border-[#ef4444] text-[#ef4444]'
                      : 'border-[#f97316] text-[#f97316]'
                  }>
                    {request.priority}
                  </Badge>
                </div>
                <h3 className="text-[#f1f5f9] mb-2">{request.title}</h3>
                <p className="text-[#94a3b8] text-sm mb-4">By: {request.requestedBy}</p>
                <p className="text-[#94a3b8] text-xs mb-4">{request.date}</p>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-[#10b981]">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-[#ef4444] text-[#ef4444]">
                      Decline
                    </Button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Task Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl text-[#f1f5f9] mb-6">Inter-Admin Tasks</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <GlassCard key={task.id} className={
                task.status === 'pending'
                  ? 'border-l-4 border-l-[#f97316]'
                  : task.status === 'accepted'
                  ? 'border-l-4 border-l-[#14b8a6]'
                  : 'border-l-4 border-l-[#10b981]'
              }>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[#f1f5f9]">{task.title}</h3>
                  <Badge className={
                    task.status === 'pending'
                      ? 'bg-[#f97316]/20 text-[#f97316]'
                      : task.status === 'accepted'
                      ? 'bg-[#14b8a6]/20 text-[#14b8a6]'
                      : 'bg-[#10b981]/20 text-[#10b981]'
                  }>
                    {task.status}
                  </Badge>
                </div>
                <p className="text-[#94a3b8] text-sm mb-2">From: {task.assignedBy}</p>
                <p className="text-[#94a3b8] text-xs mb-4">Due: {task.dueDate}</p>
                {task.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleTaskStatus(task.id, 'accepted')}
                    className="w-full bg-[#14b8a6]"
                  >
                    Accept Task
                  </Button>
                )}
                {task.status === 'accepted' && (
                  <Button
                    size="sm"
                    onClick={() => handleTaskStatus(task.id, 'done')}
                    className="w-full bg-[#10b981]"
                  >
                    Mark as Done
                  </Button>
                )}
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Cheat Detection Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl text-[#f1f5f9] mb-6">Cheat Detection Logs</h2>
          <GlassCard>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#6366f1]/20">
                  <TableHead className="text-[#f1f5f9]">Candidate</TableHead>
                  <TableHead className="text-[#f1f5f9]">Exam</TableHead>
                  <TableHead className="text-[#f1f5f9]">Violations</TableHead>
                  <TableHead className="text-[#f1f5f9]">AI Probability</TableHead>
                  <TableHead className="text-[#f1f5f9]">Date</TableHead>
                  <TableHead className="text-[#f1f5f9]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cheatLogs.map((log) => (
                  <TableRow key={log.id} className="border-b border-[#6366f1]/10">
                    <TableCell className="text-[#f1f5f9]">{log.candidate}</TableCell>
                    <TableCell className="text-[#94a3b8]">{log.exam}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {log.violations.map((v, i) => (
                          <Badge key={i} variant="outline" className="border-[#f97316] text-[#f97316]">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          log.aiProbability > 70
                            ? 'bg-[#ef4444]/20 text-[#ef4444]'
                            : 'bg-[#f97316]/20 text-[#f97316]'
                        }`}>
                          <span>{log.aiProbability}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#94a3b8]">{log.date}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="border-[#6366f1] text-[#6366f1]">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Create Exam Dialog */}
      <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-[#f1f5f9] mb-2 block">Exam Title</label>
              <Input
                value={examForm.title}
                onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                placeholder="e.g., React Developer Assessment"
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <label className="text-[#f1f5f9] mb-2 block">Description</label>
              <Textarea
                value={examForm.description}
                onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                placeholder="Describe the exam objectives..."
                rows={4}
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#f1f5f9] mb-2 block">Duration (minutes)</label>
                <Input
                  type="number"
                  value={examForm.duration}
                  onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })}
                  placeholder="60"
                  className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                />
              </div>

              <div>
                <label className="text-[#f1f5f9] mb-2 block">Difficulty</label>
                <Select value={examForm.difficulty} onValueChange={(value) => setExamForm({ ...examForm, difficulty: value })}>
                  <SelectTrigger className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#6366f1]/30">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-[#6366f1]/10 p-4 rounded-lg">
              <p className="text-[#94a3b8] text-sm">
                💡 AI will automatically generate initial questions based on your inputs. You can review and customize them after creation.
              </p>
            </div>

            <Button
              onClick={handleCreateExam}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              Create Exam with AI
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
