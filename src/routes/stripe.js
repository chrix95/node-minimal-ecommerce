const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post('/payment', (req, res) => {
    console.log(stripe);
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: 'usd'
    }, (stripeErr, stripeRes) => {
        stripeErr && res.status(500).send({ 'success': false, 'message': stripeErr });
        res.status(200).json({ 'success': true, 'message': stripeRes });
    })
})


module.exports = router;