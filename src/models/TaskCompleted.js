const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskCompleted = sequelize.define('TaskCompleted', {
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
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    completed_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    team_id: {
        type: DataTypes.INTEGER
    },
    subject_id: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'task_completed',
    timestamps: false
});

TaskCompleted.associate = function(models) {
    TaskCompleted.belongsTo(models.Task, { foreignKey: 'task_id' });
    TaskCompleted.belongsTo(models.User, { foreignKey: 'user_id' });
    TaskCompleted.belongsTo(models.Team, { foreignKey: 'team_id' });
    TaskCompleted.belongsTo(models.Subject, { foreignKey: 'subject_id' });
};

module.exports = TaskCompleted;