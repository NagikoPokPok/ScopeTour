const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const TasksCompleted = sequelize.define('TasksCompleted', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completed_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tasks_completed',
  timestamps: false
});

module.exports = TasksCompleted;
