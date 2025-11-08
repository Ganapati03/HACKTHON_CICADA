import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import GlassCard from '../../components/GlassCard';
import { Briefcase, Users, CheckCircle, XCircle, Calendar, Plus, Mail, Sparkles, Loader, FolderKanban, Edit, Trash2, ClipboardList } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from 'sonner';
import { jobAPI, applicationAPI, projectAPI, examRequestAPI } from '../../api/client';

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showExamRequestDialog, setShowExamRequestDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [emailContent, setEmailContent] = useState('');
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [examRequests, setExamRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    description: '',
    location: '',
    type: 'Full-time',
    salary: '',
    requirements: '',
  });
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'AI/ML',
    description: '',
    fullDescription: '',
    tags: '',
    image: '',
  });
  const [examRequestForm, setExamRequestForm] = useState({
    title: '',
    description: '',
    difficulty: 'intermediate',
    duration: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes, projectsRes, examReqRes] = await Promise.all([
        jobAPI.getAll(),
        applicationAPI.getAllApplications(),
        projectAPI.getAllForAdmin(),
        examRequestAPI.getAll(),
      ]);
      console.log('📊 Dashboard data fetched:');
      console.log('Jobs:', jobsRes.data.jobs?.length || 0);
      console.log('Applications:', appsRes.data.applications?.length || 0);
      console.log('Projects:', projectsRes.data.projects?.length || 0);
      console.log('Exam Requests:', examReqRes.data.requests?.length || 0);
      console.log('Projects data:', projectsRes.data);
      setJobs(jobsRes.data.jobs || []);
      setApplications(appsRes.data.applications || []);
      setProjects(projectsRes.data.projects || []);
      setExamRequests(examReqRes.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      if (!jobForm.title || !jobForm.department || !jobForm.description || !jobForm.location) {
        toast.error('Please fill all required fields');
        return;
      }

      const requirementsArray = jobForm.requirements
        .split('\n')
        .filter(r => r.trim())
        .map(r => r.trim());

      await jobAPI.create({
        ...jobForm,
        requirements: requirementsArray,
      });

      toast.success('Job posted successfully!');
      setShowJobDialog(false);
      setJobForm({
        title: '',
        department: '',
        description: '',
        location: '',
        type: 'Full-time',
        salary: '',
        requirements: '',
      });
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error('Failed to post job', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!projectForm.title || !projectForm.description || !projectForm.fullDescription) {
        toast.error('Please fill all required fields');
        return;
      }

      const tagsArray = projectForm.tags.split(',').map(t => t.trim()).filter(t => t);
      
      const projectData = {
        ...projectForm,
        tags: tagsArray,
      };

      if (editingProject) {
        await projectAPI.update(editingProject._id, projectData);
        toast.success('Project updated successfully!');
      } else {
        await projectAPI.create(projectData);
        toast.success('Project created successfully!');
      }

      setShowProjectDialog(false);
      resetProjectForm();
      fetchData();
    } catch (error: any) {
      toast.error(editingProject ? 'Failed to update project' : 'Failed to create project');
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      category: project.category,
      description: project.description,
      fullDescription: project.fullDescription,
      tags: project.tags?.join(', ') || '',
      image: project.image || '',
    });
    setShowProjectDialog(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectAPI.delete(projectId);
      toast.success('Project deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleToggleProjectStatus = async (projectId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active';
      await projectAPI.update(projectId, { status: newStatus });
      toast.success(`Project ${newStatus === 'Active' ? 'activated' : 'archived'} successfully!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'AI/ML',
      description: '',
      fullDescription: '',
      tags: '',
      image: '',
    });
  };

  const handleCreateExamRequest = async () => {
    try {
      if (!examRequestForm.title || !examRequestForm.description || !examRequestForm.duration) {
        toast.error('Please fill all required fields');
        return;
      }

      await examRequestAPI.create({
        ...examRequestForm,
        duration: parseInt(examRequestForm.duration),
      });

      toast.success('Exam request sent to examiner successfully!');
      setShowExamRequestDialog(false);
      setExamRequestForm({
        title: '',
        description: '',
        difficulty: 'intermediate',
        duration: '',
        priority: 'medium',
      });
      fetchData();
    } catch (error: any) {
      toast.error('Failed to create exam request');
    }
  };

  const handleDeleteExamRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await examRequestAPI.delete(requestId);
      toast.success('Request deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const stats = [
    { label: 'Active Jobs', value: jobs.filter((j: any) => j.status === 'Active').length.toString(), icon: Briefcase, color: 'text-[#6366f1]' },
    { label: 'Total Applicants', value: applications.length.toString(), icon: Users, color: 'text-[#14b8a6]' },
    { label: 'Selected', value: applications.filter((a: any) => a.status === 'Selected').length.toString(), icon: CheckCircle, color: 'text-[#10b981]' },
    { label: 'Pending', value: applications.filter((a: any) => a.status === 'Pending').length.toString(), icon: Calendar, color: 'text-[#f97316]' },
  ];

  const handleStatusChange = (candidateId: number, newStatus: string, candidate: any) => {
    setSelectedCandidate(candidate);
    
    let aiEmailContent = '';
    if (newStatus === 'selected') {
      aiEmailContent = `Dear ${candidate.name},

Congratulations! We are pleased to inform you that you have been selected for the ${candidate.position} position at Mastersolis Infotech.

We were impressed by your qualifications and believe you will be a great addition to our team.

Next steps:
- HR will contact you within 2 business days
- Please prepare documents for verification

Best regards,
Mastersolis HR Team`;
    } else if (newStatus === 'rejected') {
      aiEmailContent = `Dear ${candidate.name},

Thank you for your interest in the ${candidate.position} position at Mastersolis Infotech.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We encourage you to apply for future openings that match your skills and experience.

Best regards,
Mastersolis HR Team`;
    } else if (newStatus === 'interview') {
      aiEmailContent = `Dear ${candidate.name},

We would like to schedule an interview for the ${candidate.position} position.

Proposed Date: [Select Date]
Time: [Select Time]
Format: Video Call

Please confirm your availability.

Best regards,
Mastersolis HR Team`;
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

  const candidates = applications.map((app: any) => ({
    id: app._id,
    name: app.candidateName,
    email: app.email,
    position: app.jobTitle || 'N/A',
    appliedDate: new Date(app.createdAt).toLocaleDateString(),
    status: app.status.toLowerCase(),
    aiScore: app.aiScore || 0,
    resumeMatch: app.aiScore >= 90 ? 'Excellent' : app.aiScore >= 75 ? 'Good' : 'Fair',
  }));

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#f1f5f9] mb-2">HR Dashboard</h1>
            <p className="text-sm sm:text-base text-[#94a3b8]">Manage recruitment and projects</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setShowJobDialog(true)}
              variant="outline"
              className="border-[#6366f1] text-[#6366f1] flex-1 sm:flex-none text-sm sm:text-base h-9 sm:h-10"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Post New Job</span>
              <span className="sm:hidden">Job</span>
            </Button>
            <Button
              onClick={() => {
                resetProjectForm();
                setShowProjectDialog(true);
              }}
              className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] flex-1 sm:flex-none text-sm sm:text-base h-9 sm:h-10"
            >
              <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Project</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-[#6366f1]/20 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'text-[#6366f1] border-b-2 border-[#6366f1]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Jobs & Candidates
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'projects'
                ? 'text-[#6366f1] border-b-2 border-[#6366f1]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('examRequests')}
            className={`px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'examRequests'
                ? 'text-[#6366f1] border-b-2 border-[#6366f1]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            <ClipboardList className="w-4 h-4 inline mr-2" />
            Exam Requests
          </button>
        </div>

        {/* Stats Grid */}
        {activeTab === 'jobs' && (
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
        )
        }

        {/* Jobs Tab Content */}
        {activeTab === 'jobs' && (
        <>
        {/* Job Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl text-[#f1f5f9] mb-4 sm:mb-6">Active Job Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl text-[#f1f5f9] mb-4 sm:mb-6">Recent Applicants</h2>
          <GlassCard>
            <div className="overflow-x-auto">
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
                        <p className="text-sm sm:text-base">{candidate.name}</p>
                        <p className="text-xs sm:text-sm text-[#94a3b8]">{candidate.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#94a3b8] text-xs sm:text-sm whitespace-nowrap">{candidate.position}</TableCell>
                    <TableCell className="text-[#94a3b8] text-xs sm:text-sm whitespace-nowrap">{candidate.appliedDate}</TableCell>
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
                      <div className="flex gap-1.5 sm:gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(candidate.id, 'selected', candidate)}
                          className="bg-[#10b981] h-8 sm:h-9 px-2 sm:px-3"
                        >
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(candidate.id, 'rejected', candidate)}
                          className="bg-[#ef4444] h-8 sm:h-9 px-2 sm:px-3"
                        >
                          <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(candidate.id, 'interview', candidate)}
                          className="bg-[#6366f1] h-8 sm:h-9 px-2 sm:px-3"
                        >
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </GlassCard>
        </motion.div>
        </>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* What Users See - Public Preview */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366f1]" />
              <h3 className="text-base sm:text-xl text-[#f1f5f9]">Live Public View - What Users See</h3>
            </div>
            <p className="text-[#94a3b8] text-xs sm:text-sm mb-3 sm:mb-4">These projects are currently visible on the public website (/projects page)</p>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader className="w-6 h-6 text-[#6366f1] animate-spin" />
              </div>
            ) : projects.filter((p: any) => p.status === 'Active').length === 0 ? (
              <div className="text-center py-10 bg-[#1e293b]/50 rounded-lg">
                <p className="text-[#94a3b8]">No active projects visible to users yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {projects.filter((p: any) => p.status === 'Active').map((project: any) => (
                  <div key={project._id} className="bg-[#1e293b]/50 p-4 rounded-lg border border-[#6366f1]/20">
                    {project.image && (
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h4 className="text-[#f1f5f9] font-semibold mb-1">{project.title}</h4>
                    <Badge className="bg-[#14b8a6]/20 text-[#14b8a6] text-xs mb-2">{project.category}</Badge>
                    <p className="text-[#94a3b8] text-xs line-clamp-2">{project.description}</p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[#6366f1] text-xs px-2 py-1 bg-[#6366f1]/10 rounded">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manage All Projects */}
          <h2 className="text-xl sm:text-2xl text-[#f1f5f9] mb-4 sm:mb-6">Manage All Projects ({projects.length} Total)</h2>
          {console.log('📁 Rendering projects tab, projects count:', projects.length)}
          {console.log('📋 Projects array:', projects)}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#94a3b8] text-lg">No projects yet. Click "Add Project" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project: any) => (
                <GlassCard key={project._id}>
                  <div className="space-y-4">
                    {project.image && (
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl text-[#f1f5f9]">{project.title}</h3>
                        <Badge className={project.status === 'Active' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#94a3b8]/20 text-[#94a3b8]'}>
                          {project.status}
                        </Badge>
                      </div>
                      <Badge className="bg-[#6366f1]/20 text-[#6366f1] mb-3">{project.category}</Badge>
                      <p className="text-[#94a3b8] text-sm mb-3">{project.description}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleToggleProjectStatus(project._id, project.status)}
                        className={project.status === 'Active' ? 'bg-[#94a3b8]' : 'bg-[#10b981]'}
                      >
                        {project.status === 'Active' ? '📦 Archive' : '✅ Activate'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditProject(project)}
                        className="bg-[#6366f1]"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteProject(project._id)}
                        className="bg-[#ef4444]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </motion.div>
        )}

        {/* Exam Requests Tab */}
        {activeTab === 'examRequests' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl text-[#f1f5f9]">Exam Requests ({examRequests.length})</h2>
            <Button
              onClick={() => setShowExamRequestDialog(true)}
              className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request New Exam
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : examRequests.length === 0 ? (
            <div className="text-center py-20 bg-[#1e293b]/40 rounded-lg border border-[#6366f1]/20">
              <ClipboardList className="w-16 h-16 text-[#94a3b8] mx-auto mb-4" />
              <p className="text-[#94a3b8] text-lg">No exam requests yet. Create your first request!</p>
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
                  <Badge variant="outline" className="border-[#6366f1] text-[#6366f1]">
                    {request.difficulty}
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
                    <span className="text-[#94a3b8]">Priority:</span>
                    <Badge className={
                      request.priority === 'high'
                        ? 'bg-[#ef4444]/20 text-[#ef4444]'
                        : request.priority === 'medium'
                        ? 'bg-[#f97316]/20 text-[#f97316]'
                        : 'bg-[#94a3b8]/20 text-[#94a3b8]'
                    }>
                      {request.priority}
                    </Badge>
                  </div>
                  {request.examId && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Exam:</span>
                      <span className="text-[#10b981] text-xs">✓ Created</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleDeleteExamRequest(request._id)}
                    variant="outline"
                    className="flex-1 border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
          )}
        </motion.div>
        )}
      </motion.div>

      {/* Exam Request Dialog */}
      <Dialog open={showExamRequestDialog} onOpenChange={setShowExamRequestDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#6366f1]" />
              Request Exam Creation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#6366f1]/10 p-3 rounded-lg">
              <p className="text-[#94a3b8] text-sm">
                Send a request to examiners to create an exam. Once accepted and created, it will be available for users to book.
              </p>
            </div>
            <Input
              placeholder="Exam Title *"
              value={examRequestForm.title}
              onChange={(e) => setExamRequestForm({...examRequestForm, title: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <Textarea
              placeholder="Exam Description *"
              rows={3}
              value={examRequestForm.description}
              onChange={(e) => setExamRequestForm({...examRequestForm, description: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={examRequestForm.difficulty}
                onValueChange={(value) => setExamRequestForm({...examRequestForm, difficulty: value})}
              >
                <SelectTrigger className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#6366f1]/30">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Duration (minutes) *"
                value={examRequestForm.duration}
                onChange={(e) => setExamRequestForm({...examRequestForm, duration: e.target.value})}
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>
            <Select
              value={examRequestForm.priority}
              onValueChange={(value) => setExamRequestForm({...examRequestForm, priority: value})}
            >
              <SelectTrigger className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#6366f1]/30">
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleCreateExamRequest}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Send Request to Examiner
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Job Title *" 
              value={jobForm.title}
              onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" 
            />
            <Input 
              placeholder="Department *" 
              value={jobForm.department}
              onChange={(e) => setJobForm({...jobForm, department: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" 
            />
            <Textarea 
              placeholder="Job Description *" 
              rows={4} 
              value={jobForm.description}
              onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" 
            />
            <Input 
              placeholder="Location *" 
              value={jobForm.location}
              onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" 
            />
            <Select value={jobForm.type} onValueChange={(value) => setJobForm({...jobForm, type: value})}>
              <SelectTrigger className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#6366f1]/30">
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Salary Range" 
              value={jobForm.salary}
              onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" 
            />
            <Textarea 
              placeholder="Requirements (one per line)" 
              rows={3} 
              value={jobForm.requirements}
              onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]" 
            />
            <Button 
              onClick={handleCreateJob}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]">
              Post Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={(open) => {
        setShowProjectDialog(open);
        if (!open) resetProjectForm();
      }}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Project Title *"
              value={projectForm.title}
              onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <Select
              value={projectForm.category}
              onValueChange={(value) => setProjectForm({...projectForm, category: value})}
            >
              <SelectTrigger className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#6366f1]/30">
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Cloud">Cloud</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Short Description *"
              rows={2}
              value={projectForm.description}
              onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <Textarea
              placeholder="Full Description *"
              rows={4}
              value={projectForm.fullDescription}
              onChange={(e) => setProjectForm({...projectForm, fullDescription: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <Input
              placeholder="Tags (comma separated: AI, Python, React)"
              value={projectForm.tags}
              onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <Input
              placeholder="Image URL"
              value={projectForm.image}
              onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
              className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
            />
            <div className="flex items-center gap-2 bg-[#6366f1]/10 p-3 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#6366f1]" />
              <p className="text-sm text-[#94a3b8]">AI will generate an impactful project summary automatically</p>
            </div>
            <Button
              onClick={handleCreateProject}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              {editingProject ? 'Update Project' : 'Create Project'}
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
