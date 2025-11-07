import { Visitor } from '../models/Visitor.js';
import { geminiClient } from '../utils/geminiClient.js';

export const analyticsController = {
  async trackVisitor(req, res) {
    try {
      const { page, referrer, sessionId } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection.remoteAddress;

      const visitor = new Visitor({
        ipAddress,
        userAgent,
        page,
        referrer: referrer || null,
        sessionId: sessionId || null,
      });

      await visitor.save();
      res.status(200).json({
        message: 'Visitor tracked',
        visitorId: visitor._id,
      });
    } catch (error) {
      console.error('Track visitor error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getDashboard(req, res) {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const totalVisitors = await Visitor.countDocuments();
      const weeklyVisitors = await Visitor.countDocuments({ timestamp: { $gte: sevenDaysAgo } });
      
      const pageStats = await Visitor.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      const dailyStats = await Visitor.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]);

      res.status(200).json({
        message: 'Analytics dashboard retrieved',
        stats: {
          totalVisitors,
          weeklyVisitors,
          pageStats,
          dailyStats,
        },
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getSummary(req, res) {
    try {
      const analyticsData = {
        totalVisitors: await Visitor.countDocuments(),
        weeklyVisitors: await Visitor.countDocuments({
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        topPages: await Visitor.aggregate([
          { $group: { _id: '$page', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
      };

      let aiSummary = 'Analytics data collected successfully';
      try {
        aiSummary = await geminiClient.generateAIInsights(analyticsData);
      } catch (aiError) {
        console.log('AI insights generation skipped');
      }

      res.status(200).json({
        message: 'Analytics summary retrieved',
        data: analyticsData,
        aiInsights: aiSummary,
      });
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
