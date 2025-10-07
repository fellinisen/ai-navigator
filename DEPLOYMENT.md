# AI Navigator Deployment Guide

## Quick Start with Docker

The AI Navigator application is containerized and ready for deployment. Follow these steps to host the application:

### Prerequisites
- Docker and Docker Compose installed
- Port 8000 available on your host machine

### Local Deployment

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd AINavigator
   ```

2. **Build and start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Open your browser and navigate to `http://localhost:8000`
   - The application serves both the frontend and backend from port 8000

### Production Deployment

For production deployment, consider the following:

1. **Environment Variables**:
   Create a `.env` file with your production settings:
   ```env
   SMTP_HOST=your-smtp-server.com
   SMTP_PORT=587
   SMTP_USER=your-email@domain.com
   SMTP_PASSWORD=your-app-password
   SECRET_KEY=your-secure-secret-key
   MONGODB_URL=mongodb://your-mongodb-connection-string (optional)
   ```

2. **Run in detached mode**:
   ```bash
   docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Cloud Deployment Options

#### Option 1: Docker Hub + Cloud Provider
1. Push the image to Docker Hub:
   ```bash
   docker tag ai-navigator your-dockerhub-username/ai-navigator
   docker push your-dockerhub-username/ai-navigator
   ```

2. Deploy on your preferred cloud provider (AWS ECS, Google Cloud Run, Azure Container Instances, etc.)

#### Option 2: Direct Cloud Deployment
- **Heroku**: Use the included Dockerfile
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Use the Docker configuration
- **AWS ECS/Fargate**: Use the Docker image
- **Google Cloud Run**: Deploy the container directly

### Application Features

The deployed application includes:
- ✅ **Reduced Question Set**: 25 optimized questions (one per Tier 2 category)
- ✅ **Excel Data Loading**: Automatic loading from Assessment.xlsx
- ✅ **Tier 1 Cascading**: Proper hierarchical categorization
- ✅ **Production Build**: Optimized frontend bundle
- ✅ **Email Integration**: Assessment results via email
- ✅ **Responsive Design**: Works on desktop and mobile

### Monitoring and Maintenance

- **Health Check**: Visit `http://your-domain:8000/health` (if implemented)
- **Logs**: Use `docker-compose logs` to monitor application logs
- **Updates**: Rebuild and redeploy when updating the codebase

### Security Considerations

- Change the default `SECRET_KEY` in production
- Use environment variables for sensitive data
- Consider using HTTPS in production (reverse proxy with nginx/Apache)
- Regularly update dependencies

### Support

For issues or questions about deployment, check the application logs and ensure all environment variables are properly configured.