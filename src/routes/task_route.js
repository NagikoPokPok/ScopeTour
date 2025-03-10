// task_route.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task_controller');

// Create a new task
router.post('/', taskController.createTask);

// Get completed tasks
router.get('/completed', taskController.getCompletedTasks);

// Delete completed task
router.delete('/completed/:id', taskController.deleteCompletedTask);

// Complete a task
router.post('/complete/:id', taskController.completeTask);

// Fetch tasks with optional filtering
router.get('/', taskController.getTasks);

// Get a single task by id
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);


module.exports = router;
