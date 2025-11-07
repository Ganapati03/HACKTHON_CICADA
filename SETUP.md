# Mastersolis Infotech Backend API

A complete Node.js + Express + MongoDB backend powering the AI-Powered Mastersolis Infotech platform with Gemini AI integration, Cloudinary file uploads, and email automation.

## 🎯 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control** - User, HR, Examiner, Developer roles
- ✅ **AI Integration** - Google Gemini API for:
  - Resume analysis and scoring
  - Blog SEO optimization
  - Exam evaluation with feedback
  - Cheat behavior analysis
  - Analytics insights generation
  - Chatbot responses
- ✅ **File Uploads** - Cloudinary integration for:
  - Resume uploads
  - Blog images
  - Profile pictures
  - Project images
- ✅ **Email Automation** - Nodemailer with:
  - Testmail.app (development)
  - Gmail SMTP (production)
  - AI-generated email content
- ✅ **Job Management** - Full CRUD for job postings
- ✅ **Application Tracking** - Resume analysis and status updates
- ✅ **Exam Management** - Create, take, and evaluate exams with cheat detection
- ✅ **Analytics Tracking** - Visitor tracking and insights
- ✅ **Task Management** - Inter-admin task assignment
- ✅ **Blog Management** - With AI SEO optimization

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key
- Gmail account (for production email)
- Testmail.app account (for development email)

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mastersolis

# JWT
JWT_SECRET=your_super_secret_key_here

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=mastersolis.hr@gmail.com
EMAIL_PASS=your_app_specific_password
TESTMAIL_API_KEY=your_testmail_api_key
TESTMAIL_NAMESPACE=mastersolis

# URLs
CLIENT_URL=http://localhost:5173
PRODUCTION_URL=https://mastersolis-frontend.vercel.app
```

### 3. Start Development Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 4. Start Production Server

```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (HR only)
- `PUT /api/jobs/:id` - Update job (HR only)
- `DELETE /api/jobs/:id` - Delete job (HR only)
- `GET /api/jobs/stats` - Get job statistics

### Applications
- `POST /api/applications` - Submit application with resume
- `GET /api/applications` - Get user applications
- `GET /api/applications/all` - Get all applications (HR only)
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/status` - Update status (HR only)

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams` - Create exam (Examiner only)
- `PUT /api/exams/:id` - Update exam (Examiner only)
- `POST /api/exams/:id/submit` - Submit exam answers
- `GET /api/exams/user/results` - Get user results

### Blogs
- `GET /api/blogs` - Get published blogs
- `GET /api/blogs/:id` - Get blog details
- `POST /api/blogs` - Create blog (Developer only)
- `PUT /api/blogs/:id` - Update blog (Developer only)
- `DELETE /api/blogs/:id` - Delete blog (Developer only)
- `POST /api/blogs/:id/publish` - Publish blog

### Analytics
- `POST /api/analytics/track` - Track visitor
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/summary` - Get AI-generated summary

### Email
- `POST /api/email/contact` - Send contact form email
- `POST /api/email/application-status` - Send application status
- `POST /api/email/bulk` - Send bulk emails
- `POST /api/email/custom` - Send custom email

### AI Services
- `POST /api/ai/resume-filter` - Analyze resume
- `POST /api/ai/blog-summary` - Generate blog summary
- `POST /api/ai/evaluate` - Evaluate exam answers
- `POST /api/ai/cheat-analyze` - Analyze cheat behavior
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/summary` - Generate analytics summary
- `POST /api/ai/chatbot` - Chatbot response

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **user** - Regular user (job applicants, exam takers)
- **hr** - Human resources (manage jobs, applications, candidates)
- **examiner** - Exam creator and monitor
- **developer** - Developer dashboard (analytics, blog management)

## 📤 File Upload

Resume and image uploads use Cloudinary storage with automatic organization:

```
mastersolis_uploads/
├── resumes/
├── blogs/
├── profiles/
└── projects/
```

### Upload Example

```javascript
const formData = new FormData();
formData.append('resume', file);

const response = await fetch('/api/applications', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## 🤖 AI Integration

### Gemini API Usage

The backend uses Google's Gemini 1.5 Pro model for:

1. **Resume Analysis** - Scoring and feedback
2. **Blog SEO** - Summary and keyword suggestions
3. **Exam Evaluation** - Answer checking and feedback
4. **Cheat Detection** - Behavior analysis
5. **Analytics** - Insights generation
6. **Email** - Content generation

### Example: Resume Filter

```bash
curl -X POST http://localhost:5000/api/ai/resume-filter \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "..."}'
```

## 📧 Email Configuration

### Development (Testmail.app)

```
TESTMAIL_API_KEY=your_testmail_key
TESTMAIL_NAMESPACE=mastersolis
```

### Production (Gmail)

```
EMAIL_USER=mastersolis.hr@gmail.com
EMAIL_PASS=app_specific_password
```

**Note:** Use [Gmail App Passwords](https://myaccount.google.com/apppasswords) for the email password.

## 🗄️ Database Models

### User
```javascript
{
  name, email, password, role,
  avatar, phone, bio, location,
  skills[], resume, createdAt, updatedAt
}
```

### Job
```javascript
{
  title, department, description, location,
  type, salary, requirements[], postedBy,
  status, applicants, createdAt, updatedAt
}
```

### Application
```javascript
{
  applicantId, jobId, jobTitle, name, email,
  position, resumeUrl, aiScore, aiAnalysis,
  status, interviewDate, appliedDate, updatedAt
}
```

### Exam
```javascript
{
  title, description, duration, difficulty,
  questions[], createdBy, aiGenerated,
  status, createdAt, updatedAt
}
```

### Result
```javascript
{
  userId, examId, examTitle, score, percentage,
  answers, aiFeedback, tabSwitches, completedAt
}
```

### Blog
```javascript
{
  title, content, excerpt, author, category,
  tags[], imageUrl, seoSummary, views,
  status, createdAt, updatedAt
}
```

### Task
```javascript
{
  title, description, from, to, status,
  priority, dueDate, createdAt, updatedAt
}
```

### Visitor
```javascript
{
  ipAddress, userAgent, location, country,
  page, referrer, sessionId, sessionDuration,
  userId, timestamp
}
```

### CheatLog
```javascript
{
  userId, examId, candidateName, examTitle,
  violations[], aiProbability, aiAnalysis,
  severity, reviewed, action, detectedAt, updatedAt
}
```

## 🌐 Deployment

### Deploy to Render

1. Create a Render account
2. Connect your GitHub repository
3. Use the `render.yaml` configuration file
4. Set environment variables in Render dashboard
5. Deploy!

### Deploy to Railway

```bash
npm install -g railway
railway link
railway up
```

### Deploy to Heroku

```bash
heroku create mastersolis-backend
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## 🧪 Testing

Run API tests with Postman or curl:

```bash
# Test health check
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

## 📝 Common Issues

### MongoDB Connection Error
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

### Cloudinary Upload Failed
- Check API credentials
- Verify folder structure exists
- Ensure file size is within limits

### Email Not Sending
- Use Gmail app-specific password (not regular password)
- Check testmail.app API key for development
- Verify email configuration in .env

### Gemini API Error
- Ensure API key is valid
- Check API quota and rate limits
- Verify request format

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

MIT License - feel free to use this for your projects!

## 📧 Support

For support, reach out to: mastersolis.hr@gmail.com

---

**Built with ❤️ for Mastersolis Infotech**
