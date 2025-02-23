const Team = require('../models/Team');
const User = require('../models/User');
const TeamMember = require('../models/TeamMember');

const currentUserId = 1;

exports.createTeam = async (req, res) => {
  try {
    const { teamName } = req.body;

    const newTeam = await Team.create({
      name: teamName,
      //ccreated_by: currentUserId
    });

    // await TeamMember.create({
    //   team_id: newTeam.team_id,
    //   user_id: currentUserId,
    //   role: 'owner'
    // });

    return res.status(201).json({
      message: 'Team created successfully!',
      data: newTeam
    });
  } catch (error) {
    console.error('Error creating team:', error);
    return res.status(500).json({
      message: 'Error creating team'
    });
  }
};

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  return res.status(200).json({
    message: 'Image uploaded successfully',
    fileInfo: req.file
  });
};

module.exports = exports; // Đảm bảo export rõ ràng