import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, address, restaurant } = req.body;

    if (!restaurant) {
      return res.status(400).json({ message: "Restaurant is required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!paymentMethod || !address) {
      return res.status(400).json({
        message: "Payment method and address are required",
      });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.product,
        restaurant,
        available: true,
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found or does not belong to this restaurant",
        });
      }

      const quantity = item.quantity || 1;

      orderItems.push({
        product: product._id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        image: product.image,
        price: product.price,
        quantity,
      });

      totalPrice += product.price * quantity;
    }

    const order = await Order.create({
      restaurant,
      user: req.user._id,
      items: orderItems,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "paid" : "pending",
      address,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "nameEn nameAr")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (!req.user.restaurant) {
      return res.status(400).json({ message: "Admin has no restaurant assigned" });
    }

    const orders = await Order.find({
      restaurant: req.user.restaurant,
    })
      .populate("user", "username email")
      .populate("restaurant", "nameEn nameAr")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = [
      "pending",
      "preparing",
      "out for delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found for this restaurant" });
    }

    const finalStatuses = ["delivered", "cancelled"];

    if (finalStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        message: "This order is already finalized and cannot be updated",
      });
    }

    order.orderStatus = orderStatus;

    if (order.paymentMethod === "cash" && order.orderStatus === "delivered") {
      order.paymentStatus = "paid";
    }

    const updatedOrder = await order.save();

    await updatedOrder.populate([
      { path: "user", select: "username email" },
      { path: "restaurant", select: "nameEn nameAr" },
    ]);

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const updatePaymentStatus = async (req, res) => {
//   try {
//     const { paymentStatus } = req.body;

//     const order = await Order.findOne({
//       _id: req.params.id,
//       restaurant: req.user.restaurant,
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found for this restaurant" });
//     }

//     order.paymentStatus = paymentStatus ;

//     const updatedOrder = await order.save();

//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };