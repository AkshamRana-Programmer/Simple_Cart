const express = require('express');
const router = express.Router();
const {
    getUser,
    getSingleUser,
    addUser,
    updateUser,
    deleteUser
} = require('../controllers/userController')

router.get('/all', getUser); 
router.get('/:id', getSingleUser);
router.post('/add', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
