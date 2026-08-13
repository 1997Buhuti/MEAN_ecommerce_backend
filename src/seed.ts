import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "./config/database";
import { User } from "./models/user";
import { Category } from "./models/category";
import { Product } from "./models/product";
import { OrderItem } from "./models/order-item";
import { Order } from "./models/order";

const seedCategories = async () => {
  const categories = [
    { name: "Electronics", icon: "📱", color: "#3b82f6" },
    { name: "Clothing", icon: "👕", color: "#ef4444" },
    { name: "Home & Kitchen", icon: "🏠", color: "#10b981" },
    { name: "Books", icon: "📚", color: "#f59e0b" },
    { name: "Sports", icon: "⚽", color: "#8b5cf6" },
  ];

  await Category.deleteMany({});
  const created = await Category.insertMany(categories);
  console.log(`Seeded ${created.length} categories`);
  return created;
};

const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      phone: "+1234567890",
      isAdmin: true,
      street: "123 Admin St",
      city: "Admintown",
      zip: "00000",
      country: "USA",
    },
    {
      name: "John Doe",
      email: "john@example.com",
      passwordHash: hashedPassword,
      phone: "+1987654321",
      street: "456 Main St",
      city: "New York",
      zip: "10001",
      country: "USA",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      passwordHash: hashedPassword,
      phone: "+1555123456",
      street: "789 Oak Ave",
      city: "Los Angeles",
      zip: "90001",
      country: "USA",
    },
  ];

  await User.deleteMany({});
  const created = await User.insertMany(users);
  console.log(`Seeded ${created.length} users`);
  return created;
};

const seedProducts = async (categories: any[]) => {
  const products = [
    {
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      richDescription: "Experience crystal clear sound with active noise cancellation",
      image: ["https://example.com/headphones.jpg"],
      brand: "AudioTech",
      price: 99.99,
      category: categories[0]._id,
      countInStock: 50,
      rating: 4.5,
      numReviews: 12,
      isFeatured: true,
    },
    {
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health tracking",
      richDescription: "Track your fitness and stay connected",
      image: ["https://example.com/watch.jpg"],
      brand: "TechWear",
      price: 199.99,
      category: categories[0]._id,
      countInStock: 30,
      rating: 4.2,
      numReviews: 8,
      isFeatured: true,
    },
    {
      name: "Cotton T-Shirt",
      description: "Comfortable 100% cotton t-shirt",
      richDescription: "Breathable fabric for everyday wear",
      image: ["https://example.com/tshirt.jpg"],
      brand: "BasicWear",
      price: 19.99,
      category: categories[1]._id,
      countInStock: 200,
      rating: 4.0,
      numReviews: 25,
      isFeatured: false,
    },
    {
      name: "Coffee Maker",
      description: "12-cup programmable coffee maker",
      richDescription: "Wake up to fresh coffee every morning",
      image: ["https://example.com/coffeemaker.jpg"],
      brand: "BrewMaster",
      price: 49.99,
      category: categories[2]._id,
      countInStock: 15,
      rating: 4.7,
      numReviews: 30,
      isFeatured: true,
    },
    {
      name: "JavaScript Guide",
      description: "Comprehensive guide to modern JavaScript",
      richDescription: "From basics to advanced concepts",
      image: ["https://example.com/jsbook.jpg"],
      brand: "TechBooks",
      price: 29.99,
      category: categories[3]._id,
      countInStock: 100,
      rating: 4.8,
      numReviews: 45,
      isFeatured: true,
    },
    {
      name: "Yoga Mat",
      description: "Non-slip yoga mat for comfortable workouts",
      richDescription: "Extra thick and durable material",
      image: ["https://example.com/yogamat.jpg"],
      brand: "FitLife",
      price: 24.99,
      category: categories[4]._id,
      countInStock: 75,
      rating: 4.3,
      numReviews: 15,
      isFeatured: false,
    },
    {
      name: "Laptop Stand",
      description: "Adjustable aluminum laptop stand",
      richDescription: "Ergonomic design for better posture",
      image: ["https://example.com/stand.jpg"],
      brand: "DeskPro",
      price: 39.99,
      category: categories[2]._id,
      countInStock: 40,
      rating: 4.1,
      numReviews: 10,
      isFeatured: false,
    },
    {
      name: "Running Shoes",
      description: "Lightweight running shoes with cushion support",
      richDescription: "Designed for long-distance running",
      image: ["https://example.com/shoes.jpg"],
      brand: "SpeedRun",
      price: 89.99,
      category: categories[4]._id,
      countInStock: 25,
      rating: 4.6,
      numReviews: 20,
      isFeatured: true,
    },
  ];

  await Product.deleteMany({});
  const created = await Product.insertMany(products);
  console.log(`Seeded ${created.length} products`);
  return created;
};

const seedOrderItems = async (products: any[]) => {
  const orderItems = [
    {
      quantity: 2,
      product: products[0]._id,
    },
    {
      quantity: 1,
      product: products[2]._id,
    },
    {
      quantity: 1,
      product: products[3]._id,
    },
    {
      quantity: 3,
      product: products[4]._id,
    },
  ];

  await OrderItem.deleteMany({});
  const created = await OrderItem.insertMany(orderItems);
  console.log(`Seeded ${created.length} order items`);
  return created;
};

const seedOrders = async (users: any[], orderItems: any[]) => {
  const orders = [
    {
      orderItems: [orderItems[0]._id, orderItems[1]._id],
      shippingAddress1: "456 Main St",
      city: "New York",
      zip: "10001",
      country: "USA",
      phone: "+1987654321",
      status: "Shipped",
      totalPrice: 119.97,
      user: users[1]._id,
    },
    {
      orderItems: [orderItems[2]._id, orderItems[3]._id],
      shippingAddress1: "789 Oak Ave",
      city: "Los Angeles",
      zip: "90001",
      country: "USA",
      phone: "+1555123456",
      status: "Pending",
      totalPrice: 79.97,
      user: users[2]._id,
    },
  ];

  await Order.deleteMany({});
  const created = await Order.insertMany(orders);
  console.log(`Seeded ${created.length} orders`);
  return created;
};

const seedData = async () => {
  await connectDB();

  try {
    const categories = await seedCategories();
    const users = await seedUsers();
    const products = await seedProducts(categories);
    const orderItems = await seedOrderItems(products);
    await seedOrders(users, orderItems);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

seedData();
