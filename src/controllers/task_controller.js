// task_controller.js
const { Op } = require('sequelize');
const sequelize = require('../config/database');  // Add this line
const Task = require('../models/Task');
const TaskCompleted = require('../models/TaskCompleted');

// Create a new task
exports.createTask = async (req, res) => {
    try {
      const { 
        user_id, team_id, subject_id, title, description, 
        start_date, due_date, high_priority, reminder_time 
      } = req.body;
      
      console.log('Received data:', req.body); // Log incoming data for debugging
      
      if (!subject_id || !title) {
        return res.status(400).json({ 
          error: 'subject_id and title are required',
          received: { subject_id, title }
        });
      }
      
      const newTask = await Task.create({
        user_id,
        team_id,
        subject_id,
        title,
        description,
        start_date,
        due_date,
        high_priority,
        reminder_time,
        status: 'pending'
      });
      
      return res.status(201).json({
        message: 'Task created successfully!',
        data: newTask
      });
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: error.message });
    }
  };

// Fetch tasks by subject and team (with optional search)
exports.getTasks = async (req, res) => {
    try {
        const { subjectId, teamId, search } = req.query;
        
        // Only fetch active tasks here, not completed ones
        const activeTasks = await Task.findAll({ 
            where: {
                ...(subjectId && { subject_id: subjectId }),
                ...(teamId && { team_id: teamId }),
                ...(search && { title: { [Op.like]: `%${search.trim()}%` } })
            },
            order: [
                ['high_priority', 'DESC'],
                ['due_date', 'ASC'],
                ['created_at', 'DESC']
            ]
        });

        return res.status(200).json({ 
            tasks: activeTasks
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Get a single task by id
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, start_date, due_date, status,
      high_priority, reminder_time 
    } = req.body;
    
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (high_priority !== undefined) updateData.high_priority = high_priority;
    if (reminder_time !== undefined) updateData.reminder_time = reminder_time;
    
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completed_at = new Date();
      }
    }
    
    updateData.updated_at = new Date();
    
    await task.update(updateData);
    
    return res.status(200).json({
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Complete a task
exports.completeTask = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        
        if (!task) {
            await t.rollback();
            return res.status(404).json({ error: 'Task not found' });
        }

        // Create entry in TaskCompleted with reformatted data
        const completedTask = await TaskCompleted.create({
            task_id: task.task_id || task.id, // Handle both possible id field names
            user_id: task.user_id,
            title: task.title,
            description: task.description,
            completed_date: new Date(),
            team_id: task.team_id,
            subject_id: task.subject_id
        }, { transaction: t });

        // Delete from Task table
        await task.destroy({ transaction: t });

        await t.commit();

        console.log('Task completed successfully:', completedTask); // Add logging

        return res.status(200).json({
            message: "Task completed successfully",
            data: {
                taskId: id,
                completedDate: new Date()
            }
        });

    } catch (error) {
        await t.rollback();
        console.error("Error completing task:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Get completed tasks
exports.getCompletedTasks = async (req, res) => {
    try {
        const { subjectId, teamId, search } = req.query;
        
        const completedTasks = await TaskCompleted.findAll({
            where: {
                ...(subjectId && { subject_id: subjectId }),
                ...(teamId && { team_id: teamId }),
                ...(search && { 
                    title: { 
                        [Op.like]: `%${search.trim()}%` 
                    } 
                })
            },
            order: [['completed_date', 'DESC']]
        });

        return res.status(200).json({
            tasks: completedTasks
        });
    } catch (error) {
        console.error("Error fetching completed tasks:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Delete completed task
exports.deleteCompletedTask = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Attempting to delete completed task with ID:', id);

        const completedTask = await TaskCompleted.findOne({
            where: {
                [Op.or]: [
                    { id: id },
                    { task_id: id }
                ]
            }
        });
        
        if (!completedTask) {
            console.log('Completed task not found with ID:', id);
            return res.status(404).json({ error: 'Completed task not found' });
        }

        await completedTask.destroy();
        
        return res.status(200).json({
            message: 'Completed task deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting completed task:", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = exports;