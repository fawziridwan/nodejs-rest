const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/user');

router.post('/signup', UsersController.user_signup);

router.delete('/:userId', UsersController.user_delete);

router.post('/login', UsersController.user_login);

module.exports = router;