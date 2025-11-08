import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { FileText, Plus, Edit, Trash2, Eye, Send, Loader } from 'lucide-react';
import { blogAPI } from '../../api/client';
import { toast } from 'sonner';

export default function DeveloperDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Technology',
    tags: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAllForAdmin();
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    try {
      if (!blogForm.title || !blogForm.content) {
        toast.error('Title and content are required');
        return;
      }

      setSubmitting(true);
      const tagsArray = blogForm.tags.split(',').map(t => t.trim()).filter(t => t);
      
      const blogData = {
        ...blogForm,
        tags: tagsArray,
      };

      if (editingBlog) {
        await blogAPI.update(editingBlog._id, blogData);
        toast.success('Blog updated successfully!');
      } else {
        await blogAPI.create(blogData);
        toast.success('Blog created successfully!');
      }

      setShowBlogDialog(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Blog operation failed:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      category: blog.category,
      tags: blog.tags?.join(', ') || '',
      imageUrl: blog.imageUrl || '',
    });
    setShowBlogDialog(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      await blogAPI.delete(blogId);
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const handlePublishBlog = async (blogId) => {
    try {
      await blogAPI.publish(blogId);
      toast.success('Blog published successfully!');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to publish blog');
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      content: '',
      excerpt: '',
      category: 'Technology',
      tags: '',
      imageUrl: '',
    });
  };

  const getStatusBadge = (status) => {
    return status === 'Published' 
      ? <Badge className="bg-[#10b981]/20 text-[#10b981]">Published</Badge>
      : <Badge className="bg-[#f97316]/20 text-[#f97316]">Draft</Badge>;
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'Published').length,
    drafts: blogs.filter(b => b.status === 'Draft').length,
    views: blogs.reduce((sum, b) => sum + (b.views || 0), 0),
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#f1f5f9] mb-2">Developer Dashboard</h1>
            <p className="text-sm sm:text-base text-[#94a3b8]">Manage blog posts and content</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowBlogDialog(true);
            }}
            className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Create Blog
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-xs sm:text-sm">Total Blogs</p>
                <p className="text-2xl sm:text-3xl text-[#f1f5f9] font-bold mt-1">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#6366f1]" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-xs sm:text-sm">Published</p>
                <p className="text-2xl sm:text-3xl text-[#10b981] font-bold mt-1">{stats.published}</p>
              </div>
              <Send className="w-8 h-8 sm:w-10 sm:h-10 text-[#10b981]" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-xs sm:text-sm">Drafts</p>
                <p className="text-2xl sm:text-3xl text-[#f97316] font-bold mt-1">{stats.drafts}</p>
              </div>
              <Edit className="w-8 h-8 sm:w-10 sm:h-10 text-[#f97316]" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-xs sm:text-sm">Total Views</p>
                <p className="text-3xl text-[#14b8a6] font-bold mt-1">{stats.views}</p>
              </div>
              <Eye className="w-10 h-10 text-[#14b8a6]" />
            </div>
          </GlassCard>
        </div>

        {/* Blogs List */}
        <GlassCard>
          <h2 className="text-2xl text-[#f1f5f9] mb-4">All Blogs</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 text-[#6366f1] animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-[#94a3b8] mx-auto mb-4" />
              <p className="text-[#94a3b8]">No blogs yet. Create your first blog post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="p-4 bg-[#0f172a]/30 rounded-lg border border-[#6366f1]/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl text-[#f1f5f9] mb-1">{blog.title}</h3>
                      <p className="text-[#94a3b8] text-sm line-clamp-2">{blog.excerpt || blog.content.substring(0, 150)}</p>
                    </div>
                    {getStatusBadge(blog.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[#94a3b8] mb-3">
                    <span>Category: {blog.category}</span>
                    <span>•</span>
                    <span>{blog.views || 0} views</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {blog.tags.map((tag, idx) => (
                        <Badge key={idx} className="bg-[#6366f1]/20 text-[#6366f1]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBlog(blog)}
                      className="border-[#6366f1] text-[#6366f1]"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    {blog.status === 'Draft' && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishBlog(blog._id)}
                        className="bg-[#10b981] hover:bg-[#059669]"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Publish
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="border-[#ef4444] text-[#ef4444]"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Create/Edit Blog Dialog */}
      <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
        <DialogContent className="bg-[#1e293b] border-[#6366f1]/30 text-[#f1f5f9] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-[#f1f5f9]">Title *</Label>
              <Input
                value={blogForm.title}
                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                placeholder="Enter blog title"
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Category</Label>
              <Select value={blogForm.category} onValueChange={(value) => setBlogForm({ ...blogForm, category: value })}>
                <SelectTrigger className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#6366f1]/30">
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Excerpt</Label>
              <Textarea
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                placeholder="Brief summary (optional)"
                rows={2}
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Content *</Label>
              <Textarea
                value={blogForm.content}
                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                placeholder="Write your blog content here..."
                rows={8}
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Tags (comma-separated)</Label>
              <Input
                value={blogForm.tags}
                onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                placeholder="react, nodejs, ai"
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div>
              <Label className="text-[#f1f5f9]">Image URL (optional)</Label>
              <Input
                value={blogForm.imageUrl}
                onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateBlog}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {editingBlog ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{editingBlog ? 'Update Blog' : 'Create Blog'}</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowBlogDialog(false);
                  resetForm();
                }}
                className="border-[#6366f1]/30"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
