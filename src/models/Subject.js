const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subject_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'Subject',
  timestamps: false, // Nếu không dùng createdAt/updatedAt mặc định
});

Subject.belongsTo(sequelize.models.Team, { foreignKey: 'team_id' });

module.exports = Subject;