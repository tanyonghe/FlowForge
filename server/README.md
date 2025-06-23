# FlowForge Server

Spring Boot backend application for the FlowForge workflow automation platform.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MongoDB 6.0+

### Development
```bash
# Install dependencies and run
mvn spring-boot:run

# The server will start at http://localhost:8080/api
```

### Production Build
```bash
# Build JAR file
mvn clean package

# Run JAR file
java -jar target/flowforge-0.1.0.jar
```

## 📁 Project Structure

```
server/
├── src/
│   ├── main/
│   │   ├── java/com/github/tanyonghe/flowforge/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── model/           # Domain models
│   │   │   ├── repository/      # MongoDB repositories
│   │   │   ├── service/         # Business logic
│   │   │   ├── security/        # Security configurations
│   │   │   └── FlowForgeApplication.java
│   │   └── resources/
│   │       └── application.yml  # Application configuration
│   └── test/                    # Test files
├── pom.xml                      # Maven configuration
├── Dockerfile                   # Docker configuration
└── .dockerignore               # Docker ignore file
```

## 🛠️ Available Scripts

- `mvn spring-boot:run` - Start development server
- `mvn clean package` - Build JAR file
- `mvn test` - Run tests
- `mvn clean install` - Clean, compile, test, and package

## 🔧 Configuration

### Application Properties
The application is configured via `application.yml`:

```yaml
spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: flowforge
      auto-index-creation: true

  security:
    jwt:
      secret: ${JWT_SECRET:your-256-bit-secret-key-here}
      expiration: 86400000 # 24 hours

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    com.github.tanyonghe.flowforge: DEBUG
    org.springframework.data.mongodb: INFO
    org.springframework.security: INFO
```

### Environment Variables
- `SPRING_DATA_MONGODB_HOST` - MongoDB host (default: localhost)
- `SPRING_DATA_MONGODB_PORT` - MongoDB port (default: 27017)
- `SPRING_DATA_MONGODB_DATABASE` - Database name (default: flowforge)
- `JWT_SECRET` - JWT secret key
- `SPRING_PROFILES_ACTIVE` - Active profile (dev, prod, etc.)

## 🏗️ Architecture

### Technology Stack
- **Framework**: Spring Boot 3.2.3
- **Database**: MongoDB 6.0
- **Security**: Spring Security
- **Build Tool**: Maven
- **Container**: OpenJDK 17

### Key Components

#### Models
- `Workflow` - Main workflow entity
- `WorkflowStep` - Individual workflow steps
- `User` - User entity (for future authentication)

#### Controllers
- `WorkflowController` - REST endpoints for workflow management

#### Services
- `WorkflowService` - Business logic for workflow operations

#### Repositories
- `WorkflowRepository` - MongoDB data access layer

#### Configuration
- `SecurityConfig` - Security configuration (currently disabled)

## 🔌 API Endpoints

### Workflow Management

#### Get All Workflows
```http
GET /api/workflows
```

**Response:**
```json
[
  {
    "id": "685945a83754e65f11be009b",
    "name": "Test Workflow",
    "description": "A test workflow",
    "createdBy": "test-user",
    "steps": [...],
    "metadata": null
  }
]
```

#### Create Workflow
```http
POST /api/workflows
Content-Type: application/json

{
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
}
```

#### Get Workflow by ID
```http
GET /api/workflows/{id}
```

#### Update Workflow
```http
PUT /api/workflows/{id}
Content-Type: application/json

{
  "name": "Updated Workflow",
  "description": "Updated description",
  "steps": [...]
}
```

#### Delete Workflow
```http
DELETE /api/workflows/{id}
```

#### Execute Workflow
```http
POST /api/workflows/{id}/execute
Content-Type: application/json

{
  "input": "test data"
}
```

## 🗄️ Database Schema

### Workflow Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "createdBy": "String",
  "steps": [
    {
      "type": "String",
      "name": "String",
      "config": "Object",
      "nextSteps": ["String"],
      "conditions": "Object"
    }
  ],
  "metadata": "Object"
}
```

### Indexes
- `_id` (primary key)
- `name` (for searching)
- `createdBy` (for user-specific queries)

## 🔒 Security

### Current Configuration
- Spring Security is disabled for development
- All endpoints are publicly accessible
- CORS is configured for localhost

### Production Security
Enable security by updating `SecurityConfig.java`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
}
```

## 🐳 Docker

### Development
```bash
# Build development image
docker build -t flowforge-server:dev .

# Run development container
docker run -p 8080:8080 flowforge-server:dev
```

### Production
```bash
# Build production image
docker build -t flowforge-server:prod .

# Run production container
docker run -d -p 8080:8080 flowforge-server:prod
```

### Docker Configuration
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B
COPY src src
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/flowforge-0.1.0.jar"]
```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=WorkflowServiceTest

# Run tests with coverage
mvn test jacoco:report
```

### Integration Tests
```bash
# Run integration tests
mvn test -Dtest=*IntegrationTest

# Test with embedded MongoDB
mvn test -Dspring.profiles.active=test
```

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

## 📦 Dependencies

### Core Dependencies
- `spring-boot-starter-web` - Web application support
- `spring-boot-starter-data-mongodb` - MongoDB integration
- `spring-boot-starter-security` - Security framework
- `spring-boot-starter-validation` - Bean validation

### JWT Dependencies
- `jjwt-api` - JWT API
- `jjwt-impl` - JWT implementation
- `jjwt-jackson` - JWT Jackson integration

### Development Dependencies
- `spring-boot-starter-test` - Testing support
- `spring-security-test` - Security testing
- `lombok` - Code generation

## 🚀 Deployment

### JAR Deployment
```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/flowforge-0.1.0.jar

# Run with custom profile
java -jar target/flowforge-0.1.0.jar --spring.profiles.active=production
```

### Docker Deployment
```bash
# Build image
docker build -t flowforge-server .

# Run container
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_HOST=mongodb \
  -e SPRING_DATA_MONGODB_DATABASE=flowforge \
  flowforge-server
```

### Cloud Deployment
The application can be deployed to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Kubernetes clusters

## 📊 Monitoring

### Health Checks
```http
GET /api/actuator/health
```

### Metrics
```http
GET /api/actuator/metrics
```

### Logs
Configure logging in `application.yml`:
```yaml
logging:
  level:
    com.github.tanyonghe.flowforge: DEBUG
    org.springframework.data.mongodb: INFO
  file:
    name: logs/flowforge.log
```

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection:**
```bash
# Check MongoDB status
mongo --eval "db.adminCommand('ping')"

# Check connection string
echo $SPRING_DATA_MONGODB_URI
```

**Port Already in Use:**
```bash
# Check what's using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Build Failures:**
```bash
# Clean Maven cache
mvn clean

# Update dependencies
mvn dependency:resolve
```

### Logs
```bash
# View application logs
tail -f logs/flowforge.log

# View Docker logs
docker logs flowforge-server

# View specific log levels
curl -H "Accept: application/json" http://localhost:8080/api/actuator/loggers
```

### Performance
- Monitor MongoDB connection pool
- Check JVM memory usage
- Profile slow queries
- Enable query logging for debugging

## 🤝 Contributing

1. Follow Spring Boot conventions
2. Add comprehensive tests
3. Update API documentation
4. Follow security best practices
5. Add proper error handling
6. Include logging for debugging 