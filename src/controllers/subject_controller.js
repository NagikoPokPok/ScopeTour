const { Op } = require('sequelize');
const Subject = require('../models/Subject');

// Create a new subject (only requires a name)
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, description } = req.body;
    if (!subjectName) {
      return res.status(400).json({ message: 'Subject name is required' });
    }
    const newSubject = await Subject.create({ 
      name: subjectName,
      description: description || null 
    });
    return res.status(201).json({
      message: 'Subject created successfully!',
      data: newSubject
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    return res.status(500).json({ message: 'Error creating Subject' });
  }
};

// Fetch subjects (with optional search by name)
exports.fetchSubjects = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    let subjects;
    if (searchQuery.trim()) {
      subjects = await Subject.findAll({
        where: {
          name: { [Op.like]: `%${searchQuery.trim()}%` }
        }
      });
    } else {
      subjects = await Subject.findAll();
    }
    return res.status(200).json({ Subjects: subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({ message: 'Error fetching Subjects' });
  }
};

module.exports = exports;
