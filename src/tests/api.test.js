const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/user.model');
const Task = require('../src/models/task.model');

const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123'
};

let authToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    await User.deleteMany({});
    await Task.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User API', () => {
    test('Should register a new user', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send(testUser)
            .expect(201);

        expect(response.body.user).toHaveProperty('_id');
        expect(response.body.user.name).toBe(testUser.name);
        expect(response.body.user.email).toBe(testUser.email);

        expect(response.body.user).not.toHaveProperty('password');

        authToken = response.body.token;
    });

    test('Should login existing user', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: testUser.email,
                password: testUser.password
            })
            .expect(200);

        expect(response.body).toHaveProperty('token');
    });

    test('Should not login nonexistent user', async () => {
        await request(app)
            .post('/api/users/login')
            .send({
                email: 'wrong@example.com',
                password: 'wrongpassword'
            })
            .expect(400);
    });

    test('Should get user profile', async () => {
        const response = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('name', testUser.name);
    });

    test('Should not get profile for unauthenticated user', async () => {
        await request(app)
            .get('/api/users/profile')
            .expect(401);
    });
});

describe('Task API', () => {
    let taskId;

    test('Should create task for user', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                priority: 'medium',
                status: 'pending'
            })
            .expect(201);

        expect(response.body).toHaveProperty('title', 'Test Task');
        taskId = response.body._id;
    });

    test('Should fetch user tasks', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Test Task');
    });

    test('Should fetch task by ID', async () => {
        const response = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('title', 'Test Task');
    });

    test('Should update task', async () => {
        const response = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Updated Task',
                status: 'in-progress'
            })
            .expect(200);

        expect(response.body).toHaveProperty('title', 'Updated Task');
        expect(response.body).toHaveProperty('status', 'in-progress');
    });

    test('Should filter tasks by status', async () => {
        const response = await request(app)
            .get('/api/tasks?status=in-progress')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
        expect(response.body[0].status).toBe('in-progress');
    });

    test('Should delete task', async () => {
        await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.length).toBe(0);
    });
});