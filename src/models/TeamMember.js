// models/TeamMember.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

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
  tableName: 'team_members',
  timestamps: false
});

module.exports = TeamMember;
