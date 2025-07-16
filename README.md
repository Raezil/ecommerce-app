# Products API

A simple Express.js REST API for managing products and users with JWT authentication, CRUD operations, and filtering capabilities.

## Features

- **Authentication**: JWT-based user authentication
- **User Management**: User registration, login, and CRUD operations
- **Product Management**: List, get, filter, and add products
- **Authorization**: Protected routes with JWT middleware
- **Error Handling**: Comprehensive error handling for invalid requests
- **JSON Response Format**: All endpoints return JSON responses

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL (for database)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install express sequelize bcrypt jsonwebtoken
npm install --save pg pg-hstore
```

3. Set up your database configuration in `config/db.js`

### Running the Server

```bash
node index.js
```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## API Endpoints

### Authentication Routes (No JWT Required)

#### User Registration
**POST** `/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "Id": 1,
  "Username": "john_doe",
  "Email": "john@example.com",
  "Role": "user"
}
```

#### User Login
**POST** `/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Product Routes (JWT Required)

#### Get All Products
**GET** `/products`

Returns a list of all products.

**Headers:**
- `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "Id": 1,
    "Name": "Laptop",
    "Category": "Electronics",
    "Price": 999.99
  },
  {
    "Id": 2,
    "Name": "Chair",
    "Category": "Furniture",
    "Price": 199.99
  }
]
```

#### Get Products by Category
**GET** `/products?category={category}`

Returns products filtered by category.

**Query Parameters:**
- `category` (string) - Category name to filter by

**Response (200):**
```json
[
  {
    "Id": 1,
    "Name": "Laptop",
    "Category": "Electronics",
    "Price": 999.99
  },
  {
    "Id": 4,
    "Name": "Phone",
    "Category": "Electronics",
    "Price": 599.99
  }
]
```

#### Get Product by ID
**GET** `/products/:id`

Returns a specific product by its ID.

**Parameters:**
- `id` (number) - Product ID

**Response (200):**
```json
{
  "Id": 1,
  "Name": "Laptop",
  "Category": "Electronics",
  "Price": 999.99
}
```

**Error Response (404):**
```json
{
  "error": "Product not found"
}
```

#### Add New Product
**POST** `/products`

Creates a new product.

**Request Body:**
```json
{
  "name": "Smartphone",
  "category": "Electronics",
  "price": 799.99
}
```

**Response (201):**
```json
{
  "Id": 5,
  "Name": "Smartphone",
  "Category": "Electronics",
  "Price": 799.99
}
```

### User Management Routes (JWT Required)

#### Get All Users
**GET** `/users`

Returns a list of all users (admin access recommended).

**Response (200):**
```json
[
  {
    "Id": 1,
    "Username": "john_doe",
    "Email": "john@example.com",
    "Role": "user"
  }
]
```

#### Get User by ID
**GET** `/users/:id`

Returns a specific user by ID.

**Response (200):**
```json
{
  "Id": 1,
  "Username": "john_doe",
  "Email": "john@example.com",
  "Role": "user"
}
```

#### Update User
**PATCH** `/users/:id`

Updates user information.

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "role": "admin"
}
```

#### Delete User
**DELETE** `/users/:id`

Deletes a user account.

**Response (204):** No content

---

## cURL Commands Reference

### Authentication Routes (No JWT Required)

#### 1. User Registration
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

#### 2. User Login
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

### Product Routes (JWT Required)

#### 3. Get All Products
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Get Products by Category (Query Parameter)
```bash
curl -X GET "http://localhost:3000/products?category=Electronics" \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Get Product by ID
```bash
curl -X GET http://localhost:3000/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. Add New Product
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

### User Management Routes (JWT Required)

#### 7. Get All Users
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

#### 8. Get User by ID
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 9. Update User
```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "newemail@example.com",
    "role": "admin"
  }'
```

#### 10. Delete User
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

## Sample Data

The API comes with the following sample products:

| ID | Name | Category | Price |
|----|------|----------|-------|
| 1 | Laptop | Electronics | $999.99 |
| 2 | Chair | Furniture | $199.99 |
| 3 | Book | Education | $29.99 |
| 4 | Phone | Electronics | $599.99 |

## Available Categories

- Electronics
- Furniture
- Education

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid JWT token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are hashed using bcrypt
- **Token Expiration**: JWT tokens expire after 1 hour
- **User Validation**: Tokens are validated against existing users
- **Protected Routes**: Most endpoints require valid JWT tokens

## Notes

- All authenticated routes require the `Authorization: Bearer <token>` header
- The JWT token expires in 1 hour (as configured in the auth controller)
- If a user is deleted, their JWT token becomes invalid immediately
- Product prices must be positive numbers
- User roles default to "user" if not specified during registration
- The API returns JSON responses for all endpoints
- Database data persists between server restarts (unlike the original in-memory version)