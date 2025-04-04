exports.validateUserRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('Valid email is required');
    }

    if (!password || password.length < 7) {
        errors.push('Password must be at least 7 characters long');
    }

    if (password && password.toLowerCase().includes('password')) {
        errors.push('Password cannot include the word "password"');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !isValidEmail(email)) {
        errors.push('Valid email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    next();
};

exports.validateUserUpdate = (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }

    if (req.body.email && !isValidEmail(req.body.email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }

    if (req.body.password) {
        if (req.body.password.length < 7) {
            return res.status(400).json({ error: 'Password must be at least 7 characters long' });
        }

        if (req.body.password.toLowerCase().includes('password')) {
            return res.status(400).json({ error: 'Password cannot include the word "password"' });
        }
    }

    next();
};

exports.validateTaskCreation = (req, res, next) => {
    const { title, priority, status, dueDate } = req.body;
    const errors = [];

    if (!title || title.trim() === '') {
        errors.push('Title is required');
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        errors.push('Priority must be low, medium, or high');
    }

    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
        errors.push('Status must be pending, in-progress, or completed');
    }

    if (dueDate && !isValidDate(dueDate)) {
        errors.push('Due date must be a valid date');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    next();
};

exports.validateTaskUpdate = (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'priority', 'status', 'dueDate'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }

    if (req.body.title !== undefined && req.body.title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (req.body.priority && !['low', 'medium', 'high'].includes(req.body.priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
    }

    if (req.body.status && !['pending', 'in-progress', 'completed'].includes(req.body.status)) {
        return res.status(400).json({ error: 'Status must be pending, in-progress, or completed' });
    }

    if (req.body.dueDate && !isValidDate(req.body.dueDate)) {
        return res.status(400).json({ error: 'Due date must be a valid date' });
    }

    next();
};

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}