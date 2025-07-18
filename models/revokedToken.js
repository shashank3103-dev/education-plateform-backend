// models/RevokedToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const RevokedToken = sequelize.define('LatestRevokedToken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "New_User",
      key: 'id' // ✅ userId in code ↔ 'id' in DB
      
    }
  },
}, {
  tableName: 'latest_revoked_tokens',
  timestamps: false
});

module.exports = RevokedToken;
