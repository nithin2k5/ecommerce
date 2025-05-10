# E-commerce Application

A simple e-commerce application built with Spring Boot and MySQL.

## Prerequisites

- Java 17
- Maven
- Docker and Docker Compose

## Setup

1. Start the MySQL database:
   ```bash
   docker-compose up -d
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

3. The application will be available at http://localhost:8080

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product

## Example Requests

### Create a product
```bash
curl -X POST http://localhost:8080/api/products \
-H "Content-Type: application/json" \
-d '{"name":"Test Product","description":"Test Description","price":99.99,"stock":100}'
```

### Get all products
```bash
curl http://localhost:8080/api/products
```
