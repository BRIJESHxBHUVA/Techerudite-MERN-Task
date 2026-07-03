import Category from "../models/categorySchema.js";   

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load categories right now. Please try again later.",
    });
  }
};