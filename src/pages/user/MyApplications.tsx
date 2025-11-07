import { motion } from 'motion/react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Briefcase, Calendar, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function MyApplications() {
  const location = useLocation();
  const [showApplyDialog, setShowApplyDialog] = useState(!!location.state?.applyFor);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: location.state?.applyFor || '',
    resume: null as File | null,
  });

  const applications = [
    {
      id: 1,
      job: 'Senior AI Engineer',
      company: 'Mastersolis Infotech',
      appliedDate: 'Nov 3, 2024',
      status: 'Under Review',
      resumeLink: '#',
    },
    {
      id: 2,
      job: 'Full Stack Developer',
      company: 'Mastersolis Infotech',
      appliedDate: 'Nov 1, 2024',
      status: 'Interview Scheduled',
      interviewDate: 'Nov 14, 2024',
      resumeLink: '#',
    },
    {
      id: 3,
      job: 'Cloud Solutions Architect',
      company: 'Mastersolis Infotech',
      appliedDate: 'Oct 28, 2024',
      status: 'Selected',
      resumeLink: '#',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Application submitted!', {
      description: 'Your application has been sent. Our AI system is analyzing your resume.',
    });
    setShowApplyDialog(false);
    setFormData({ name: '', email: '', position: '', resume: null });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return <Badge className="bg-[#f97316]/20 text-[#f97316]">{status}</Badge>;
      case 'Interview Scheduled':
        return <Badge className="bg-[#14b8a6]/20 text-[#14b8a6]">{status}</Badge>;
      case 'Selected':
        return <Badge className="bg-[#10b981]/20 text-[#10b981]">{status}</Badge>;
      case 'Rejected':
        return <Badge className="bg-[#ef4444]/20 text-[#ef4444]">{status}</Badge>;
      default:
        return <Badge className="bg-[#6366f1]/20 text-[#6366f1]">{status}</Badge>;
    }
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-[#f1f5f9] mb-2">My Applications</h1>
            <p className="text-[#94a3b8]">Track your job applications</p>
          </div>
          <Button
            onClick={() => setShowApplyDialog(true)}
            className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        <div className="space-y-4">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="w-6 h-6 text-[#6366f1]" />
                      <h3 className="text-xl text-[#f1f5f9]">{app.job}</h3>
                    </div>
                    <p className="text-[#94a3b8] mb-3">{app.company}</p>
                    
                    <div className="flex items-center gap-6 text-[#94a3b8] text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                      {app.interviewDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#14b8a6]" />
                          <span className="text-[#14b8a6]">Interview: {app.interviewDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {getStatusBadge(app.status)}
                      <a
                        href={app.resumeLink}
                        className="flex items-center gap-1 text-[#6366f1] hover:underline text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        View Resume
                      </a>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Position</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-[#f1f5f9]">Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Position</Label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Upload Resume</Label>
              <div className="mt-2">
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#6366f1]/30 rounded-lg cursor-pointer hover:border-[#6366f1] transition-colors">
                  <Upload className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-[#94a3b8]">
                    {formData.resume ? formData.resume.name : 'Choose file'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              Submit Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
}
