const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { encryptPassword, decryptPassword }  = require('../helpers/index');

router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: encryptPassword(req.body.password),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json({
            'success': true,
            'message': 'User created successfully',
            'data': savedUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // find user by username
        const user = await User.findOne({ username });
        // validate if user exists
        !user && res.status(401).json({
            'success': false,
            'message': 'Invalid credentials'
        });

        // Decrypt password
        const decryptedPassword = decryptPassword(user.password);

        decryptedPassword !== password && res.status(401).json({
            'success': false,
            'message': 'Invalid credentials'
        });

        // generate token
        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '3d' });

        // remove the password before sending response
        delete user._doc.password;

        res.status(200).json({
            'success': true,
            'message': 'User logged in successfully',
            'data': { ...user._doc, accessToken }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'success': false,
            'message': err.message
        });
    }
})

module.exports = router;