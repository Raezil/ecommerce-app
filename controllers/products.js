
const { Product } = require('../models/product')
async function getProducts(req, res) {
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
}


async function getProductById(req, res){
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
}

async function addProduct(req, res) {
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
}
module.exports = {
    getProducts,
    getProductById,
    addProduct
};
