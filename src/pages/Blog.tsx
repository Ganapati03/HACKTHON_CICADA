import { motion } from 'motion/react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Clock, Sparkles, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Blog() {
  const [summarizing, setSummarizing] = useState<number | null>(null);

  const posts = [
    {
      id: 1,
      title: 'The Future of AI in Business',
      excerpt: 'Explore how artificial intelligence is transforming modern business operations...',
      author: 'Dr. Alex Thompson',
      date: 'Nov 5, 2024',
      readTime: '5 min',
      category: 'AI',
      image: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=600',
      summary: 'AI is revolutionizing business through automation, predictive analytics, and enhanced decision-making. Key trends include generative AI, edge computing, and ethical AI practices.',
    },
    {
      id: 2,
      title: 'Cloud Migration Best Practices',
      excerpt: 'A comprehensive guide to successfully migrating your infrastructure to the cloud...',
      author: 'Sarah Martinez',
      date: 'Nov 3, 2024',
      readTime: '7 min',
      category: 'Cloud',
      image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?w=600',
      summary: 'Successful cloud migration requires careful planning, security considerations, and phased implementation. Focus on workload assessment, cost optimization, and team training.',
    },
    {
      id: 3,
      title: 'Building Scalable Web Applications',
      excerpt: 'Learn the architectural patterns for creating applications that scale...',
      author: 'James Wilson',
      date: 'Nov 1, 2024',
      readTime: '6 min',
      category: 'Development',
      image: 'https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?w=600',
      summary: 'Scalable architecture involves microservices, load balancing, caching strategies, and database optimization. Modern tools like Kubernetes enable efficient scaling.',
    },
    {
      id: 4,
      title: 'Cybersecurity in the AI Era',
      excerpt: 'Understanding new security challenges and solutions in AI-powered systems...',
      author: 'Lisa Chen',
      date: 'Oct 28, 2024',
      readTime: '8 min',
      category: 'Security',
      image: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=600',
      summary: 'AI introduces new security paradigms. Focus on adversarial ML protection, model security, data privacy, and implementing zero-trust architecture.',
    },
    {
      id: 5,
      title: 'Data Analytics Trends 2024',
      excerpt: 'The latest trends shaping the future of data analytics and visualization...',
      author: 'Dr. Alex Thompson',
      date: 'Oct 25, 2024',
      readTime: '5 min',
      category: 'Analytics',
      image: 'https://images.unsplash.com/photo-1759752394755-1241472b589d?w=600',
      summary: 'Real-time analytics, augmented analytics, and edge analytics are dominating 2024. AI-powered insights are becoming standard for business intelligence.',
    },
    {
      id: 6,
      title: 'The Rise of Low-Code Platforms',
      excerpt: 'How low-code development is democratizing software creation...',
      author: 'Sarah Martinez',
      date: 'Oct 22, 2024',
      readTime: '4 min',
      category: 'Development',
      image: 'https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?w=600',
      summary: 'Low-code platforms accelerate development while maintaining quality. They enable citizen developers and reduce time-to-market for business applications.',
    },
  ];

  const handleAISummarize = (postId: number, summary: string) => {
    setSummarizing(postId);
    setTimeout(() => {
      setSummarizing(null);
      toast.success('AI Summary Generated!', {
        description: summary,
      });
    }, 1500);
  };

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
            <h1 className="text-5xl text-[#f1f5f9] mb-6">Tech Insights Blog</h1>
            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
              Stay updated with the latest trends, insights, and best practices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-4 h-48">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[#6366f1] to-[#14b8a6]">
                      {post.category}
                    </Badge>
                  </div>

                  <h3 className="text-xl text-[#f1f5f9] mb-2">{post.title}</h3>
                  <p className="text-[#94a3b8] mb-4 flex-grow text-sm">{post.excerpt}</p>

                  <div className="flex items-center gap-4 text-[#94a3b8] text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAISummarize(post.id, post.summary)}
                    disabled={summarizing === post.id}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg"
                  >
                    {summarizing === post.id ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Summarize
                      </>
                    )}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
