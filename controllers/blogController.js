import { Blog } from '../models/Blog.js';
import { Visitor } from '../models/Visitor.js';
import { geminiClient } from '../utils/geminiClient.js';

export const blogController = {
  async getBlogs(req, res) {
    try {
      const blogs = await Blog.find({ status: 'Published' })
        .populate('author', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: 'Blogs retrieved',
        blogs,
      });
    } catch (error) {
      console.error('Get blogs error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getBlogById(req, res) {
    try {
      const blog = await Blog.findById(req.params.id)
        .populate('author', 'name email');

      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Increment views
      blog.views += 1;
      await blog.save();

      res.status(200).json({
        message: 'Blog retrieved',
        blog,
      });
    } catch (error) {
      console.error('Get blog error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async createBlog(req, res) {
    try {
      const { title, content, excerpt, category, tags, imageUrl } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      // Generate SEO summary with AI
      let seoSummary = excerpt || content.substring(0, 150);
      try {
        seoSummary = await geminiClient.generateBlogSummary({ title, content });
      } catch (aiError) {
        console.log('SEO summary generation skipped');
      }

      const blog = new Blog({
        title,
        content,
        excerpt: excerpt || content.substring(0, 150),
        author: req.user.id,
        category: category || 'General',
        tags: tags || [],
        imageUrl: imageUrl || req.file?.path || null,
        imageCloudinaryId: req.file?.filename || null,
        seoSummary,
        status: 'Draft',
      });

      await blog.save();
      res.status(201).json({
        message: 'Blog created successfully',
        blog,
      });
    } catch (error) {
      console.error('Create blog error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateBlog(req, res) {
    try {
      const { title, content, excerpt, category, tags, status } = req.body;
      const updates = {};

      if (title) updates.title = title;
      if (content) updates.content = content;
      if (excerpt) updates.excerpt = excerpt;
      if (category) updates.category = category;
      if (tags) updates.tags = tags;
      if (status) updates.status = status;

      updates.updatedAt = new Date();

      const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      res.status(200).json({
        message: 'Blog updated successfully',
        blog,
      });
    } catch (error) {
      console.error('Update blog error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async deleteBlog(req, res) {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      res.status(200).json({
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      console.error('Delete blog error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async publishBlog(req, res) {
    try {
      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { status: 'Published', updatedAt: new Date() },
        { new: true }
      );

      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      res.status(200).json({
        message: 'Blog published successfully',
        blog,
      });
    } catch (error) {
      console.error('Publish blog error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
