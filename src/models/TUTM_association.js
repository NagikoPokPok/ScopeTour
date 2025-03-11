const Team = require('./Team');
const User = require('./User');
const TeamMember = require('./TeamMember');

// Clear any existing associations
Team.associations = {};
User.associations = {};
TeamMember.associations = {};

// Team associations
Team.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Team.hasMany(TeamMember, { foreignKey: 'team_id' });

// User associations 
User.hasMany(Team, { foreignKey: 'created_by', as: 'createdTeams' });
User.hasMany(TeamMember, { foreignKey: 'user_id' });

// TeamMember associations
TeamMember.belongsTo(Team, { foreignKey: 'team_id' });
TeamMember.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    Team,
    User, 
    TeamMember
};