import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        unique: true,
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: [true, "Product categories are required"],
    }]
}, { timestamps: true });

const Product = mongoose.model("product", productSchema);
export default Product;