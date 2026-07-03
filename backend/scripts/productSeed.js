import mongoose from "mongoose";
import Product from "../models/productSchema.js";
import { category } from "../models/categorySchema.js";
import { productsData } from "../data/productData.js";
import "../config/database.js";

const seedProducts = async () => {
  try {
    console.log("Fetching categories...");
    const categories = await category.find({});
    
    if (categories.length === 0) {
      console.error("No categories found. Please seed categories first.");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`Found ${categories.length} categories`);
    console.log("Clearing existing products...");
    // Clear existing products to avoid duplicates
    await Product.deleteMany({});
    
    console.log("Seeding products...");

    // Map products with random categories
    const productsWithCategories = productsData.map((product) => {
      // Assign 1-3 random categories to each product
      const numCategories = Math.floor(Math.random() * 3) + 1;
      const selectedCategories = [];
      
      for (let i = 0; i < numCategories; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        if (!selectedCategories.includes(randomCategory._id)) {
          selectedCategories.push(randomCategory._id);
        }
      }

      return {
        ...product,
        categories: selectedCategories,
      };
    });

    await Product.insertMany(productsWithCategories);
    console.log(`✓ ${productsWithCategories.length} products seeded successfully`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedProducts();
