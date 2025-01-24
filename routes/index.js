const router = require('express').Router();

// Swagger route
router.use('/api-docs', require('./swagger'));

// Base route
router.get('/', (req, res) => {
    res.send('Hello World');
});

// Contacts route
router.use('/contacts', require('./contacts'));

module.exports = router;