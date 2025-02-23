const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subject_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Subject',
  timestamps: false
});

// Định nghĩa quan hệ
Subject.associate = function(models) {
  Subject.belongsTo(models.Team, { foreignKey: 'team_id' });
  Subject.hasMany(models.Task, { foreignKey: 'subject_id' });
};

module.exports = Subject;