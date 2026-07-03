import Product from "../models/productSchema.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, quantity, categories } = req.body;
    if (!name || !quantity || !categories) {
      return res.status(400).json({
        success: false,
        message: "Name, quantity, and categories are required.",
      });
    }

    const insertedProduct = await Product.create({
      name,
      description,
      quantity,
      categories,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: insertedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This product name is already taken. Please use a different name.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create product right now. Please try again later.",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, categories } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (categories) {
      const categoryIds = Array.isArray(categories)
        ? categories
        : categories
            .split(",")
      if (categoryIds.length) {
        query.categories = { $in: categoryIds };
      }
    }

    const products = await Product.find(query)
      .populate("categories")
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      products,
      totalProducts,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch products right now. Please try again later.",
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting product", error: error.message });
  }
}