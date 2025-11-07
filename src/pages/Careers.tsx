import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner@2.0.3';

export default function Careers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const jobs = [
    {
      id: 1,
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote / Bangalore',
      type: 'Full-time',
      salary: '$120k - $180k',
      description: 'Lead AI/ML projects and develop cutting-edge solutions',
      requirements: ['5+ years in ML', 'Python, TensorFlow', 'PhD preferred'],
    },
    {
      id: 2,
      title: 'Cloud Solutions Architect',
      department: 'Cloud',
      location: 'Hybrid / Mumbai',
      type: 'Full-time',
      salary: '$100k - $150k',
      description: 'Design and implement scalable cloud architectures',
      requirements: ['AWS/Azure certified', 'Kubernetes', '7+ years experience'],
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $130k',
      description: 'Build modern web applications with React and Node.js',
      requirements: ['React/Next.js', 'Node.js', '3+ years experience'],
    },
    {
      id: 4,
      title: 'Data Scientist',
      department: 'Analytics',
      location: 'Bangalore',
      type: 'Full-time',
      salary: '$95k - $140k',
      description: 'Extract insights from data and build predictive models',
      requirements: ['Python/R', 'Statistics', 'ML algorithms'],
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      department: 'Operations',
      location: 'Remote / Delhi',
      type: 'Full-time',
      salary: '$85k - $125k',
      description: 'Manage CI/CD pipelines and infrastructure automation',
      requirements: ['Docker/Kubernetes', 'Jenkins', 'IaC tools'],
    },
    {
      id: 6,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Hybrid / Pune',
      type: 'Full-time',
      salary: '$70k - $110k',
      description: 'Create beautiful and intuitive user experiences',
      requirements: ['Figma/Sketch', 'Design systems', 'Portfolio required'],
    },
  ];

  const handleApply = (jobId: number, jobTitle: string) => {
    if (!user) {
      toast.info('Please login to apply', {
        description: 'You need to be logged in to apply for jobs',
      });
      navigate('/login', { state: { from: '/careers', jobId } });
    } else {
      navigate('/user/applications', { state: { applyFor: jobTitle } });
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
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
                      <Badge className="bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]">
                        {job.department}
                      </Badge>
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
                    onClick={() => handleApply(job.id, job.title)}
                    className="w-full mt-auto bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg"
                  >
                    Apply Now
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

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
