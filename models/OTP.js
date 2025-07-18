// models/Otp.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Otp = sequelize.define('Otp', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  otp_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'otps', // explicit table name
  timestamps: false // disable createdAt/updatedAt
});

// Instance methods
Otp.findOtp = async (email, otp) => {
  return await Otp.findOne({ 
    where: { 
      email, 
      otp_code: otp 
    } 
  });
};

Otp.deleteOtp = async (email) => {
  return await Otp.destroy({ 
    where: { email } 
  });
};

Otp.createOtp = async (email, otp, expiresAt) => {
  return await Otp.create({ 
    email, 
    otp_code: otp, 
    expires_at: expiresAt 
  });
};

Otp.deleteOldOtps = Otp.deleteOtp; // Same functionality

module.exports = Otp;