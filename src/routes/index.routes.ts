import express from 'express';
const user = require('./user.routes');
const category = require('./category.routes');

const router = express.Router();

router.use('/api/v1/user', user);
router.use('/api/v1/category', category);


module.exports = router; 
