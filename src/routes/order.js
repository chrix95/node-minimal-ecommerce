const router = require('express').Router();
const Order = require('../models/Order');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require('../middleware/index');

// CREATE ORDER
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json({
            'success': true,
            'message': 'Order created successfully',
            'data': savedOrder
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// UPDATE ORDER
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const updateOrder = await Order.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            'success': true,
            'message': 'Order updated successfully',
            'data': updateOrder
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
});

// DELETE ORDER
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({
            'success': true,
            'message': 'Order deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// GET USER ORDERS
router.get('/find/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({
            userId
        });
        res.status(200).json({
            'success': true,
            'message': 'User order retrieved successfully',
            'data': orders
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// ORDERS ALL
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            'success': true,
            'message': 'Orders retrieved successfully',
            'data': orders
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
    const previousMonth = new Date(date.getFullYear(), date.getMonth() - 2, date.getDate());
    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth  },
                    ...(productId && { products: { $elemMatch: {productId} }}),
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: "$sales" }
                }
            }
        ]);
        res.status(200).json({
            'success': true,
            'message': 'Monthly Income stats retrieved successfully',
            'data': income
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

module.exports = router