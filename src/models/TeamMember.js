const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeamMember = sequelize.define('TeamMember', {
  team_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'member'
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'team_member',
  timestamps: false
});

module.exports = TeamMember;