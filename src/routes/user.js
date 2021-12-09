const router = require('express').Router();
const User = require('../models/User');
const { encryptPassword } = require('../helpers');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/index');

// UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params;
    if (req.body.password) {
        req.body.password = encryptPassword(req.body.password);
    }
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        const { password, ...userData } = updateUser._doc;
        res.status(200).json({
            'success': true,
            'message': 'User updated successfully',
            'data': userData
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
});

// DELETE USER
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({
            'success': true,
            'message': 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        const { password, ...userData } = user._doc;
        res.status(200).json({
            'success': true,
            'message': 'User retrieved successfully',
            'data': userData
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// GET ALL USER
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json({
            'success': true,
            'message': 'Users retrieved successfully',
            'data': users
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastYear = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
    
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } }},
            {
                $project: {
                    month: { $month: '$createdAt' },
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: {$sum: 1}
                }
            }
        ])
        res.status(200).json({
            'success': true,
            'message': 'Users stats retrieved successfully',
            'data': data
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

module.exports = router