const { User, Course, Order, OrderItem } = require("../models");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find or create cart for user
    let [order] = await Order.findOrCreate({
      where: {
        userId: req.user.userId,
        status: "cart",
      },
      defaults: {
        totalAmount: 0,
      },
    });

    // Check if course already in cart
    const existingItem = await OrderItem.findOne({
      where: {
        orderId: order.orderId,
        courseId: course.courseId,
      },
    });

    if (existingItem) {
      return res.status(400).json({ error: "Course already in cart" });
    }

    // Add item to cart with quantity 1
    await OrderItem.create({
      orderId: order.orderId,
      courseId: course.courseId,
      quantity: 1,
      priceAtPurchase: parseFloat(course.price),
    });

    // Update order total
    await updateOrderTotal(order.orderId);

    res.status(200).json({
      message: "Item added to cart",
      cart: await getCartDetails(req.user.userId),
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: error.message });
  }
};

// Checkout process
const checkout = async (req, res) => {
  try {
    if(!req.user.is_verified ) {
      return res.status(403).json({ error: "Only verified user can buy the course." });
    }
    const { paymentMethod, shippingAddress } = req.body;

    // Get user's cart
    const order = await Order.findOne({
      where: {
        userId: req.user.userId,
        status: "cart",
      },
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          include: [{ model: Course }],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: "No cart found for user." });
    }

    if (!order.OrderItems || order.OrderItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required." });
    }

    // Update order status and details
    await order.update({
      status: "ordered",
      paymentMethod,
      shippingAddress,
    });

    // Fetch updated order details using correct PK
    const updatedOrder = await getOrderDetails(order.orderId);

    res.status(200).json({
      message: "Order placed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
const updateOrderTotal = async (orderId) => {
  const orderItems = await OrderItem.findAll({
    where: { orderId },
    include: [
      {
        model: Course,
      },
    ],
  });

  const total = orderItems.reduce((sum, item) => {
    return sum + item.priceAtPurchase * item.quantity;
  }, 0);

  await Order.update({ totalAmount: total }, { where: { orderId } });
};

const getCartDetails = async (userId) => {
  return await Order.findOne({
    where: { userId, status: "cart" },
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        include: [
          {
            model: Course,
          },
        ],
      },
    ],
  });
};

const getOrderDetails = async (orderId) => {
  return await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: "OrderItems",
        include: [
          {
            model: Course,
          },
        ],
      },
    ],
  });
};

// This is the function you use in your route
const getCartDetailsHandler = async (req, res) => {
  try {
    const cart = await getCartDetails(req.user.userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  checkout,
  getCartDetails: getCartDetailsHandler,
};
