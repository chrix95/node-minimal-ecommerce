const router = require('express').Router();
const Product = require('../models/Product');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/index');

// CREATE PRODUCT
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const product = await newProduct.save();
        res.status(201).json({
            'success': true,
            'message': 'Product created successfully',
            'data': product
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// UPDATE PRODUCT
router.put('/:productId', verifyTokenAndAdmin, async (req, res) => {
    const { productId } = req.params;
    try {
        const updateProduct = await Product.findByIdAndUpdate(productId, {
            $set: req.body
        }, { new: true });
        res.status(200).json({
            'success': true,
            'message': 'Product updated successfully',
            'data': updateProduct
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
});

// DELETE PRODUCT
router.delete('/:productId', verifyTokenAndAdmin, async (req, res) => {
    const { productId } = req.params;
    try {
        await Product.findByIdAndDelete(productId);
        res.status(200).json({
            'success': true,
            'message': 'Product deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// GET PRODUCT
router.get('/find/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        res.status(200).json({
            'success': true,
            'message': 'Product retrieved successfully',
            'data': product
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json({
            'success': true,
            'message': 'Products retrieved successfully',
            'data': products
        });
    } catch (err) {
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

module.exports = router