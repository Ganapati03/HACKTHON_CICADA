import { Task } from '../models/Task.js';

export const taskController = {
  async getTasks(req, res) {
    try {
      const tasks = await Task.find({
        $or: [{ from: req.user.id }, { to: req.user.id }],
      })
        .populate('from', 'name email')
        .populate('to', 'name email')
        .sort({ dueDate: 1 });

      res.status(200).json({
        message: 'Tasks retrieved',
        tasks,
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async createTask(req, res) {
    try {
      const { title, description, to, status, priority, dueDate } = req.body;

      if (!title || !to) {
        return res.status(400).json({ message: 'Title and recipient are required' });
      }

      const task = new Task({
        title,
        description: description || null,
        from: req.user.id,
        to,
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate: dueDate || null,
      });

      await task.save();
      await task.populate('from', 'name email');
      await task.populate('to', 'name email');

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateTask(req, res) {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const updates = {};

      if (title) updates.title = title;
      if (description) updates.description = description;
      if (status) updates.status = status;
      if (priority) updates.priority = priority;
      if (dueDate) updates.dueDate = dueDate;

      updates.updatedAt = new Date();

      const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
        .populate('from', 'name email')
        .populate('to', 'name email');

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json({
        message: 'Task updated successfully',
        task,
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async deleteTask(req, res) {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json({
        message: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getTaskStats(req, res) {
    try {
      const stats = await Task.aggregate([
        {
          $match: {
            $or: [
              { from: mongoose.Types.ObjectId(req.user.id) },
              { to: mongoose.Types.ObjectId(req.user.id) },
            ],
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json({
        message: 'Task stats retrieved',
        stats,
      });
    } catch (error) {
      console.error('Get task stats error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
