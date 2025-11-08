import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Briefcase, Calendar, FileText, Upload, Loader, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { applicationAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function MyApplications() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Debug: Log location state
  console.log('📍 MyApplications - Location state:', location.state);
  console.log('👤 User:', user);
  
  const [showApplyDialog, setShowApplyDialog] = useState(!!location.state?.applyFor);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    position: location.state?.applyFor || '',
    jobId: location.state?.jobId || '',
    jobTitle: location.state?.applyFor || '',
    resume: null as File | null,
  });
  
  console.log('📋 Initial formData:', formData);
  console.log('🔓 Dialog open:', showApplyDialog);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resume) {
      toast.error('Please upload your resume');
      return;
    }

    if (!formData.jobId) {
      toast.error('Job ID is missing');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = new FormData();
      submitData.append('jobId', formData.jobId);
      submitData.append('jobTitle', formData.jobTitle);
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('position', formData.position);
      submitData.append('resume', formData.resume);

      console.log('📤 Submitting application...');
      console.log('Form data:', {
        jobId: formData.jobId,
        jobTitle: formData.jobTitle,
        name: formData.name,
        email: formData.email,
        position: formData.position,
        resumeFile: formData.resume.name,
      });

      const response = await applicationAPI.submit(submitData);
      console.log('✅ Application submitted successfully:', response.data);
      
      toast.success('Application submitted!', {
        description: 'Your application has been sent. Our AI system is analyzing your resume.',
      });
      
      setShowApplyDialog(false);
      setFormData({ 
        name: user?.name || '', 
        email: user?.email || '', 
        position: '', 
        jobId: '',
        jobTitle: '',
        resume: null 
      });
      
      fetchApplications(); // Refresh list
    } catch (error: any) {
      console.error('❌ Application submission failed:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to submit application', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
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
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-[#94a3b8] mx-auto mb-4" />
                <p className="text-[#94a3b8] text-lg">No applications yet</p>
                <p className="text-[#94a3b8] text-sm mt-2">Start applying for jobs to see your applications here</p>
              </div>
            </GlassCard>
          ) : (
          applications.map((app: any, index) => (
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
                      <h3 className="text-xl text-[#f1f5f9]">{app.jobTitle || app.position}</h3>
                    </div>
                    <p className="text-[#94a3b8] mb-3">Mastersolis Infotech</p>
                    
                    <div className="flex items-center gap-6 text-[#94a3b8] text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                      {app.aiScore && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#14b8a6] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{app.aiScore}</span>
                          </div>
                          <span className="text-sm">AI Score</span>
                        </div>
                      )}
                      {app.interviewDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#14b8a6]" />
                          <span className="text-[#14b8a6]">Interview: {new Date(app.interviewDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {getStatusBadge(app.status)}
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#6366f1] hover:underline text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          View Resume
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )))
          }
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
              <Label className="text-[#f1f5f9]">Upload Resume (PDF, DOC, or Image)</Label>
              <div className="mt-2">
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#6366f1]/30 rounded-lg cursor-pointer hover:border-[#6366f1] transition-colors">
                  <Upload className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-[#94a3b8]">
                    {formData.resume ? formData.resume.name : 'Choose file (PDF, DOC, JPG, PNG)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,image/*"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
}
