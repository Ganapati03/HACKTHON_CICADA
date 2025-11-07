import { motion } from 'motion/react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { ExternalLink, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const categories = ['All', 'AI/ML', 'Web', 'Cloud', 'Mobile'];

  const projects = [
    {
      id: 1,
      title: 'AI Customer Support Bot',
      category: 'AI/ML',
      description: 'Intelligent chatbot with natural language processing',
      fullDescription: 'An advanced AI-powered customer support system that handles 10,000+ queries daily with 95% accuracy. Utilizes GPT-4 and custom-trained models.',
      tags: ['AI', 'NLP', 'Python', 'TensorFlow'],
      image: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=600',
      aiSummary: 'Revolutionary AI system that reduced customer support costs by 60% while improving satisfaction ratings.',
    },
    {
      id: 2,
      title: 'Cloud Migration Platform',
      category: 'Cloud',
      description: 'Enterprise cloud migration and management',
      fullDescription: 'Comprehensive platform for seamless cloud migration across AWS, Azure, and GCP. Automated deployment and scaling.',
      tags: ['AWS', 'Azure', 'DevOps', 'Kubernetes'],
      image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?w=600',
      aiSummary: 'Enabled seamless migration of 500+ applications to cloud with zero downtime.',
    },
    {
      id: 3,
      title: 'E-commerce Analytics Dashboard',
      category: 'Web',
      description: 'Real-time analytics and insights platform',
      fullDescription: 'Advanced analytics platform providing real-time insights, predictive analytics, and actionable recommendations.',
      tags: ['React', 'Node.js', 'MongoDB', 'D3.js'],
      image: 'https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?w=600',
      aiSummary: 'Increased conversion rates by 35% through AI-powered insights and recommendations.',
    },
    {
      id: 4,
      title: 'Healthcare AI Diagnostics',
      category: 'AI/ML',
      description: 'Medical image analysis and diagnosis',
      fullDescription: 'Deep learning system for medical image analysis with 98% accuracy in detecting anomalies.',
      tags: ['Deep Learning', 'Computer Vision', 'Healthcare'],
      image: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=600',
      aiSummary: 'Assists doctors in early disease detection, potentially saving thousands of lives.',
    },
    {
      id: 5,
      title: 'Mobile Banking App',
      category: 'Mobile',
      description: 'Secure fintech mobile application',
      fullDescription: 'Full-featured mobile banking app with biometric authentication, real-time transactions, and AI-powered financial insights.',
      tags: ['React Native', 'Fintech', 'Security'],
      image: 'https://images.unsplash.com/photo-1690378820474-b468b8ee64d3?w=600',
      aiSummary: 'Serves 2M+ users with bank-grade security and personalized financial advice.',
    },
    {
      id: 6,
      title: 'Smart City IoT Platform',
      category: 'Cloud',
      description: 'IoT data management and analytics',
      fullDescription: 'Scalable IoT platform managing millions of sensors across smart city infrastructure.',
      tags: ['IoT', 'Real-time', 'Big Data'],
      image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?w=600',
      aiSummary: 'Optimized city operations reducing energy consumption by 25% and improving traffic flow.',
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="cursor-pointer h-full" hover={true}>
                  <div onClick={() => setSelectedProject(project)}>
                    <div className="relative overflow-hidden rounded-xl mb-4 h-48">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
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
