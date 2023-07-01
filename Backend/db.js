// db.js

const { Sequelize, DataTypes } = require('sequelize');

// Create the database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Specify the path to your SQLite database file
});

// Define the models
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Order = sequelize.define('Order', {
  // Define the necessary fields for an order
});

// Establish the relationships
Product.belongsTo(Category);
Category.hasMany(Product);
Order.belongsToMany(Product, { through: 'OrderItem' });
Product.belongsToMany(Order, { through: 'OrderItem' });

// Sync the models with the database (create the tables if they don't exist)
sequelize.sync();

// Export the models and sequelize instance
module.exports = {
  sequelize,
  Product,
  Category,
  Order,
};
