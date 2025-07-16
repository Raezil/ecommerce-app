# API cURL Commands Reference

## Authentication Routes (No JWT Required)

### 1. User Registration
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

**Or capture the token directly into an environment variable:**
```bash
export TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","password":"StrongP@ssw0rd!"}' \
  | jq -r .token)
```

**Note:** Save the JWT token from the login response for use in authenticated requests below.

## Product Routes (JWT Required)

### 3. Get All Products
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Get Products by Category (Query Parameter)
```bash
curl -X GET "http://localhost:3000/products?category=Electronics" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Get Product by ID
```bash
curl -X GET http://localhost:3000/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Add New Product
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Smartphone",
    "category": "Electronics",
    "price": 799.99
  }'
```

## User Management Routes (JWT Required)

### 7. Get All Users
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Get User by ID
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Update User
```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "newemail@example.com",
    "role": "admin"
  }'
```

### 10. Delete User
```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Usage Instructions

1. **First**, register a user using the registration endpoint
2. **Then**, login with those credentials to get a JWT token using the export command
3. **Run** the authenticated commands with the `$TOKEN` environment variable
4. **Note**: The token expires in 1 hour, so you may need to re-login and export a new token

## Sample Workflow

```bash
# Step 1: Register a user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "bob", "email": "bob@example.com", "password": "StrongP@ssw0rd!", "role": "user"}'

# Step 2: Login and extract token to environment variable
export TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","password":"StrongP@ssw0rd!"}' \
  | jq -r .token)

# Step 3: Verify token was captured
echo "Token: $TOKEN"

# Step 4: Use token for authenticated requests
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"
```

## Using the Token Variable

Once you've exported the TOKEN variable, you can use `$TOKEN` in all your authenticated requests:

```bash
# Get all products
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"

# Get specific product
curl -X GET http://localhost:3000/products/1 \
  -H "Authorization: Bearer $TOKEN"

# Add new product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Tablet", "category": "Electronics", "price": 499.99}'

# Get all users
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

- All authenticated routes require the `Authorization: Bearer <token>` header
- The JWT token expires in 1 hour (as configured in the auth controller)
- Product prices must be positive numbers
- User roles default to "user" if not specified during registration
- The API returns JSON responses for all endpoints