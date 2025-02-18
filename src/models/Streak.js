const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Streak = sequelize.define('Streak', {
  streak_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  current_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Ví dụ cột row hay longest_streak
  longest_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_completed_date: DataTypes.DATE
}, {
  tableName: 'streaks',
  timestamps: false
});

module.exports = Streak;
