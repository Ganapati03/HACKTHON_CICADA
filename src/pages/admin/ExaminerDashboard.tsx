import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import GlassCard from '../../components/GlassCard';
import { FileText, CheckCircle, Clock, AlertTriangle, Plus, Loader, Eye, Trash2, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from 'sonner';
import { examAPI, examRequestAPI } from '../../api/client';

export default function ExaminerDashboard() {
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [examRequests, setExamRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: 'intermediate',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, requestsRes] = await Promise.all([
        examAPI.getAll(),
        examRequestAPI.getAll(),
      ]);
      setExams(examsRes.data.exams || []);
      setExamRequests(requestsRes.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Exams', value: exams.length.toString(), icon: FileText, color: 'text-[#6366f1]' },
    { label: 'Active Exams', value: exams.filter((e: any) => e.status === 'Active').length.toString(), icon: Clock, color: 'text-[#14b8a6]' },
    { label: 'Pending Requests', value: examRequests.filter((r: any) => r.status === 'pending').length.toString(), icon: Clock, color: 'text-[#f97316]' },
    { label: 'Cheat Detections', value: '0', icon: AlertTriangle, color: 'text-[#f97316]' },
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

  const handleCreateExam = async () => {
    try {
      if (!examForm.title || !examForm.description || !examForm.duration) {
        toast.error('Please fill all required fields');
        return;
      }

      setSubmitting(true);
      const examData = {
        title: examForm.title,
        description: examForm.description,
        duration: parseInt(examForm.duration),
        difficulty: examForm.difficulty,
      };

      // Create the exam
      const examResponse = await examAPI.create(examData);
      const createdExam = examResponse.data.exam;
      
      // If there's a selected request, link the exam to it
      if (selectedRequestId) {
        try {
          await examRequestAPI.linkExam(selectedRequestId, createdExam._id);
          toast.success('Exam created and linked to request successfully!', {
            description: 'AI has generated initial question set',
          });
        } catch (linkError) {
          console.error('Failed to link exam to request:', linkError);
          toast.warning('Exam created but failed to link to request', {
            description: 'Please manually link the exam to the request',
          });
        }
      } else {
        toast.success('Exam created successfully!', {
          description: 'AI has generated initial question set',
        });
      }
      
      setShowExamDialog(false);
      setSelectedRequestId(null);
      setExamForm({ title: '', description: '', duration: '', difficulty: 'intermediate' });
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Create exam error:', error);
      toast.error('Failed to create exam', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskStatus = (taskId: number, newStatus: string) => {
    toast.success(`Task ${newStatus}!`);
  };

  const handleViewQuestions = (exam: any) => {
    setSelectedExam(exam);
    setShowQuestionsDialog(true);
  };

  const handleDeleteClick = (exam: any) => {
    setSelectedExam(exam);
    setShowDeleteDialog(true);
  };

  const handleDeleteExam = async () => {
    try {
      setDeleting(true);
      await examAPI.delete(selectedExam._id);
      toast.success('Exam deleted successfully!');
      setShowDeleteDialog(false);
      setSelectedExam(null);
      fetchData();
    } catch (error: any) {
      console.error('Delete exam error:', error);
      toast.error('Failed to delete exam', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await examRequestAPI.accept(requestId);
      toast.success('Request accepted!', {
        description: 'You can now create the exam for this request',
      });
      setSelectedRequestId(requestId); // Pre-select this request for exam creation
      fetchData();
    } catch (error: any) {
      toast.error('Failed to accept request', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await examRequestAPI.reject(requestId);
      toast.success('Request rejected');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to reject request', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#f1f5f9] mb-2">Examiner Dashboard</h1>
            <p className="text-sm sm:text-base text-[#94a3b8]">Manage exams and monitor integrity</p>
          </div>
          <Button
            onClick={() => setShowExamDialog(true)}
            className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
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
                    <p className="text-[#94a3b8] text-xs sm:text-sm mb-1">{stat.label}</p>
                    <p className={`text-2xl sm:text-3xl ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color}`} />
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
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl text-[#f1f5f9] mb-4 sm:mb-6">Created Exams ({exams.length})</h2>
          {loading ? (
            <div className="flex justify-center py-8 sm:py-10">
              <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-8 sm:py-10 bg-[#1e293b]/40 rounded-lg border border-[#6366f1]/20">
              <p className="text-sm sm:text-base text-[#94a3b8]">No exams created yet. Click "Create Exam" to get started!</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {exams.map((exam: any) => (
              <GlassCard key={exam._id}>
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <Badge className={exam.status === 'Active' ? 'bg-[#10b981]/20 text-[#10b981] text-xs' : 'bg-[#94a3b8]/20 text-[#94a3b8] text-xs'}>
                    {exam.status}
                  </Badge>
                  <Badge variant="outline" className="border-[#6366f1] text-[#6366f1] text-xs">
                    {exam.difficulty}
                  </Badge>
                </div>
                <h3 className="text-base sm:text-lg text-[#f1f5f9] mb-2">{exam.title}</h3>
                <p className="text-[#94a3b8] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{exam.description}</p>
                <p className="text-[#94a3b8] text-xs mb-2">Duration: {exam.duration} mins</p>
                <p className="text-[#94a3b8] text-xs mb-3 sm:mb-4">Questions: {exam.questions?.length || 0}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleViewQuestions(exam)}
                    className="flex-1 bg-[#6366f1] text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteClick(exam)}
                    variant="outline"
                    className="border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
          )}
        </motion.div>

        {/* HR Exam Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl text-[#f1f5f9] mb-4 sm:mb-6">HR Exam Requests ({examRequests.length})</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : examRequests.length === 0 ? (
            <div className="text-center py-10 bg-[#1e293b]/40 rounded-lg border border-[#6366f1]/20">
              <p className="text-[#94a3b8]">No exam requests from HR yet</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {examRequests.map((request) => (
              <GlassCard key={request._id}>
                <div className="flex items-start justify-between mb-4">
                  <Badge className={
                    request.status === 'pending'
                      ? 'bg-[#f97316]/20 text-[#f97316]'
                      : request.status === 'accepted'
                      ? 'bg-[#14b8a6]/20 text-[#14b8a6]'
                      : request.status === 'completed'
                      ? 'bg-[#10b981]/20 text-[#10b981]'
                      : 'bg-[#94a3b8]/20 text-[#94a3b8]'
                  }>
                    {request.status}
                  </Badge>
                  <Badge variant="outline" className={
                    request.priority === 'high'
                      ? 'border-[#ef4444] text-[#ef4444]'
                      : request.priority === 'medium'
                      ? 'border-[#f97316] text-[#f97316]'
                      : 'border-[#94a3b8] text-[#94a3b8]'
                  }>
                    {request.priority}
                  </Badge>
                </div>
                <h3 className="text-lg text-[#f1f5f9] mb-2">{request.title}</h3>
                <p className="text-[#94a3b8] text-sm mb-4 line-clamp-2">{request.description}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Duration:</span>
                    <span className="text-[#f1f5f9]">{request.duration} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Difficulty:</span>
                    <Badge variant="outline" className="border-[#6366f1] text-[#6366f1]">
                      {request.difficulty}
                    </Badge>
                  </div>
                  {request.requestedBy?.name && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Requested by:</span>
                      <span className="text-[#f1f5f9] text-xs">{request.requestedBy.name}</span>
                    </div>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#10b981]"
                      onClick={() => handleAcceptRequest(request._id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10"
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
                {request.status === 'accepted' && (
                  <div className="flex flex-col gap-2 mt-2">
                    <Badge className="w-full text-center bg-[#14b8a6]/20 text-[#14b8a6]">
                      ✓ Accepted - Create exam when ready
                    </Badge>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] hover:opacity-90"
                      onClick={() => {
                        setSelectedRequestId(request._id);
                        setShowExamDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Exam
                    </Button>
                  </div>
                )}
                {request.status === 'completed' && request.examId && (
                  <Badge className="w-full text-center bg-[#10b981]/20 text-[#10b981]">
                    ✓ Exam Created
                  </Badge>
                )}
              </GlassCard>
            ))}
          </div>
          )}
        </motion.div>

        {/* Task Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl text-[#f1f5f9] mb-4 sm:mb-6">Inter-Admin Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <h2 className="text-xl sm:text-2xl text-[#f1f5f9] mb-4 sm:mb-6">Cheat Detection Logs</h2>
          <GlassCard>
            <div className="overflow-x-auto">
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
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Create Exam Dialog */}
      <Dialog open={showExamDialog} onOpenChange={(open) => {
        setShowExamDialog(open);
        if (!open) setSelectedRequestId(null);
      }}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequestId && (
              <div className="p-3 bg-[#6366f1]/10 rounded-lg border border-[#6366f1]/30">
                <p className="text-sm text-[#94a3b8] mb-1">Creating exam for request:</p>
                <p className="text-[#f1f5f9] font-medium">
                  {examRequests.find((r: any) => r._id === selectedRequestId)?.title}
                </p>
              </div>
            )}
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
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Exam with AI'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9]">
          <DialogHeader>
            <DialogTitle>Delete Exam?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[#94a3b8]">
              Are you sure you want to delete <span className="text-[#f1f5f9] font-semibold">"{selectedExam?.title}"</span>?
            </p>
            <p className="text-[#ef4444] text-sm">
              This action cannot be undone. All exam data and questions will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteDialog(false)}
                variant="outline"
                className="flex-1 border-[#6366f1] text-[#6366f1]"
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteExam}
                disabled={deleting}
                className="flex-1 bg-[#ef4444] hover:bg-[#dc2626]"
              >
                {deleting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Exam
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Questions Dialog */}
      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exam Questions - {selectedExam?.title}</DialogTitle>
          </DialogHeader>
          {selectedExam?.questions && selectedExam.questions.length > 0 ? (
            <div className="space-y-6">
              {selectedExam.questions.map((question: any, index: number) => (
                <div key={index} className="bg-[#0f172a]/50 p-4 rounded-lg border border-[#6366f1]/20">
                  <div className="flex items-start gap-3 mb-3">
                    <Badge className="bg-[#6366f1]/20 text-[#6366f1]">
                      Q{index + 1}
                    </Badge>
                    <p className="text-[#f1f5f9] flex-1">{question.question}</p>
                  </div>
                  <div className="space-y-2 ml-12">
                    {question.options?.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border ${
                          question.correctAnswer === optIndex
                            ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                            : 'bg-[#1e293b]/50 border-[#6366f1]/20 text-[#94a3b8]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                          <span>{option}</span>
                          {question.correctAnswer === optIndex && (
                            <Badge className="ml-auto bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                              ✓ Correct Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#94a3b8] text-center py-8">No questions available for this exam.</p>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
