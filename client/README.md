# FlowForge Client

React TypeScript frontend application for the FlowForge workflow automation platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# The app will open at http://localhost:3000
```

### Production Build
```bash
# Build for production
npm run build

# The build files will be in the `build` folder
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
│   ├── index.html      # Main HTML file
│   ├── favicon.ico     # Favicon
│   └── manifest.json   # Web app manifest
├── src/                # Source code
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── index.tsx       # Entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── Dockerfile          # Docker configuration
└── nginx.conf          # Nginx configuration
```

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

### API Configuration
The frontend communicates with the backend API at:
- Development: `http://localhost:8080/api`
- Production: Configured via environment variables

## 🏗️ Architecture

### Technology Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Create React App
- **Package Manager**: npm
- **Web Server**: Nginx (production)

### Key Features
- Modern React with hooks
- TypeScript for type safety
- Responsive design
- API integration
- Workflow management UI

## 🔌 API Integration

### Workflow Management
The frontend integrates with the following API endpoints:

```typescript
// Example API service
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const workflowService = {
  // Get all workflows
  getWorkflows: () => fetch(`${API_BASE}/workflows`),
  
  // Create workflow
  createWorkflow: (workflow: Workflow) => 
    fetch(`${API_BASE}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    }),
  
  // Get workflow by ID
  getWorkflow: (id: string) => fetch(`${API_BASE}/workflows/${id}`),
  
  // Update workflow
  updateWorkflow: (id: string, workflow: Workflow) =>
    fetch(`${API_BASE}/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    }),
  
  // Delete workflow
  deleteWorkflow: (id: string) =>
    fetch(`${API_BASE}/workflows/${id}`, { method: 'DELETE' }),
  
  // Execute workflow
  executeWorkflow: (id: string, input: any) =>
    fetch(`${API_BASE}/workflows/${id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    })
};
```

## 🐳 Docker

### Development
```bash
# Build development image
docker build -t flowforge-client:dev .

# Run development container
docker run -p 3000:3000 flowforge-client:dev
```

### Production
```bash
# Build production image
docker build -t flowforge-client:prod .

# Run production container
docker run -p 3000:80 flowforge-client:prod
```

### Nginx Configuration
The production build uses Nginx to serve the React app and proxy API requests:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://server:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🧪 Testing

### Unit Tests
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Integration Tests
```bash
# Test API integration
npm run test:integration
```

## 📦 Dependencies

### Core Dependencies
- `react`: 18.x - UI library
- `react-dom`: 18.x - DOM rendering
- `typescript`: 4.x - Type safety

### Development Dependencies
- `@types/react`: TypeScript definitions for React
- `@types/react-dom`: TypeScript definitions for React DOM
- `react-scripts`: Create React App scripts

## 🔒 Security

### CORS Configuration
The frontend is configured to work with the backend API. CORS is handled by:
- Development: React development server
- Production: Nginx proxy configuration

### Environment Variables
- Never commit sensitive data in environment files
- Use `.env.local` for local development secrets
- Production secrets should be injected via Docker environment variables

## 🚀 Deployment

### Build Process
1. Install dependencies: `npm install`
2. Build for production: `npm run build`
3. Serve with Nginx or other web server

### Docker Deployment
```bash
# Build image
docker build -t flowforge-client .

# Run container
docker run -d -p 3000:80 flowforge-client
```

### Static Hosting
The build output can be deployed to:
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages

## 🆘 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection issues:**
```bash
# Check if backend is running
curl http://localhost:8080/api/workflows

# Verify environment variables
echo $REACT_APP_API_URL
```

**Docker build fails:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache .
```

### Development Tips
- Use React Developer Tools for debugging
- Enable TypeScript strict mode for better type safety
- Use ESLint and Prettier for code quality
- Test API endpoints before implementing UI features

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Write tests for new components
4. Update documentation for API changes
5. Test in both development and production builds
