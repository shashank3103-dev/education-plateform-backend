const crypto = require("crypto");
const { Course, Payment, Enrollment } = require("../models");
const razorpay = require("../utils/razorpay");

exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { userId } = req.user;

    const course = await Course.findByPk(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const options = {
      amount: course.price * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save a pending payment entry
    await Payment.create({
      userId,
      courseId,
      razorpay_order_id: order.id,
      amount: course.price,
      status: "pending",
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: course.price * 100,
      currency: "INR",
    });
  } catch (err) {
    console.error("Error in createOrder:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;
    const userId = req.user.userId;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Update payment
    await Payment.update(
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      },
      { where: { razorpay_order_id } }
    );

    // Enroll the user
    await Enrollment.create({
      userId,
      courseId,
    });

    res.json({ success: true, message: "Payment verified and enrolled" });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
