# FlowForge

A dynamic workflow automation engine built with Spring Boot, MongoDB, and React - fully containerized with Docker.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)
- Maven 3.6+ (for local development)

### Run with Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd FlowForge

# Build and start all services
npm run docker:build
npm run docker:up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# MongoDB: localhost:27017
```

### Local Development
```bash
# Install dependencies
npm run install:all

# Start MongoDB (ensure it's running on localhost:27017)
# Create database: flowforge

# Start both client and server
npm run dev
```

## 📁 Project Structure

```
FlowForge/
├── client/              # React TypeScript frontend
│   ├── src/            # React source code
│   ├── public/         # Static assets
│   ├── Dockerfile      # Frontend container
│   └── nginx.conf      # Nginx configuration
├── server/             # Spring Boot backend
│   ├── src/            # Java source code
│   ├── pom.xml         # Maven configuration
│   └── Dockerfile      # Backend container
├── docker-compose.yml  # Multi-service orchestration
├── package.json        # Root package.json with scripts
└── README.md           # This file
```

## 🛠️ Available Scripts

### Docker Commands
- `npm run docker:build` - Build all Docker images
- `npm run docker:up` - Start all services
- `npm run docker:down` - Stop all services
- `npm run docker:logs` - View logs
- `npm run docker:restart` - Restart services
- `npm run docker:clean` - Clean up volumes and containers

### Development Commands
- `npm run dev` - Start both client and server in development mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend client
- `npm run build` - Build both client and server for production
- `npm run test` - Run tests for both client and server

## 🔧 API Endpoints

### Workflow Management
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create new workflow
- `GET /api/workflows/{id}` - Get workflow by ID
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/execute` - Execute workflow

### Example Workflow Creation
```bash
curl -X POST http://localhost:8080/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "description": "A test workflow",
    "createdBy": "test-user",
    "steps": [
      {
        "type": "start",
        "name": "Start",
        "config": {},
        "nextSteps": ["step1"]
      },
      {
        "type": "task",
        "name": "Step 1",
        "config": {"action": "print"},
        "nextSteps": ["end"]
      },
      {
        "type": "end",
        "name": "End",
        "config": {}
      }
    ]
  }'
```

## 🏗️ Architecture

### Backend (Server)
- **Framework**: Spring Boot 3.2.3
- **Database**: MongoDB 6.0
- **Security**: Spring Security (currently disabled for development)
- **Build Tool**: Maven
- **Container**: OpenJDK 17

### Frontend (Client)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Create React App
- **Web Server**: Nginx
- **Container**: Node.js 18 + Nginx Alpine

### Database
- **MongoDB**: 6.0
- **Database**: flowforge
- **Collections**: workflows
- **Authentication**: Disabled (development mode)

## 🔒 Security

Currently configured for development with:
- Spring Security disabled
- MongoDB without authentication
- CORS enabled for localhost

For production deployment, enable:
- MongoDB authentication
- Spring Security with JWT
- HTTPS
- Environment-specific configurations

## 🐳 Docker Configuration

### Services
1. **mongodb**: MongoDB database
2. **server**: Spring Boot application
3. **client**: React application with Nginx

### Networks
- `flowforge-network`: Internal communication between services

### Volumes
- `mongodb_data`: Persistent MongoDB data

### Ports
- `3000`: Frontend (mapped to container port 80)
- `8080`: Backend API
- `27017`: MongoDB

## 🧪 Testing

### API Testing
```bash
# Test workflow creation
curl -X POST http://localhost:8080/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "description": "Test workflow", "createdBy": "test"}'

# Test workflow retrieval
curl http://localhost:8080/api/workflows

# Test workflow execution
curl -X POST http://localhost:8080/api/workflows/{id}/execute \
  -H "Content-Type: application/json" \
  -d '{"input": "test data"}'
```

### Frontend Testing
- Open http://localhost:3000 in your browser
- The React app should load with the default Create React App page

## 🚀 Deployment

### Production Deployment
1. Set environment variables for security
2. Enable MongoDB authentication
3. Configure HTTPS certificates
4. Set up proper logging and monitoring
5. Use production-grade MongoDB cluster

### Environment Variables
```bash
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password

# JWT
JWT_SECRET=your-secure-jwt-secret

# Application
SPRING_PROFILES_ACTIVE=production
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080
lsof -i :27017

# Stop conflicting services or change ports in docker-compose.yml
```

**Docker build fails:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

**MongoDB connection issues:**
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

**Frontend not loading:**
```bash
# Check client logs
docker-compose logs client

# Rebuild client
docker-compose build client
```

### Logs
```bash
# View all logs
npm run docker:logs

# View specific service logs
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb
``` 