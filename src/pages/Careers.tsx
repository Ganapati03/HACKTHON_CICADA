import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Briefcase, MapPin, DollarSign, Clock, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { jobAPI } from '../api/client';

export default function Careers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getAll();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs', {
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId: string, jobTitle: string) => {
    if (!user) {
      toast.info('Please login to apply', {
        description: 'You need to be logged in to apply for jobs',
      });
      navigate('/login', { state: { from: '/careers', jobId } });
    } else {
      navigate('/user/applications', { state: { applyFor: jobTitle, jobId } });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl text-[#f1f5f9] mb-6">Join Our Team</h1>
            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
              Build the future with us. We're always looking for talented individuals
              who are passionate about technology and innovation.
            </p>
          </motion.div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {['Remote Work', 'Health Insurance', 'Learning Budget', 'Flexible Hours'].map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="text-center" hover={false}>
                  <p className="text-[#6366f1]">{benefit}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#94a3b8] text-lg">No active jobs available at the moment.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job: any, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl text-[#f1f5f9] mb-2">{job.title}</h3>
                      <div className="flex gap-2">
                        <Badge className="bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]">
                          {job.department}
                        </Badge>
                        <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]">
                          {job.applicants || 0} applicants
                        </Badge>
                      </div>
                    </div>
                    <Briefcase className="w-8 h-8 text-[#6366f1]" />
                  </div>

                  <p className="text-[#94a3b8] mb-4">{job.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[#f1f5f9] text-sm mb-2">Requirements:</p>
                    <ul className="space-y-1">
                      {job.requirements.map((req) => (
                        <li key={req} className="text-[#94a3b8] text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleApply(job._id, job.title)}
                    className="w-full mt-auto bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg"
                  >
                    Apply Now
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          )}

          {/* Culture Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-20"
          >
            <GlassCard className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl text-[#f1f5f9] mb-4">Why Mastersolis?</h2>
              <p className="text-[#94a3b8] mb-6">
                We're building a culture of innovation, collaboration, and continuous learning.
                Join a team that values your growth and celebrates your contributions.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Badge className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] px-4 py-2">
                  Innovation First
                </Badge>
                <Badge className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] px-4 py-2">
                  Work-Life Balance
                </Badge>
                <Badge className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] px-4 py-2">
                  Global Impact
                </Badge>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
