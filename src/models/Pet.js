// models/Pets.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Pet = sequelize.define('Pet', {
  pet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // pet_type_id hoặc pet_shop_id, tuỳ DB. Ví dụ:
  pet_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pet_name: DataTypes.STRING(100),
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  acquired_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  pet_img: DataTypes.STRING(500)
}, {
  tableName: 'pets',
  timestamps: false
});

module.exports = Pet;
