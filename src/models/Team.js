const { DataTypes } = require('sequelize');
const sequelize = require('./index');

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
  professional: DataTypes.STRING(255),
  group_img: DataTypes.STRING(500),
  created_by: DataTypes.INTEGER,  // FK -> user.user_id
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'team',
  timestamps: false
});

module.exports = Team;
