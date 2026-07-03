import mongoose from "mongoose";
import Category from "../models/categorySchema.js";
import { categoriesData } from "../data/categoryData.js";
import "../config/database.js";

const seedCategories = async () => {
  try {
    console.log("Seeding categories...");
    await Category.insertMany(categoriesData);
    console.log("Categories seeded successfully");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedCategories();
