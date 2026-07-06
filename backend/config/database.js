import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("Database connection error", err);
});
db.once("open", (err) => {
    console.log("Database connected successfully");
})

export default db;