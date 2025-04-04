require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,

    db: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },

    env: process.env.NODE_ENV || 'development',

    testDb: {
        uri: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/task-manager-test'
    }
};