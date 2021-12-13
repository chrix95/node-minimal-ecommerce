const dotenv = require('dotenv');
dotenv.config();
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post('/payment', (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: 'usd'
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json({ 'success': false, 'message': stripeErr });
        } else {
            res.status(200).json({ 'success': true, 'data': stripeRes });
        }
    })
})


module.exports = router;