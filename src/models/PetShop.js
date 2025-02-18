const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const PetShop = sequelize.define('PetShop', {
  pet_shop_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pet_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price: DataTypes.INTEGER,
  pet_img: DataTypes.STRING(500),
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pet_shop',
  timestamps: false
});

module.exports = PetShop;
