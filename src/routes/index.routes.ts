import express from 'express';
const user = require('./user.routes');

const router = express.Router();

router.use('/api/v1/user', user);

module.exports = router; 
