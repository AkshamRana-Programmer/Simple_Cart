const express = require('express');
const router = express.Router();
const {
    getCarts,
    getSingleCart,
    getUserCarts,
    addCart,
    updateCart,
    deleteCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../controllers/cartController');

/**
 * @swagger
 * /carts/all:
 *   get:
 *     summary: Get all carts
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Carts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
 */
router.get('/all', getCarts);

/**
 * @swagger
 * /carts/user/{userId}:
 *   get:
 *     summary: Get carts by user id
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User carts fetched successfully
 */
router.get('/user/:userId', getUserCarts);

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     summary: Get a single cart by MongoDB id
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       404:
 *         description: Cart not found
 */
router.get('/:id', getSingleCart);

/**
 * @swagger
 * /carts/add:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user, items]
 *             properties:
 *               user:
 *                 type: string
 *                 example: 69dd5cb17d6c957c831c3b73
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       201:
 *         description: Cart created successfully
 */
router.post('/add', addCart);

/**
 * @swagger
 * /carts/{id}:
 *   put:
 *     summary: Update a cart by MongoDB id
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 */
router.put('/:id', updateCart);

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     summary: Delete a cart by MongoDB id
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 */
router.delete('/:id', deleteCart);

/**
 * @swagger
 * /carts/{id}/items:
 *   post:
 *     summary: Add a product item to cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       200:
 *         description: Cart item added successfully
 */
router.post('/:id/items', addCartItem);

/**
 * @swagger
 * /carts/{id}/items/{productId}:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 */
router.put('/:id/items/:productId', updateCartItem);

/**
 * @swagger
 * /carts/{id}/items/{productId}:
 *   delete:
 *     summary: Remove a product item from cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 */
router.delete('/:id/items/:productId', removeCartItem);

/**
 * @swagger
 * /carts/{id}/clear:
 *   delete:
 *     summary: Remove all items from cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete('/:id/clear', clearCart);

module.exports = router;
