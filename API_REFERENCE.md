# 🔌 Mastersolis API Quick Reference

## 📍 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Header
```
Authorization: Bearer <jwt_token>
```

---

## 🔑 Auth Endpoints

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/auth/signup` | ❌ | `{email, password, name}` |
| POST | `/auth/login` | ❌ | `{email, password}` |
| GET | `/auth/me` | ✅ | - |
| PUT | `/auth/profile` | ✅ | `{name?, phone?, location?, bio?, skills?}` |
| POST | `/auth/logout` | ✅ | - |

---

## 💼 Job Endpoints

| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | `/jobs` | ❌ | - | - |
| GET | `/jobs/:id` | ❌ | - | - |
| POST | `/jobs` | ✅ | HR | `{title, department, description, location, type, salary, requirements}` |
| PUT | `/jobs/:id` | ✅ | HR | `{title?, description?, location?, salary?, status?}` |
| DELETE | `/jobs/:id` | ✅ | HR | - |
| GET | `/jobs/stats` | ❌ | - | - |

---

## 📋 Application Endpoints

| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| POST | `/applications` | ❌ | - | `{jobId, jobTitle, name, email, position, resume(file)}` |
| GET | `/applications` | ✅ | User | - |
| GET | `/applications/all` | ✅ | HR | - |
| GET | `/applications/:id` | ✅ | - | - |
| PUT | `/applications/:id/status` | ✅ | HR | `{status, interviewDate?, interviewTime?}` |

**Application Statuses:** `Under Review`, `Interview Scheduled`, `Selected`, `Rejected`

---

## 🧪 Exam Endpoints

| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | `/exams` | ❌ | - | - |
| GET | `/exams/:id` | ❌ | - | - |
| POST | `/exams` | ✅ | Examiner | `{title, description, duration, difficulty, questions?}` |
| PUT | `/exams/:id` | ✅ | Examiner | `{title?, description?, duration?, questions?, status?}` |
| POST | `/exams/:id/submit` | ✅ | User | `{examId, answers{}, tabSwitches}` |
| GET | `/exams/user/results` | ✅ | User | - |

**Exam Difficulty:** `beginner`, `intermediate`, `advanced`

---

## 📚 Blog Endpoints

| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | `/blogs` | ❌ | - | - |
| GET | `/blogs/:id` | ❌ | - | - |
| POST | `/blogs` | ✅ | Developer | `{title, content, excerpt?, category?, tags?, image(file)?}` |
| PUT | `/blogs/:id` | ✅ | Developer | `{title?, content?, excerpt?, category?, tags?, status?}` |
| DELETE | `/blogs/:id` | ✅ | Developer | - |
| POST | `/blogs/:id/publish` | ✅ | Developer | - |

**Blog Status:** `Draft`, `Published`

---

## 📊 Analytics Endpoints

| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| POST | `/analytics/track` | ❌ | - | `{page, referrer?, sessionId?}` |
| GET | `/analytics/dashboard` | ✅ | Developer | - |
| GET | `/analytics/summary` | ✅ | Developer | - |

---

## 📧 Email Endpoints

| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| POST | `/email/contact` | ❌ | - | `{name, email, subject, message}` |
| POST | `/email/application-status` | ✅ | HR | `{email, candidateName, position, status, interviewDate?, interviewTime?}` |
| POST | `/email/bulk` | ✅ | HR | `{recipients[], subject, htmlContent}` |
| POST | `/email/custom` | ✅ | Dev/HR | `{to, subject, html}` |

**Application Status:** `selected`, `rejected`, `interview`

---

## 🤖 AI Endpoints

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/ai/resume-filter` | ❌ | `{resumeText}` |
| POST | `/ai/blog-summary` | ❌ | `{title, content}` |
| POST | `/ai/evaluate` | ❌ | `{examId, answers{}, questions[]}` |
| POST | `/ai/cheat-analyze` | ❌ | `{violations[]}` |
| POST | `/ai/chat` | ❌ | `{message}` |
| POST | `/ai/summary` | ❌ | `{totalVisitors, weeklyVisitors, topPages}` |
| POST | `/ai/chatbot` | ❌ | `{question, context?}` |

---

## ✅ Task Endpoints

| Method | Endpoint | Auth | Role | Body |
|--------|----------|------|------|------|
| GET | `/tasks` | ✅ | - | - |
| POST | `/tasks` | ✅ | HR/Examiner/Dev | `{title, description?, to, status?, priority?, dueDate?}` |
| PUT | `/tasks/:id` | ✅ | - | `{title?, description?, status?, priority?, dueDate?}` |
| DELETE | `/tasks/:id` | ✅ | - | - |
| GET | `/tasks/stats` | ✅ | - | - |

**Task Status:** `pending`, `accepted`, `in-progress`, `done`
**Priority:** `low`, `medium`, `high`

---

## 💾 Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {},
  "token": "jwt_token (if auth)"
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## 📤 File Upload

```javascript
const formData = new FormData();
formData.append('resume', fileInput.files[0]);
formData.append('jobId', jobId);
// ... other fields

fetch('/api/applications', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🔍 Common Query Params

- `page` - Pagination (optional)
- `limit` - Items per page (optional)
- `sort` - Sort field (optional)
- `filter` - Filter criteria (optional)

---

## ⏱️ Rate Limits

- Public endpoints: 60 requests/minute
- Authenticated endpoints: 300 requests/minute
- AI endpoints: 50 requests/minute

---

## 🧩 Example Requests

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "name": "John Doe"
  }'
```

### Submit Application
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "jobId=123" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "position=Software Engineer" \
  -F "resume=@resume.pdf"
```

### AI Resume Analysis
```bash
curl -X POST http://localhost:5000/api/ai/resume-filter \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Resume content here..."
  }'
```

### Send Email
```bash
curl -X POST http://localhost:5000/api/email/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Inquiry",
    "message": "I have a question..."
  }'
```

---

## 🔐 User Roles

| Role | Permissions |
|------|------------|
| **user** | Take exams, apply jobs, view results |
| **hr** | Post jobs, manage applications, send emails |
| **examiner** | Create exams, review cheat logs, assign tasks |
| **developer** | Manage analytics, create blogs, send emails |

---

## 🚨 Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 💡 Tips

1. Always include `Authorization` header for protected routes
2. Use `Content-Type: multipart/form-data` for file uploads
3. Store JWT token in localStorage after login
4. Refresh token on each login
5. Handle 401 errors by redirecting to login

---

**Last Updated:** November 2024
