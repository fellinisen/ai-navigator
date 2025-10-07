# Railway Deployment Guide

This guide will help you deploy the AI Navigator application to Railway, a free cloud platform.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to connect with Railway
2. **Railway Account**: Sign up at [railway.app](https://railway.app) (free tier available)

## Step-by-Step Deployment

### 1. Prepare Your Repository

First, initialize a Git repository and push your code to GitHub:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - AI Navigator application"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/ai-navigator.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Railway

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `ai-navigator` repository

3. **Configure Environment Variables**
   Railway will automatically detect the Dockerfile and start building. You may want to add these environment variables:
   
   - `SMTP_SERVER` (optional): Your SMTP server for email functionality
   - `SMTP_PORT` (optional): SMTP port (usually 587)
   - `SMTP_USERNAME` (optional): Your email username
   - `SMTP_PASSWORD` (optional): Your email password
   - `SECRET_KEY` (optional): A secret key for the application

4. **Deploy**
   - Railway will automatically build and deploy your application
   - The build process takes 3-5 minutes
   - You'll get a public URL like `https://your-app-name.railway.app`

### 3. Verify Deployment

Once deployed, test your application:

1. **Health Check**: Visit `https://your-app-name.railway.app/health`
2. **Main Application**: Visit `https://your-app-name.railway.app`
3. **API Documentation**: Visit `https://your-app-name.railway.app/docs`

## Configuration Files

The following files have been configured for Railway deployment:

- **`railway.json`**: Railway-specific configuration
- **`Dockerfile`**: Updated to use Railway's dynamic PORT
- **`.gitignore`**: Excludes sensitive files from version control
- **Health endpoint**: Added `/health` endpoint for monitoring

## Free Tier Limits

Railway's free tier includes:
- **$5 monthly credit** (usually sufficient for small applications)
- **Automatic sleep** after 30 minutes of inactivity
- **Custom domains** available
- **Automatic HTTPS**

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Ensure all dependencies are in `requirements.txt`
- Verify Dockerfile syntax

### Application Won't Start
- Check if the PORT environment variable is being used correctly
- Verify the health endpoint responds
- Check application logs in Railway dashboard

### Email Not Working
- Ensure SMTP environment variables are set
- Test with a simple SMTP service like Gmail or SendGrid

## Alternative Free Providers

If Railway doesn't work for you, consider these alternatives:

1. **Heroku** (limited free tier)
2. **Render** (free tier available)
3. **Fly.io** (free allowance)
4. **Vercel** (for frontend + serverless functions)

## Support

For Railway-specific issues:
- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

For application issues, check the logs in your Railway dashboard.