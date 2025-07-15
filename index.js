// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false // Disable SQL logging for cleaner output
});

const Product = sequelize.define(
  'Product',
  {
    // Model attributes are defined here
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false // Disable createdAt and updatedAt
  }
);

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
app.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      // 3. Filter by category
      const filtered = await Product.findAll({ where: { Category: category } });
      if (filtered.length === 0) {
        return res.status(404).json({ error: 'No products found in this category' });
      }
      return res.json(filtered);
    }
    // FIXED: Added missing await
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error in GET /products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. GET /products/:id — get one by ID
app.get('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const product = await Product.findOne({ where: { Id: id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in GET /products/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. POST /products — add new
app.post('/products', async (req, res) => {
  try {
    // FIXED: Changed to match your model fields (Name, Category, Price)
    const { name, category, price } = req.body;
    
    // Validation
    if (!name || !category || typeof price !== 'number') {
      return res.status(400).json({ error: 'name, category (strings) and price (number) are required' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    
    // FIXED: Map lowercase input to capitalized model fields
    const newProduct = await Product.create({
      Name: name,
      Category: category,
      Price: price
    });
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in POST /products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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