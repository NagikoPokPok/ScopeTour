const { Op } = require('sequelize');
const db = require('../config/database');  // Changed to use 'db' to avoid naming conflicts
const { Team, TeamMember, User } = require('../models/TUTM_association');

exports.createTeam = async (req, res) => {
    try {
        const { teamName, userId } = req.body;
        if (!teamName || !userId) {
            return res.status(400).json({ message: 'Team name and user ID are required' });
        }

        // Start a transaction using the imported db instance
        const result = await db.transaction(async (t) => {
            // Create the team
            const newTeam = await Team.create({ 
                name: teamName,
                created_by: userId,
                created_at: new Date()
            }, { transaction: t });

            // Create team member entry for the creator
            await TeamMember.create({
                team_id: newTeam.team_id,
                user_id: userId,
                role: 'owner',
                joined_at: new Date()
            }, { transaction: t });

            return newTeam;
        });

        return res.status(201).json({
            message: 'Team created successfully!',
            teamId: result.team_id,
            data: result
        });
    } catch (error) {
        console.error('Error creating team:', error);
        return res.status(500).json({ message: 'Error creating team: ' + error.message });
    }
};

exports.fetchTeams = async (req, res) => {
    try {
        const { userId } = req.query;
        const searchQuery = req.query.search || '';

        console.log('🔍 Received request with userId:', userId); // Debug log

        if (!userId) {
            console.error('Missing userId in request');
            return res.status(400).json({ message: 'User ID is required' });
        }

        let whereClause = {};
        if (searchQuery.trim()) {
            whereClause.name = { [Op.like]: `%${searchQuery.trim()}%` };
        }

        const teams = await Team.findAll({
            include: [{
                model: TeamMember,
                where: { user_id: userId },
                required: true
            }, {
                model: User,
                as: 'creator',
                attributes: ['user_id', 'user_name', 'email']
            }],
            where: whereClause,
            attributes: ['team_id', 'name', 'created_at', 'group_img']
        });

        console.log(`📋 Found ${teams.length} teams for userId:`, userId); // Debug log

        return res.status(200).json({ 
            success: true,
            teams 
        });
    } catch (error) {
        console.error('❌ Error in fetchTeams:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error fetching teams' 
        });
    }
};

// Delete team function
exports.deleteTeam = async (req, res) => {
    try {
      const { teamId } = req.params;
  
      // Kiểm tra xem team có tồn tại không
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      // Xoá team (nếu có ràng buộc quan hệ, có thể cần xoá các thành viên trước)
      await Team.destroy({ where: { team_id: teamId } });
  
      return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      console.error("Error deleting team:", error);
      return res.status(500).json({ message: "Error deleting team" });
    }
};

// Update team function
exports.updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { teamName } = req.body;

        if (!teamId || !teamName) {
            return res.status(400).json({ message: 'Team ID and name are required' });
        }

        // Find team
        const team = await Team.findByPk(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Update team
        await Team.update({ name: teamName }, { where: { team_id: teamId } });

        return res.status(200).json({ message: 'Team updated successfully' });
    } catch (error) {
        console.error('Error updating team:', error);
        return res.status(500).json({ message: 'Error updating team' });
    }
};

// Add this new function to get a single team
exports.getTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        
        // Find team by ID
        const team = await Team.findOne({
            where: { team_id: teamId },
            attributes: ['team_id', 'name', 'created_by', 'created_at']
        });

        if (!team) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team not found' 
            });
        }

        return res.status(200).json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error fetching team details'
        });
    }
};
module.exports = exports;

// Delete team function
exports.deleteTeam = async (req, res) => {
    try {
      const { teamId } = req.params;
  
      // Kiểm tra xem team có tồn tại không
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      // Xoá team (nếu có ràng buộc quan hệ, có thể cần xoá các thành viên trước)
      await Team.destroy({ where: { team_id: teamId } });
  
      return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      console.error("Error deleting team:", error);
      return res.status(500).json({ message: "Error deleting team" });
    }
};

// Update team function
exports.updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { teamName } = req.body;

        if (!teamId || !teamName) {
            return res.status(400).json({ message: 'Team ID and name are required' });
        }

        // Find team
        const team = await Team.findByPk(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Update team
        await Team.update({ name: teamName }, { where: { team_id: teamId } });

        return res.status(200).json({ message: 'Team updated successfully' });
    } catch (error) {
        console.error('Error updating team:', error);
        return res.status(500).json({ message: 'Error updating team' });
    }
};

// Add this new function to get a single team
exports.getTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        
        // Find team by ID
        const team = await Team.findOne({
            where: { team_id: teamId },
            attributes: ['team_id', 'name', 'created_by', 'created_at']
        });

        if (!team) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team not found' 
            });
        }

        return res.status(200).json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error fetching team details'
        });
    }
};
module.exports = exports;