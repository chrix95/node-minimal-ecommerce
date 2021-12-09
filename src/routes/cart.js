const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require('../middleware/index');

// CREATE CART
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(201).json({
            'success': true,
            'message': 'Cart created successfully',
            'data': savedCart
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// UPDATE CART
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params;
    try {
        const updateCart = await Cart.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            'success': true,
            'message': 'Cart updated successfully',
            'data': updateCart
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
});

// DELETE PRODUCT
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({
            'success': true,
            'message': 'Cart deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// GET USER CART
router.get('/find/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({
            userId
        });
        res.status(200).json({
            'success': true,
            'message': 'User cart retrieved successfully',
            'data': cart
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// CART ALL
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json({
            'success': true,
            'message': 'User cart retrieved successfully',
            'data': carts
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

module.exports = router