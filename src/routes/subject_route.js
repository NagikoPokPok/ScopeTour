const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject_controller');

// router.post('/upload', upload.single('image'), subjectController.uploadImage);
router.post('/', subjectController.createSubject);
router.get('/', subjectController.fetchSubjects);
router.delete('/:subjectId', subjectController.deleteSubject);
router.put('/:subjectId', subjectController.updateSubject);
router.get('/:subjectId', subjectController.getSubjectById);

module.exports = router;
