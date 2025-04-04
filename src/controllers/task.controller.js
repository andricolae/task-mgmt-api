const Task = require('../models/task.model');

exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });

        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getAllTasks = async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.status) {
        match.status = req.query.status;
    }

    if (req.query.priority) {
        match.priority = req.query.priority;
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        const tasks = await Task.find({
            owner: req.user._id,
            ...match
        }).sort(sort);

        res.send(tasks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        res.send(task);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'dueDate', 'priority'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        res.send(task);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};