const express = require('express');
const { sequelize, Product, Category, Order } = require('./db');

const app = express();
app.use(express.json());

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Create the product and associate it with the category
    const product = await Product.create({ name, price });
    await product.setCategory(category);

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get products with a minimum price
app.get('/api/products', async (req, res) => {
  try {
    const { minPrice } = req.query;

    // Find products with minimum price
    const products = await Product.findAll({ 
      where: { price: { [Op.gte]: minPrice } },
      include: Category 
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch a specific product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId, { include: Category });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a product by ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, categoryId } = req.body;

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update the product and its category
    await product.update({ name, price });
    await product.setCategory(category);

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the product
    await product.destroy();

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;

    // Create the category
    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({ include: Product });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch a specific category by ID
app.get('/api/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, { include: Product });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a category by ID
app.put('/api/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update the category
    await category.update({ name });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a category by ID
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete the category
    await category.destroy();

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { products } = req.body;

    // Create the order and associate it with the products
    const order = await Order.create();
    await order.addProducts(products);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: Product });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch a specific order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId, { include: Product });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an order by ID
app.put('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { products } = req.body;

    // Check if the order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the order and its products
    await order.setProducts(products);

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an order by ID
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    // Check if the order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete the order
    await order.destroy();

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});