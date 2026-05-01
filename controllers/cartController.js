const Cart = require('../models/cart');
const Products = require('../models/product');
const Users = require('../models/user');

const populateCart = (query) => {
    return query
        .populate('user', 'name email')
        .populate('items.product', 'id title price category thumbnail');
};

const getUserId = (body) => body.user || body.userId;
const getProductId = (item) => item.product || item.productId;

const normalizeItems = (items = []) => {
    const itemMap = new Map();

    for (const item of items) {
        const productId = getProductId(item);
        const quantity = Number(item.quantity || 1);

        if (!productId) {
            return {error: 'product is required for each cart item'};
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return {error: 'quantity must be a positive number'};
        }

        const currentQuantity = itemMap.get(productId) || 0;
        itemMap.set(productId, currentQuantity + quantity);
    }

    return {
        items: Array.from(itemMap.entries()).map(([product, quantity]) => ({
            product,
            quantity
        }))
    };
};

const buildCartTotals = async(items = []) => {
    const normalized = normalizeItems(items);

    if (normalized.error) {
        return normalized;
    }

    if (normalized.items.length === 0) {
        return {
            items: [],
            totalQuantity: 0,
            totalPrice: 0
        };
    }

    const productIds = normalized.items.map((item) => item.product);
    const products = await Products.find({_id: {$in: productIds}});
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    for (const productId of productIds) {
        if (!productMap.has(productId.toString())) {
            return {error: `product not found: ${productId}`, status: 404};
        }
    }

    const totalQuantity = normalized.items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = normalized.items.reduce((total, item) => {
        const product = productMap.get(item.product.toString());
        return total + product.price * item.quantity;
    }, 0);

    return {
        items: normalized.items,
        totalQuantity,
        totalPrice: Number(totalPrice.toFixed(2))
    };
};

const refreshCartTotals = async(cart) => {
    const totals = await buildCartTotals(cart.items);

    if (totals.error) {
        return totals;
    }

    cart.items = totals.items;
    cart.totalQuantity = totals.totalQuantity;
    cart.totalPrice = totals.totalPrice;
    return {cart};
};

// get all carts
const getCarts = async(req, res) => {
    try {
        const carts = await populateCart(Cart.find());
        res.status(200).json({carts});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// get single cart
const getSingleCart = async(req, res) => {
    try {
        const cart = await populateCart(Cart.findById(req.params.id));

        if (!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        res.status(200).json({cart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// get carts by user
const getUserCarts = async(req, res) => {
    try {
        const carts = await populateCart(Cart.find({user: req.params.userId}));
        res.status(200).json({carts});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// add cart
const addCart = async(req, res) => {
    try {
        const userId = getUserId(req.body);

        if (!userId) {
            return res.status(400).json({message: 'user is required'});
        }

        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({message: 'user not found'});
        }

        const totals = await buildCartTotals(req.body.items || []);

        if (totals.error) {
            return res.status(totals.status || 400).json({message: totals.error});
        }

        const cart = await Cart.create({
            user: userId,
            items: totals.items,
            totalQuantity: totals.totalQuantity,
            totalPrice: totals.totalPrice
        });

        const savedCart = await populateCart(Cart.findById(cart._id));
        res.status(201).json({message: 'cart created', cart: savedCart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// update cart
const updateCart = async(req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        const userId = getUserId(req.body);

        if (userId) {
            const user = await Users.findById(userId);

            if (!user) {
                return res.status(404).json({message: 'user not found'});
            }

            cart.user = userId;
        }

        if (req.body.items) {
            const totals = await buildCartTotals(req.body.items);

            if (totals.error) {
                return res.status(totals.status || 400).json({message: totals.error});
            }

            cart.items = totals.items;
            cart.totalQuantity = totals.totalQuantity;
            cart.totalPrice = totals.totalPrice;
        }

        await cart.save();

        const updatedCart = await populateCart(Cart.findById(cart._id));
        res.status(200).json({message: 'cart updated', cart: updatedCart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// delete cart
const deleteCart = async(req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);

        if (!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        res.status(200).json({message: 'cart deleted', cart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// add product item in cart
const addCartItem = async(req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        const productId = getProductId(req.body);
        const quantity = Number(req.body.quantity || 1);

        if (!productId) {
            return res.status(400).json({message: 'product is required'});
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({message: 'quantity must be a positive number'});
        }

        const product = await Products.findById(productId);

        if (!product) {
            return res.status(404).json({message: 'product not found'});
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({product: productId, quantity});
        }

        const totals = await refreshCartTotals(cart);

        if (totals.error) {
            return res.status(totals.status || 400).json({message: totals.error});
        }

        await cart.save();

        const updatedCart = await populateCart(Cart.findById(cart._id));
        res.status(200).json({message: 'cart item added', cart: updatedCart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// update product quantity in cart
const updateCartItem = async(req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({message: 'quantity must be a positive number'});
        }

        const item = cart.items.find((cartItem) => cartItem.product.toString() === req.params.productId);

        if (!item) {
            return res.status(404).json({message: 'cart item not found'});
        }

        item.quantity = quantity;

        const totals = await refreshCartTotals(cart);

        if (totals.error) {
            return res.status(totals.status || 400).json({message: totals.error});
        }

        await cart.save();

        const updatedCart = await populateCart(Cart.findById(cart._id));
        res.status(200).json({message: 'cart item updated', cart: updatedCart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// remove product item from cart
const removeCartItem = async(req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        const itemExists = cart.items.some((item) => item.product.toString() === req.params.productId);

        if (!itemExists) {
            return res.status(404).json({message: 'cart item not found'});
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

        const totals = await refreshCartTotals(cart);

        if (totals.error) {
            return res.status(totals.status || 400).json({message: totals.error});
        }

        await cart.save();

        const updatedCart = await populateCart(Cart.findById(cart._id));
        res.status(200).json({message: 'cart item removed', cart: updatedCart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// clear cart items
const clearCart = async(req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        cart.items = [];
        cart.totalQuantity = 0;
        cart.totalPrice = 0;
        await cart.save();

        const updatedCart = await populateCart(Cart.findById(cart._id));
        res.status(200).json({message: 'cart cleared', cart: updatedCart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
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
};
