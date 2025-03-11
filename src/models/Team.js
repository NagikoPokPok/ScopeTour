const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define('Team', {
  team_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  group_img: {
    type: DataTypes.STRING(500)
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: 'user',
      key: 'user_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'team',
  timestamps: false
});

module.exports = Team;