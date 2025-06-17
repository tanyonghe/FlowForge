# FlowForge

A dynamic workflow automation engine built with Spring Boot and MongoDB.

## Features

- Custom workflow definition and execution
- Role-based access control
- RESTful API
- MongoDB persistence
- JWT authentication

## Prerequisites

- Java 17 or higher
- MongoDB 4.4 or higher
- Maven 3.6 or higher

## Setup

1. Clone the repository:
```bash
git clone https://github.com/tanyonghe/FlowForge.git
cd FlowForge
```

2. Configure MongoDB:
   - Ensure MongoDB is running on localhost:27017
   - Create a database named 'flowforge'

3. Configure application:
   - Set JWT_SECRET environment variable (optional)
   - Update `application.yml` if needed

4. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

## API Endpoints

- `POST /api/auth/login` - Authenticate user
- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - List workflows
- `POST /api/workflows/{id}/execute` - Execute workflow
- `GET /api/executions/{id}` - Get execution status

## Project Structure

```
src/main/java/com/github/tanyonghe/flowforge/
├── config/         # Configuration classes
├── controller/     # REST controllers
├── model/          # Domain models
├── repository/     # MongoDB repositories
├── service/        # Business logic
└── security/       # Security configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 