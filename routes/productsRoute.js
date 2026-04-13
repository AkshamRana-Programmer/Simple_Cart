const express = require('express');
const router = express.Router();
const {
    getProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.get('/all', getProducts);
router.get('/:id', getSingleProduct);
router.post('/add', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
