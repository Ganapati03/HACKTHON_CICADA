import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Clock, Sparkles, User, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { blogAPI } from '../api/client';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Blog() {
  const [summarizing, setSummarizing] = useState<number | null>(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genAI, setGenAI] = useState(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Initialize Gemini AI
  useEffect(() => {
    if (GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
        setGenAI(ai);
        console.log('✅ Blog Gemini AI initialized');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error);
      }
    } else {
      console.warn('⚠️ Gemini API key not found');
    }
  }, [GEMINI_API_KEY]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll();
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleAISummarize = async (blogId, title, content) => {
    try {
      setSummarizing(blogId);
      
      console.log('📝 Generating AI summary for:', title);
      
      if (!genAI) {
        throw new Error('AI assistant is not initialized. Please add VITE_GEMINI_API_KEY to your .env file');
      }

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.9,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      });

      const contextPrompt = `Summarize this blog post in 2-3 sentences. Do not use emojis.

Title: ${title}

Content: ${content}`;
      
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const summary = response.text();
      
      console.log('✅ Summary generated:', summary);
      
      setSummarizing(null);
      
      toast.success('AI Summary Generated! ✨', {
        description: summary,
        duration: 10000,
      });
    } catch (error) {
      console.error('❌ Gemini error:', error);
      
      let errorText = 'Sorry, I couldn\'t process that. Please try again! 😅';
      
      if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key')) {
        errorText = '🔑 API key expired or invalid. Please get a new key from https://aistudio.google.com/app/apikey and add it to .env as VITE_GEMINI_API_KEY';
      } else if (error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        errorText = '⏰ API quota exceeded. Please try again later!';
      } else if (error?.message?.includes('initialized')) {
        errorText = '⏳ AI is starting up. Please add VITE_GEMINI_API_KEY to your .env file and restart!';
      }
      
      toast.error('Error generating summary', {
        description: errorText,
      });
      
      setSummarizing(null);
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
            className="text-center mb-12"
          >
            <h1 className="text-5xl text-[#f1f5f9] mb-6">Tech Insights Blog</h1>
            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
              Stay updated with the latest trends, insights, and best practices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-[#94a3b8] text-lg">No blog posts available yet.</p>
              </div>
            ) : (
            blogs.map((post: any, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col">
                  {post.imageUrl && (
                    <div className="relative overflow-hidden rounded-xl mb-4 h-48">
                      <ImageWithFallback
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[#6366f1] to-[#14b8a6]">
                        {post.category}
                      </Badge>
                    </div>
                  )}

                  <h3 className="text-xl text-[#f1f5f9] mb-2">{post.title}</h3>
                  <p className="text-[#94a3b8] mb-4 flex-grow text-sm">{post.excerpt}</p>

                  <div className="flex items-center gap-4 text-[#94a3b8] text-sm mb-4 flex-wrap">
                    {post.author?.name && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {post.views > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.views} views</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleAISummarize(post._id, post.title, post.content)}
                    disabled={summarizing === post._id}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg"
                  >
                    {summarizing === post._id ? (
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
            )))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
