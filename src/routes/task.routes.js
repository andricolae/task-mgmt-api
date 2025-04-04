const express = require('express');
const taskController = require('../controllers/task.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', taskController.createTask);

router.get('/', taskController.getAllTasks);

router.get('/:id', taskController.getTaskById);

router.patch('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;