import { motion } from 'motion/react';
import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import GlassCard from '../../components/GlassCard';
import { Users, FileText, Briefcase, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner@2.0.3';

export default function AdminDashboard() {
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', tags: '' });

  const stats = [
    { label: 'Total Visitors', value: '45.2K', change: '+12.5%', icon: Users, color: 'text-[#6366f1]' },
    { label: 'Blog Posts', value: '128', change: '+8', icon: FileText, color: 'text-[#14b8a6]' },
    { label: 'Exams Created', value: '42', change: '+3', icon: FileText, color: 'text-[#f97316]' },
    { label: 'Job Listings', value: '18', change: '+2', icon: Briefcase, color: 'text-[#10b981]' },
  ];

  const visitorData = [
    { day: 'Mon', visitors: 1200 },
    { day: 'Tue', visitors: 1900 },
    { day: 'Wed', visitors: 1500 },
    { day: 'Thu', visitors: 2100 },
    { day: 'Fri', visitors: 2400 },
    { day: 'Sat', visitors: 1800 },
    { day: 'Sun', visitors: 1600 },
  ];

  const blogData = [
    { month: 'Jan', posts: 12, views: 5400 },
    { month: 'Feb', posts: 15, views: 6200 },
    { month: 'Mar', posts: 18, views: 7800 },
    { month: 'Apr', posts: 14, views: 6900 },
    { month: 'May', posts: 20, views: 8500 },
    { month: 'Jun', posts: 16, views: 7200 },
  ];

  const locationData = [
    { name: 'India', value: 45, color: '#6366f1' },
    { name: 'USA', value: 25, color: '#14b8a6' },
    { name: 'Europe', value: 20, color: '#f97316' },
    { name: 'Others', value: 10, color: '#10b981' },
  ];

  const timeData = [
    { hour: '12AM', time: 45 },
    { hour: '6AM', time: 120 },
    { hour: '12PM', time: 280 },
    { hour: '6PM', time: 340 },
  ];

  const blogs = [
    { id: 1, title: 'The Future of AI', status: 'Published', views: 1240, date: 'Nov 5, 2024' },
    { id: 2, title: 'Cloud Migration Guide', status: 'Draft', views: 0, date: 'Nov 4, 2024' },
    { id: 3, title: 'React Best Practices', status: 'Published', views: 2100, date: 'Nov 3, 2024' },
  ];

  const handleCreateBlog = () => {
    toast.success('Blog post created!', {
      description: 'AI SEO optimization applied',
    });
    setShowBlogDialog(false);
    setBlogForm({ title: '', content: '', tags: '' });
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-[#f1f5f9] mb-2">Developer Dashboard</h1>
            <p className="text-[#94a3b8]">Analytics and content management</p>
          </div>
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
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-[#10b981] text-sm">{stat.change}</span>
                </div>
                <p className="text-[#94a3b8] text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visitor Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <h3 className="text-xl text-[#f1f5f9] mb-4">Daily Visitors</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={visitorData}>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #6366f1' }}
                  />
                  <Line type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Blog Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <h3 className="text-xl text-[#f1f5f9] mb-4">Blog Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={blogData}>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #6366f1' }}
                  />
                  <Legend />
                  <Bar dataKey="posts" fill="#6366f1" />
                  <Bar dataKey="views" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Location Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <h3 className="text-xl text-[#f1f5f9] mb-4">Visitor Locations</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Time-based Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard>
              <h3 className="text-xl text-[#f1f5f9] mb-4">Peak Activity Times</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timeData}>
                  <XAxis dataKey="hour" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #6366f1' }}
                  />
                  <Area type="monotone" dataKey="time" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* AI Insight Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="bg-gradient-to-r from-[#6366f1]/10 to-[#14b8a6]/10">
            <h3 className="text-xl text-[#f1f5f9] mb-4">🤖 AI Insights</h3>
            <div className="space-y-2 text-[#94a3b8]">
              <p>• Traffic increased by 12.5% this week, driven by blog content</p>
              <p>• Peak engagement occurs between 6PM-9PM IST</p>
              <p>• Top performing blog: "React Best Practices" with 2.1K views</p>
              <p>• Recommendation: Publish more content during weekday mornings for optimal reach</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Blog Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-[#f1f5f9]">Blog Manager</h2>
            <Button
              onClick={() => setShowBlogDialog(true)}
              className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Blog
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <GlassCard key={blog.id}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[#f1f5f9]">{blog.title}</h4>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 border-[#6366f1] text-[#6366f1]">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 border-[#ef4444] text-[#ef4444]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-3 py-1 rounded-full ${
                    blog.status === 'Published'
                      ? 'bg-[#10b981]/20 text-[#10b981]'
                      : 'bg-[#f97316]/20 text-[#f97316]'
                  }`}>
                    {blog.status}
                  </span>
                  <div className="flex items-center gap-1 text-[#94a3b8]">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Blog Dialog */}
      <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-[#f1f5f9] mb-2 block">Title</label>
              <Input
                value={blogForm.title}
                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                placeholder="Enter blog title"
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>
            <div>
              <label className="text-[#f1f5f9] mb-2 block">Content</label>
              <Textarea
                value={blogForm.content}
                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                placeholder="Write your blog content..."
                rows={8}
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>
            <div>
              <label className="text-[#f1f5f9] mb-2 block">Tags</label>
              <Input
                value={blogForm.tags}
                onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                placeholder="AI, Cloud, Development"
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>
            <Button
              onClick={handleCreateBlog}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
            >
              Create & Generate AI SEO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
