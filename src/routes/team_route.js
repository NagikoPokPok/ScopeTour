const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team_controller'); // Kiểm tra đường dẫn
const multer = require('multer');

// Debug để kiểm tra
console.log('teamController:', teamController);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), teamController.uploadImage);
router.post('/', teamController.createTeam);

router.get('/api/team', async (req, res) => {
    try {
      const teams = await require('./models/Team').findAll();
      res.status(200).json({ teams });
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Error fetching teams' });
    }
  });

module.exports = router;