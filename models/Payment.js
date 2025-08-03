const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

  const Payment = sequelize.define("Payment", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    razorpay_order_id: DataTypes.STRING,
    razorpay_payment_id: DataTypes.STRING,
    razorpay_signature: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  });

module.exports = Payment;
