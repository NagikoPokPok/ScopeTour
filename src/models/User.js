const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // import kết nối Sequelize

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: DataTypes.STRING(255),
  user_name: DataTypes.STRING(100),
  phone_number: DataTypes.STRING(20),
  user_img: DataTypes.STRING(500),
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User;
