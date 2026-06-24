import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const { restaurant, includeUnavailable } = req.query;

    const filter = {};

    if (restaurant) {
      filter.restaurant = restaurant;
    }

    if (includeUnavailable !== "true") {
      filter.available = true;
    }

    const products = await Product.find(filter)
      .populate("restaurant", "nameEn nameAr")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    if (!req.user.restaurant) {
      return res.status(400).json({ message: "Admin has no restaurant assigned" });
    }

    const products = await Product.find({
      restaurant: req.user.restaurant,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    if (!req.user.restaurant) {
      return res.status(400).json({ message: "Admin has no restaurant assigned" });
    }

    const {
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      category,
      price,
      image,
      available,
    } = req.body;

    const product = await Product.create({
      restaurant: req.user.restaurant,
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      category,
      price,
      image,
      available,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found for this restaurant" });
    }

    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found for this restaurant" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};