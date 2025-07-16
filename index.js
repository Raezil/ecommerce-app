// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const productController = require('./controllers/products');
const { sequelize } = require('./config/db');
const {Product} = require('./models/product');
const authenticateJWT = require('./middleware/auth');

const {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser
} = require('./controllers/users');
const { login } = require('./controllers/auth');

async function initializeApp() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Sync the database (create tables)
    await sequelize.sync();
    console.log('Database synchronized successfully.');
    
    // Add some sample data
    await Product.bulkCreate([
      { Name: 'Laptop', Category: 'Electronics', Price: 999.99 },
      { Name: 'Chair', Category: 'Furniture', Price: 199.99 },
      { Name: 'Book', Category: 'Education', Price: 29.99 },
      { Name: 'Phone', Category: 'Electronics', Price: 599.99 },
    ]);
    
    console.log('Sample data added successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

app.use(express.json());

// 1. GET /products — list all
app.get('/products', authenticateJWT,productController.getProducts);

// 2. GET /products/:id — get one by ID
app.get('/products/:id', authenticateJWT, productController.getProductById);

// 4. POST /products — add new
app.post('/products', authenticateJWT, productController.addProduct);

// User registration (no auth needed)
app.post('/register', registerUser);

// Login issues JWT
app.post('/login', login);
// Protect all /users routes
app.use('/users', authenticateJWT);

app.get('/users', getUsers);
app.get('/users/:id', getUserById);
app.patch('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error initializing app:', err);
  process.exit(1);
});