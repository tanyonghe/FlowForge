# FlowForge

A dynamic workflow automation engine built with Spring Boot, MongoDB, and React.

## Project Structure

```
FlowForge/
├── client/          # React frontend application
├── server/          # Spring Boot backend application
├── package.json     # Root package.json for monorepo
└── README.md        # This file
```

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MongoDB 4.4 or higher
- Maven 3.6 or higher

## Quick Start

1. Install dependencies:
```bash
npm run install:all
```

2. Start MongoDB:
```bash
# Ensure MongoDB is running on localhost:27017
# Create a database named 'flowforge'
```

3. Start both client and server:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:8080/api`
- Frontend client on `http://localhost:3000`

## Development

### Backend (Server)
- Spring Boot application with MongoDB
- RESTful API endpoints
- JWT authentication
- Workflow execution engine

### Frontend (Client)
- React TypeScript application
- Modern UI for workflow management
- Real-time workflow execution monitoring

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run test` - Run tests for both client and server
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend client

## API Endpoints

- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - List workflows
- `GET /api/workflows/{id}` - Get workflow by ID
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/execute` - Execute workflow

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 