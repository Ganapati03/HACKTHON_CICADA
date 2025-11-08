import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

dotenv.config();

// Import models
import { User } from './models/User.js';
import { Job } from './models/Job.js';
import { Application } from './models/Application.js';
import { Exam } from './models/Exam.js';
import { Result } from './models/Result.js';
import { Blog } from './models/Blog.js';
import { Visitor } from './models/Visitor.js';
import { CheatLog } from './models/CheatLog.js';
import { Task } from './models/Task.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mastersolis', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for Seeding');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Exam.deleteMany({});
    await Result.deleteMany({});
    await Blog.deleteMany({});
    await Visitor.deleteMany({});
    await CheatLog.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await bcryptjs.hash('Test@12345', 10);
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@mastersolis.com',
        password: hashedPassword,
        role: 'developer',
        phone: '+91 9876543210',
        bio: 'Platform Administrator',
        location: 'Bangalore, India',
        skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
      },
      {
        name: 'HR Manager',
        email: 'hr@mastersolis.com',
        password: hashedPassword,
        role: 'hr',
        phone: '+91 9876543211',
        bio: 'Human Resources Manager',
        location: 'Bangalore, India',
        skills: ['Recruitment', 'Management', 'Communication'],
      },
      {
        name: 'Examiner',
        email: 'examiner@mastersolis.com',
        password: hashedPassword,
        role: 'examiner',
        phone: '+91 9876543212',
        bio: 'Exam Coordinator',
        location: 'Bangalore, India',
        skills: ['Assessment', 'Question Design', 'Analysis'],
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+91 9876543213',
        bio: 'Software Developer',
        location: 'Bangalore, India',
        skills: ['React', 'Node.js', 'JavaScript'],
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '+91 9876543214',
        bio: 'Full Stack Developer',
        location: 'Hyderabad, India',
        skills: ['React', 'Express', 'MongoDB'],
      },
    ]);
    console.log('✅ Users created:', users.length);

    // Create jobs
    const jobs = await Job.insertMany([
      {
        title: 'Senior React Developer',
        department: 'Engineering',
        description: 'We are looking for an experienced React developer to join our team.',
        location: 'Bangalore, India',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        requirements: ['5+ years React', 'TypeScript', 'Node.js'],
        postedBy: users[1]._id,
        status: 'Active',
        applicants: 3,
      },
      {
        title: 'Full Stack Developer',
        department: 'Engineering',
        description: 'Build scalable web applications with modern tech stack.',
        location: 'Remote',
        type: 'Full-time',
        salary: '$100,000 - $130,000',
        requirements: ['React', 'Node.js', 'MongoDB', 'AWS'],
        postedBy: users[1]._id,
        status: 'Active',
        applicants: 5,
      },
      {
        title: 'DevOps Engineer',
        department: 'Operations',
        description: 'Manage infrastructure and deployment pipelines.',
        location: 'Bangalore, India',
        type: 'Full-time',
        salary: '$90,000 - $120,000',
        requirements: ['Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD'],
        postedBy: users[1]._id,
        status: 'Active',
        applicants: 2,
      },
    ]);
    console.log('✅ Jobs created:', jobs.length);

    // Create applications
    const applications = await Application.insertMany([
      {
        applicantId: users[3]._id,
        jobId: jobs[0]._id,
        jobTitle: jobs[0].title,
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Senior React Developer',
        resumeUrl: 'https://res.cloudinary.com/demo/image/upload/v1/resume_john.pdf',
        resumeCloudinaryId: 'mastersolis_uploads/resumes/resume_john',
        aiScore: 92,
        aiAnalysis: 'Excellent match. Strong React experience and relevant skills.',
        status: 'Interview Scheduled',
        interviewDate: new Date('2025-11-20'),
        appliedDate: new Date('2025-11-05'),
      },
      {
        applicantId: users[4]._id,
        jobId: jobs[1]._id,
        jobTitle: jobs[1].title,
        name: 'Jane Smith',
        email: 'jane@example.com',
        position: 'Full Stack Developer',
        resumeUrl: 'https://res.cloudinary.com/demo/image/upload/v1/resume_jane.pdf',
        resumeCloudinaryId: 'mastersolis_uploads/resumes/resume_jane',
        aiScore: 88,
        aiAnalysis: 'Good match. Solid full stack experience.',
        status: 'Under Review',
        appliedDate: new Date('2025-11-06'),
      },
    ]);
    console.log('✅ Applications created:', applications.length);

    // Create exams
    const exams = await Exam.insertMany([
      {
        title: 'React Developer Assessment',
        description: 'Test your React and JavaScript knowledge',
        duration: 60,
        difficulty: 'intermediate',
        questions: [
          {
            id: 1,
            question: 'What is the virtual DOM?',
            options: [
              'A programming interface',
              'A lightweight copy of the real DOM',
              'A database concept',
              'A CSS framework',
            ],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: 'Which hook manages state in React?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
          },
          {
            id: 3,
            question: 'What is JSX?',
            options: [
              'A database query language',
              'A JavaScript extension for XML-like syntax',
              'A CSS preprocessor',
              'A testing library',
            ],
            correctAnswer: 1,
          },
        ],
        createdBy: users[2]._id,
        aiGenerated: true,
        status: 'Active',
      },
      {
        title: 'Node.js Backend Fundamentals',
        description: 'Test your Node.js and Express knowledge',
        duration: 45,
        difficulty: 'beginner',
        questions: [
          {
            id: 1,
            question: 'What is Node.js?',
            options: [
              'A JavaScript runtime',
              'A database',
              'A CSS framework',
              'A design tool',
            ],
            correctAnswer: 0,
          },
          {
            id: 2,
            question: 'Which module is used for HTTP server in Node.js?',
            options: ['fs', 'http', 'path', 'os'],
            correctAnswer: 1,
          },
        ],
        createdBy: users[2]._id,
        aiGenerated: false,
        status: 'Active',
      },
    ]);
    console.log('✅ Exams created:', exams.length);

    // Create results
    const results = await Result.insertMany([
      {
        userId: users[3]._id,
        examId: exams[0]._id,
        examTitle: exams[0].title,
        score: 28,
        percentage: 93,
        answers: { '0': '1', '1': '1', '2': '1' },
        aiFeedback: 'Excellent performance! You have a strong understanding of React concepts.',
        tabSwitches: 0,
        completedAt: new Date('2025-11-07'),
      },
      {
        userId: users[4]._id,
        examId: exams[1]._id,
        examTitle: exams[1].title,
        score: 18,
        percentage: 75,
        answers: { '0': '0', '1': '1' },
        aiFeedback: 'Good work! Consider reviewing more advanced Node.js concepts.',
        tabSwitches: 1,
        completedAt: new Date('2025-11-06'),
      },
    ]);
    console.log('✅ Results created:', results.length);

    // Create blogs
    const blogs = await Blog.insertMany([
      {
        title: 'Getting Started with React Hooks',
        content:
          'React Hooks allow you to use state and other React features without writing class components. In this guide, we will explore useState, useEffect, and custom hooks...',
        excerpt: 'Learn how to use React Hooks effectively in your applications',
        author: users[0]._id,
        category: 'React',
        tags: ['react', 'hooks', 'javascript'],
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog_react_hooks.jpg',
        imageCloudinaryId: 'mastersolis_uploads/blogs/blog_react_hooks',
        seoSummary:
          'Comprehensive guide to React Hooks: useState, useEffect, and custom hooks for modern React development.',
        views: 250,
        status: 'Published',
      },
      {
        title: 'MongoDB Best Practices',
        content:
          'Learn best practices for designing and maintaining MongoDB databases. This includes indexing strategies, schema design, and performance optimization...',
        excerpt: 'Master MongoDB design patterns and optimization techniques',
        author: users[0]._id,
        category: 'Database',
        tags: ['mongodb', 'database', 'nodejs'],
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog_mongodb.jpg',
        imageCloudinaryId: 'mastersolis_uploads/blogs/blog_mongodb',
        seoSummary:
          'MongoDB best practices: indexing, schema design, and performance optimization for production applications.',
        views: 180,
        status: 'Published',
      },
      {
        title: 'Building RESTful APIs with Express',
        content: 'A comprehensive guide to building robust RESTful APIs using Express.js...',
        excerpt: 'Master Express.js for API development',
        author: users[0]._id,
        category: 'Backend',
        tags: ['express', 'api', 'nodejs'],
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog_express.jpg',
        imageCloudinaryId: 'mastersolis_uploads/blogs/blog_express',
        seoSummary: 'Build production-ready RESTful APIs with Express.js, middleware, and best practices.',
        views: 320,
        status: 'Published',
      },
    ]);
    console.log('✅ Blogs created:', blogs.length);

    // Create visitors (analytics data)
    const visitors = await Visitor.insertMany([
      {
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        location: 'Bangalore',
        country: 'India',
        page: '/',
        referrer: 'google.com',
        sessionId: 'sess_001',
        sessionDuration: 300,
        userId: users[3]._id,
        timestamp: new Date('2025-11-07T10:00:00'),
      },
      {
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
        location: 'Hyderabad',
        country: 'India',
        page: '/blog',
        referrer: null,
        sessionId: 'sess_002',
        sessionDuration: 450,
        userId: users[4]._id,
        timestamp: new Date('2025-11-07T11:30:00'),
      },
      {
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
        location: 'Delhi',
        country: 'India',
        page: '/careers',
        referrer: 'linkedin.com',
        sessionId: 'sess_003',
        sessionDuration: 600,
        timestamp: new Date('2025-11-07T12:00:00'),
      },
      {
        ipAddress: '192.168.1.103',
        location: 'Mumbai',
        country: 'India',
        page: '/services',
        sessionId: 'sess_004',
        sessionDuration: 200,
        timestamp: new Date('2025-11-07T13:15:00'),
      },
    ]);
    console.log('✅ Visitors created:', visitors.length);

    // Create cheat logs
    const cheatLogs = await CheatLog.insertMany([
      {
        userId: users[3]._id,
        examId: exams[0]._id,
        candidateName: 'John Doe',
        examTitle: 'React Developer Assessment',
        violations: ['Tab Switch x2'],
        aiProbability: 45,
        aiAnalysis: 'Low probability of cheating. Minor tab switches detected.',
        severity: 'low',
        reviewed: true,
        action: 'Exam accepted with warning',
        detectedAt: new Date('2025-11-07'),
      },
      {
        userId: users[4]._id,
        examId: exams[1]._id,
        candidateName: 'Jane Smith',
        examTitle: 'Node.js Backend Fundamentals',
        violations: ['Tab Switch x1'],
        aiProbability: 30,
        aiAnalysis: 'Very low probability of cheating.',
        severity: 'low',
        reviewed: false,
        detectedAt: new Date('2025-11-06'),
      },
    ]);
    console.log('✅ Cheat Logs created:', cheatLogs.length);

    // Create tasks
    const tasks = await Task.insertMany([
      {
        title: 'Review React Assessment Questions',
        description: 'Review and finalize the React developer assessment questions',
        from: users[1]._id,
        to: users[2]._id,
        status: 'accepted',
        priority: 'high',
        dueDate: new Date('2025-11-15'),
      },
      {
        title: 'Schedule Interviews for Selected Candidates',
        description: 'Contact selected candidates and schedule interviews',
        from: users[1]._id,
        to: users[2]._id,
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2025-11-12'),
      },
      {
        title: 'Create Analytics Report',
        description: 'Generate monthly analytics report for management',
        from: users[0]._id,
        to: users[1]._id,
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date('2025-11-20'),
      },
      {
        title: 'Update Blog Content',
        description: 'Update and publish new blog posts about latest technologies',
        from: users[0]._id,
        to: users[2]._id,
        status: 'pending',
        priority: 'low',
        dueDate: new Date('2025-11-25'),
      },
    ]);
    console.log('✅ Tasks created:', tasks.length);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Jobs: ${jobs.length}`);
    console.log(`   Applications: ${applications.length}`);
    console.log(`   Exams: ${exams.length}`);
    console.log(`   Results: ${results.length}`);
    console.log(`   Blogs: ${blogs.length}`);
    console.log(`   Visitors: ${visitors.length}`);
    console.log(`   Cheat Logs: ${cheatLogs.length}`);
    console.log(`   Tasks: ${tasks.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => seedDatabase());
