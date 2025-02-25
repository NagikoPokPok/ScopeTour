const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team_controller');
// const multer = require('multer');

// Debug to verify controller is loaded
console.log('teamController:', teamController);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post('/upload', upload.single('image'), teamController.uploadImage);
router.post('/', teamController.createTeam);

// Change GET route path to '/' so that it maps to '/api/team'
router.get('/', teamController.fetchTeams);

module.exports = router;
