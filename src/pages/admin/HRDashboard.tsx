import { motion } from 'motion/react';
import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import GlassCard from '../../components/GlassCard';
import { Briefcase, Users, CheckCircle, XCircle, Calendar, Plus, Mail, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from 'sonner@2.0.3';

export default function HRDashboard() {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [emailContent, setEmailContent] = useState('');

  const stats = [
    { label: 'Active Jobs', value: '18', icon: Briefcase, color: 'text-[#6366f1]' },
    { label: 'Total Applicants', value: '342', icon: Users, color: 'text-[#14b8a6]' },
    { label: 'Selected', value: '45', icon: CheckCircle, color: 'text-[#10b981]' },
    { label: 'Pending', value: '178', icon: Calendar, color: 'text-[#f97316]' },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior AI Engineer',
      applicants: 48,
      selected: 2,
      rejected: 10,
      pending: 36,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Cloud Solutions Architect',
      applicants: 32,
      selected: 3,
      rejected: 8,
      pending: 21,
      status: 'Active',
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      applicants: 67,
      selected: 5,
      rejected: 20,
      pending: 42,
      status: 'Active',
    },
  ];

  const candidates = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@email.com',
      position: 'Senior AI Engineer',
      appliedDate: 'Nov 3, 2024',
      status: 'pending',
      aiScore: 92,
      resumeMatch: 'Excellent',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@email.com',
      position: 'Full Stack Developer',
      appliedDate: 'Nov 2, 2024',
      status: 'pending',
      aiScore: 88,
      resumeMatch: 'Good',
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@email.com',
      position: 'Cloud Solutions Architect',
      appliedDate: 'Nov 1, 2024',
      status: 'selected',
      aiScore: 95,
      resumeMatch: 'Excellent',
    },
  ];

  const handleStatusChange = (candidateId: number, newStatus: string, candidate: any) => {
    setSelectedCandidate(candidate);
    
    let aiEmailContent = '';
    if (newStatus === 'selected') {
      aiEmailContent = `Dear ${candidate.name},\n\nCongratulations! We are pleased to inform you that you have been selected for the ${candidate.position} position at Mastersolis Infotech.\n\nWe were impressed by your qualifications and believe you will be a great addition to our team.\n\nNext steps:\n- HR will contact you within 2 business days\n- Please prepare documents for verification\n\nBest regards,\nMastersolis HR Team`;
    } else if (newStatus === 'rejected') {
      aiEmailContent = `Dear ${candidate.name},\n\nThank you for your interest in the ${candidate.position} position at Mastersolis Infotech.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe encourage you to apply for future openings that match your skills and experience.\n\nBest regards,\nMastersolis HR Team`;
    } else if (newStatus === 'interview') {
      aiEmailContent = `Dear ${candidate.name},\n\nWe would like to schedule an interview for the ${candidate.position} position.\n\nProposed Date: [Select Date]\nTime: [Select Time]\nFormat: Video Call\n\nPlease confirm your availability.\n\nBest regards,\nMastersolis HR Team`;
    }
    
    setEmailContent(aiEmailContent);
    setShowEmailDialog(true);
  };

  const sendEmail = () => {
    toast.success('Email sent!', {
      description: `Status update email sent to ${selectedCandidate.name}`,
    });
    setShowEmailDialog(false);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-[#f1f5f9] mb-2">HR Dashboard</h1>
            <p className="text-[#94a3b8]">Manage recruitment and candidates</p>
          </div>
          <Button
            onClick={() => setShowJobDialog(true)}
            className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
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

        {/* Job Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl text-[#f1f5f9] mb-6">Active Job Listings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const chartData = [
                { name: 'Selected', value: job.selected, color: '#10b981' },
                { name: 'Rejected', value: job.rejected, color: '#ef4444' },
                { name: 'Pending', value: job.pending, color: '#f97316' },
              ];

              return (
                <GlassCard key={job.id}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-[#f1f5f9] mb-2">{job.title}</h3>
                      <Badge className="bg-[#10b981]/20 text-[#10b981]">{job.status}</Badge>
                    </div>
                    <Briefcase className="w-8 h-8 text-[#6366f1]" />
                  </div>

                  <div className="mb-4">
                    <p className="text-[#94a3b8] text-sm mb-2">Applicants: {job.applicants}</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-[#10b981]">{job.selected}</p>
                      <p className="text-[#94a3b8] text-xs">Selected</p>
                    </div>
                    <div>
                      <p className="text-[#f97316]">{job.pending}</p>
                      <p className="text-[#94a3b8] text-xs">Pending</p>
                    </div>
                    <div>
                      <p className="text-[#ef4444]">{job.rejected}</p>
                      <p className="text-[#94a3b8] text-xs">Rejected</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </motion.div>

        {/* Candidates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl text-[#f1f5f9] mb-6">Recent Applicants</h2>
          <GlassCard>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#6366f1]/20">
                  <TableHead className="text-[#f1f5f9]">Candidate</TableHead>
                  <TableHead className="text-[#f1f5f9]">Position</TableHead>
                  <TableHead className="text-[#f1f5f9]">Applied Date</TableHead>
                  <TableHead className="text-[#f1f5f9]">AI Score</TableHead>
                  <TableHead className="text-[#f1f5f9]">Status</TableHead>
                  <TableHead className="text-[#f1f5f9]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id} className="border-b border-[#6366f1]/10">
                    <TableCell className="text-[#f1f5f9]">
                      <div>
                        <p>{candidate.name}</p>
                        <p className="text-sm text-[#94a3b8]">{candidate.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#94a3b8]">{candidate.position}</TableCell>
                    <TableCell className="text-[#94a3b8]">{candidate.appliedDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#14b8a6] flex items-center justify-center">
                          <span className="text-white text-sm">{candidate.aiScore}</span>
                        </div>
                        <span className={`text-sm ${
                          candidate.resumeMatch === 'Excellent' ? 'text-[#10b981]' : 'text-[#f97316]'
                        }`}>
                          {candidate.resumeMatch}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        candidate.status === 'selected'
                          ? 'bg-[#10b981]/20 text-[#10b981]'
                          : candidate.status === 'rejected'
                          ? 'bg-[#ef4444]/20 text-[#ef4444]'
                          : 'bg-[#f97316]/20 text-[#f97316]'
                      }>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(candidate.id, 'selected', candidate)}
                          className="bg-[#10b981]"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(candidate.id, 'rejected', candidate)}
                          className="bg-[#ef4444]"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(candidate.id, 'interview', candidate)}
                          className="bg-[#6366f1]"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Job Title" className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" />
            <Textarea placeholder="Job Description" rows={4} className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" />
            <Input placeholder="Location" className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" />
            <Input placeholder="Salary Range" className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" />
            <Button className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]">
              Post Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6366f1]" />
                AI Generated Email
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#6366f1]/10 p-3 rounded-lg">
              <p className="text-[#94a3b8] text-sm">
                AI has generated a personalized email based on the candidate's status
              </p>
            </div>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={12}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowEmailDialog(false)}
                variant="outline"
                className="flex-1 border-[#6366f1] text-[#6366f1]"
              >
                Cancel
              </Button>
              <Button
                onClick={sendEmail}
                className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
