# 🚀 Mastersolis Backend - Deployment Guide

Complete guide for deploying the Mastersolis backend to production.

## ☁️ Option 1: Deploy to Render (Recommended)

### Step 1: Prepare Repository

```bash
git add .
git commit -m "Initial backend commit"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your repository

### Step 3: Deploy Web Service

1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name:** mastersolis-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Starter (or Pro for better performance)

### Step 4: Connect Database

1. Click "New +" → "PostgreSQL" (or use MongoDB Atlas)
2. Get the connection string
3. Add to environment variables

### Step 5: Set Environment Variables

In Render dashboard, go to Environment:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=generate_a_secure_random_string
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=mastersolis.hr@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://your-frontend-url.vercel.app
PRODUCTION_URL=https://your-frontend-url.vercel.app
```

### Step 6: Deploy

Click "Deploy" and wait for the build to complete!

---

## ☁️ Option 2: Deploy to Railway

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login & Initialize

```bash
railway login
cd backend
railway init
```

### Step 3: Add Environment Variables

```bash
railway variable set NODE_ENV production
railway variable set MONGODB_URI your_uri
railway variable set JWT_SECRET your_secret
# ... add other variables
```

### Step 4: Deploy

```bash
railway up
```

---

## ☁️ Option 3: Deploy to Heroku

### Step 1: Install Heroku CLI

```bash
npm install -g heroku
```

### Step 2: Login & Create App

```bash
heroku login
heroku create mastersolis-backend
```

### Step 3: Add Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
# ... add other variables
```

### Step 4: Deploy

```bash
git push heroku main
```

---

## ☁️ Option 4: Deploy to DigitalOcean App Platform

### Step 1: Create Account

1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up and add payment method

### Step 2: Create App

1. Dashboard → Apps → Create App
2. Select GitHub repository
3. Configure:
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

### Step 3: Add Database

1. Add a MongoDB managed database
2. Or use MongoDB Atlas

### Step 4: Environment Variables

Add in app settings

### Step 5: Deploy

Click "Deploy App"

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create free cluster
3. Choose region close to your deployment

### Step 2: Create Database User

1. Security → Database Access
2. Add Database User
3. Strong password (save it!)

### Step 3: Whitelist IPs

1. Security → Network Access
2. Add IP Address (or 0.0.0.0/0 for all - less secure)

### Step 4: Get Connection String

1. Cluster → Connect
2. Copy connection string
3. Replace `<username>` and `<password>`

### Step 5: Create Database

```javascript
// Connection string format:
mongodb+srv://username:password@cluster.mongodb.net/mastersolis?retryWrites=true&w=majority
```

---

## 🔑 Getting API Keys

### Google Gemini API

1. Go to [makersuite.google.com](https://makersuite.google.com)
2. Click "Create API Key"
3. Copy the key
4. Add to environment

### Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free tier available)
3. Dashboard → Settings
4. Copy:
   - Cloud Name
   - API Key
   - API Secret

### Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → App passwords
3. Generate for Mail/Windows
4. Copy the 16-character password

---

## 🌐 Frontend Configuration

Update frontend `.env.production`:

```
VITE_API_URL=https://your-backend-url.com/api
```

Update `package.json` for production build:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Database connection verified
- [ ] All environment variables set
- [ ] API health check endpoint working
- [ ] JWT tokens generating correctly
- [ ] File uploads to Cloudinary working
- [ ] Emails sending successfully
- [ ] Gemini API requests working
- [ ] CORS enabled for frontend URL
- [ ] Security headers configured
- [ ] Error logging set up
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured (optional)
- [ ] Monitoring/alerts set up

---

## 🧪 Testing Production Backend

```bash
# Health check
curl https://your-backend-url.com/api/health

# Test signup
curl -X POST https://your-backend-url.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test User"
  }'

# Test login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

---

## 🔍 Troubleshooting

### Backend won't start
- Check logs: `render logs` or `heroku logs --tail`
- Verify environment variables are set
- Check MongoDB connection string
- Ensure Node version is compatible

### 502 Bad Gateway
- Backend crashed - check logs
- Check memory usage
- Restart the service

### Database connection fails
- Verify MONGODB_URI
- Check IP whitelist in MongoDB Atlas
- Verify database user credentials

### File uploads fail
- Check Cloudinary credentials
- Verify folder exists in Cloudinary
- Check file size limits

### Emails not sending
- Verify EMAIL_USER and EMAIL_PASS
- For Gmail, use app-specific password
- Check TESTMAIL_API_KEY for dev

### API calls from frontend return 401
- Token might be expired
- Check JWT_SECRET matches on both ends
- Verify token format in Authorization header

---

## 📊 Monitoring & Logs

### Render
- Dashboard → Logs (real-time)
- Metrics tab for CPU/Memory

### Railway
- `railway logs`

### Heroku
- `heroku logs --tail`

### DigitalOcean
- App → Logs tab

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong random strings for JWT_SECRET
   - Rotate secrets periodically

2. **CORS**
   - Only allow known frontend URLs
   - Don't use `*` in production

3. **Rate Limiting**
   - Implement on public endpoints
   - Prevent brute force attacks

4. **HTTPS**
   - Always use SSL/TLS
   - Auto-redirected on most platforms

5. **Database**
   - Regular backups
   - Strong passwords
   - IP whitelist
   - Enable authentication

6. **Secrets Management**
   - Use platform's secret management
   - Encrypt sensitive data
   - Audit access logs

---

## 📈 Scaling Tips

- **Database**: Use MongoDB Atlas Pro for better performance
- **CDN**: Add CloudFront for static assets
- **Caching**: Implement Redis for sessions
- **Load Balancing**: Use managed load balancers
- **Auto-scaling**: Enable on your platform
- **Monitoring**: Set up alerts for high CPU/Memory

---

## 🆘 Support

For deployment issues:
1. Check platform-specific documentation
2. Review error logs carefully
3. Verify all environment variables
4. Test API endpoints manually
5. Contact platform support if needed

Good luck with your deployment! 🎉
