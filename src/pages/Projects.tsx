import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { ExternalLink, Sparkles, Loader } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { projectAPI } from '../api/client';
import { toast } from 'sonner';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'AI/ML', 'Web', 'Cloud', 'Mobile'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl text-[#f1f5f9] mb-6">Our Projects</h1>
            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
              Innovative solutions that drive real-world impact
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  filter === category
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white shadow-lg'
                    : 'bg-[#1e293b]/40 text-[#94a3b8] hover:bg-[#1e293b]/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#94a3b8] text-lg">No projects available yet.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="cursor-pointer h-full" hover={true}>
                  <div onClick={() => setSelectedProject(project)}>
                    <div className="relative overflow-hidden rounded-xl mb-4 h-48">
                      {project.image && (
                        <ImageWithFallback
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                    </div>
                    
                    <h3 className="text-xl text-[#f1f5f9] mb-2">{project.title}</h3>
                    <p className="text-[#94a3b8] mb-4 text-sm">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="bg-[#6366f1]/10 border-[#6366f1] text-[#6366f1]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <ImageWithFallback
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
                
                <p className="text-[#94a3b8]">{selectedProject.fullDescription}</p>
                
                <div className="flex items-start gap-2 bg-[#6366f1]/10 p-4 rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#6366f1] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#6366f1] mb-1">AI Summary</p>
                    <p className="text-[#f1f5f9] text-sm">{selectedProject.aiSummary}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag: string) => (
                    <Badge key={tag} className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                  View Case Study <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
