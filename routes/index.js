const router = require('express').Router();

// Swagger route
router.use('/api-docs', require('./swagger'));

// Base route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Users route
router.use('/users', require('./users'));

// Products route
router.use('/products', require('./products'));

// Catch-all for undefined routes
router.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = router;