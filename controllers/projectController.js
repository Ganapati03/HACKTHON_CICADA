import { Project } from '../models/Project.js';
import { geminiClient } from '../utils/geminiClient.js';

export const projectController = {
  async getProjects(req, res) {
    try {
      const projects = await Project.find({ status: 'Active' })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: 'Projects retrieved',
        projects,
      });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getAllProjectsForAdmin(req, res) {
    try {
      const projects = await Project.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: 'All projects retrieved',
        projects,
      });
    } catch (error) {
      console.error('Get all projects error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getProjectById(req, res) {
    try {
      const project = await Project.findById(req.params.id)
        .populate('createdBy', 'name email');

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json({
        message: 'Project retrieved',
        project,
      });
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async createProject(req, res) {
    try {
      const { title, category, description, fullDescription, tags, image } = req.body;

      if (!title || !category || !description || !fullDescription) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Generate AI summary
      let aiSummary = description;
      try {
        const summaryPrompt = `Generate a brief, impactful 1-sentence summary highlighting the key achievement or benefit of this project: ${title}. Full description: ${fullDescription}`;
        aiSummary = await geminiClient.generateContent(summaryPrompt);
      } catch (aiError) {
        console.log('AI summary generation skipped');
      }

      const project = new Project({
        title,
        category,
        description,
        fullDescription,
        tags: tags || [],
        image: image || req.file?.path || null,
        imageCloudinaryId: req.file?.filename || null,
        aiSummary,
        createdBy: req.user.id,
        status: 'Active',
      });

      await project.save();
      res.status(201).json({
        message: 'Project created successfully',
        project,
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateProject(req, res) {
    try {
      const { title, category, description, fullDescription, tags, image, status } = req.body;
      const updates = {};

      if (title) updates.title = title;
      if (category) updates.category = category;
      if (description) updates.description = description;
      if (fullDescription) updates.fullDescription = fullDescription;
      if (tags) updates.tags = tags;
      if (image) updates.image = image;
      if (status) updates.status = status;

      updates.updatedAt = new Date();

      const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json({
        message: 'Project updated successfully',
        project,
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async deleteProject(req, res) {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json({
        message: 'Project deleted successfully',
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
