const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op, fn, col } = require("sequelize");
const {
  User,
  Course,
  Order,
  Admin,
  OTP,
  OrderItem,
  RevokedToken,
} = require("../models");
const { generateAndSendOtp } = require("../utils/otpUtils");
const Banner = require("../models/Banner");

const signup = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!["admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  try {
    const is_admin_exist = await Admin.findOne({ where: { email } });
    if (is_admin_exist) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      admin: role === "admin",
      is_verified: false,
      // is_blocked: false,
    });
    await generateAndSendOtp(email);
    return res.status(201).json({
      message: "Admin registered. OTP sent to email.",
      adminId: newAdmin.id,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Registration failed",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    }
    await generateAndSendOtp(email, "resend");
    return res.status(200).json({ message: "New OTP sent to your email" });
  } catch (err) {
    console.error("Error in resendOtp:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

// Verify Email OTP
const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const now = new Date();
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    }
    const otpData = await OTP.findOne({
      where: { email, otp_code: otp },
    });
    if (!otpData) {
      return res.status(400).json({ error: "Invalid OTP or email" });
    }
    if (otpData.expires_at < now) {
      return res.status(400).json({ error: "OTP has expired" });
    }
    if (admin.is_verified) {
      if (!password) {
        return res.status(400).json({
          error: "admin already verified . Give password for update password.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await admin.update({ password: hashedPassword });
      return res.status(200).json({ message: "Password updated successfully" });
    }
    await Admin.update({ is_verified: true }, { where: { email } });
    await OTP.destroy({ where: { email } });
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

// Admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (!admin.is_verified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email first.",
      });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (admin.is_blocked) {
      return res.status(403).json({ error: "admin is blocked" });
    }
    const payload = {
      adminId: admin.adminId,
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      admin: admin.admin,
      is_verified: admin.is_verified,
      is_blocked: admin.is_blocked,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const adminData = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      admin: admin.admin,
      is_blocked: admin.is_blocked,
      is_verified: admin.is_verified,
    };
    return res.status(200).json({
      message: "Login successful",
      token,
      admin: adminData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
};

// Admin logout
const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const expiresAt = new Date(decoded.exp * 10000);
    await RevokedToken.create({ token, expires_at: expiresAt });
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
};

// Get all students (minimal)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { student: true },
      attributes: [
        "userId",
        "name",
        "email",
        "phone",
        "is_verified",
        "student",
        "is_blocked",
      ],
    });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tutors (minimal)
const getAllTutors = async (req, res) => {
  try {
    const tutors = await User.findAll({
      where: { tutor: true },
      attributes: ["userId", "name", "email", "phone", "is_verified", "tutor"],
    });
    res.status(200).json({ tutors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses (minimal)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: [
        "courseId",
        "title",
        "category",
        "price",
        "is_published",
        "addedBy",
        "description",
        "target",
        "requirements",
        "duration",
        "learning_minutes",
        "lectures",
      ],
      include: [
        {
          model: User,
          as: "Tutor",
          attributes: ["userId", "name", "email"],
        },
      ],
    });
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.error("getAllCourses error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all orders (minimal)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        "orderId",
        "userId",
        "status",
        "paymentMethod",
        "createdAt",
        "totalAmount",
      ],
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          attributes: ["orderItemId", "courseId", "priceAtPurchase"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by userId
const getOrdersbyUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      attributes: ["orderId", "status", "userId", "paymentMethod", "createdAt"],
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          attributes: [
            "orderItemId",
            "courseId",
            "quantity",
            "priceAtPurchase",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get courses by tutorId (addedBy)
const getCoursesbyUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const courses = await Course.findAll({
      where: { addedBy: userId },
      attributes: [
        "addedBy",
        "courseId",
        "title",
        "category",
        "price",
        "is_published",
        "description",
        "target",
        "requirements",
        "duration",
        "learning_minutes",
        "lectures",
      ],
    });
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.error("getCoursesbyUserId error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete course by courseId
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    await OrderItem.destroy({ where: { courseId } });
    await Course.destroy({ where: { courseId } });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by userId (except password)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    let extra = {};
    if (user.student) {
      const orders = await Order.findAll({
        where: { userId },
        attributes: ["orderId"],
        include: [
          { model: OrderItem, as: "OrderItems", attributes: ["courseId"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      const courseIds = [];
      orders.forEach((order) =>
        order.OrderItems.forEach((i) => courseIds.push(i.courseId))
      );
      extra = {
        student: true,
        courseIds: [...new Set(courseIds)],
        orderIds: orders.map((o) => o.orderId),
      };
    } else if (user.tutor) {
      const courses = await Course.findAll({
        where: { addedBy: userId },
        attributes: ["courseId"],
      });
      extra = {
        tutor: true,
        courseIds: courses.map((c) => c.courseId),
      };
    } else {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user, ...extra });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user by userId (toggle is_blocked or update fields)
const blockById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ where: { userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.is_blocked = !user.is_blocked;
    await user.save();
    return res.status(200).json({ message: "is_blocked toggled", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by orderId
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { orderId },
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          include: [{ model: Course }],
        },
        {
          model: User,
          attributes: ["userId", "name", "email"],
        },
      ],
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order by orderId (change status)
const updateOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findOne({ where: { orderId } });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status) order.status = status;
    await order.save();
    res.status(200).json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all statistics (minimal)
const getAllStats = async (req, res) => {
  try {
    const totalStudents = await User.count({ where: { student: true } });
    const totalTutors = await User.count({ where: { tutor: true } });
    const totalOrders = await Order.count();
    const totalCourses = await Course.count({ where: { is_published: true } });
    const totalBanners = await Banner.count();

    const orderItems = await OrderItem.findAll({
      attributes: ["courseId", [fn("COUNT", col("courseId")), "orderCount"]],
      group: ["courseId"],
      raw: true,
    });

    res.status(200).json({
      stats: {
        totalStudents,
        totalTutors,
        totalOrders,
        totalCourses,
        totalBanners,
      },
      courseOrderSummary: orderItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  resendOtp,
  verifyEmailOtp,
  login,
  logout,
  getAllStudents,
  getAllTutors,
  getAllCourses,
  getCoursesbyUserId,
  getAllOrders,
  getOrdersbyUserId,
  getUserById,
  blockById,
  getOrderById,
  updateOrderById,
  getAllStats,
  deleteCourse,
};
