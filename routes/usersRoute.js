const express = require('express');
const router = express.Router();
const {getUser, addUser} = require('../controllers/userController')

router.get('/all', getUser);
router.post('/add', addUser);

module.exports = router;