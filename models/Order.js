const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "cart",
        "ordered",
        "processing",
        "delivered",
        "cancelled",
        "returned"
      ),
      defaultValue: "cart",
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    paymentMethod: DataTypes.STRING,
    shippingAddress: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "New_User", key: "userId" },
    },
  },
  { timestamps: true }
);

const OrderItem = sequelize.define("OrderItem", {
  orderItemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  priceAtPurchase: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Orders", key: "orderId" },
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Courses", key: "courseId" },
  },
});

module.exports = { Order, OrderItem };
