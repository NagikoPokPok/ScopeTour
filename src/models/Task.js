const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Task = sequelize.define('Task', {
  task_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: DataTypes.INTEGER,   // FK -> user.user_id (nếu là task cho user)
  team_id: DataTypes.INTEGER,   // FK -> team.team_id (nếu là task cho team)
  title: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  due_date: DataTypes.DATE,
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tasks',
  timestamps: false
});

module.exports = Tasks;
