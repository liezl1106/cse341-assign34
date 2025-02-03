const router = require('express').Router();
const passport = require('passport'); 

// Swagger route
router.use('/api-docs', require('./swagger'));

// GitHub authentication route
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/', 
    successRedirect: '/' 
}));

// Logout route
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Base route
router.get('/', (req, res) => {
    res.json('Welcome to the API!');
});

// Users route
router.use('/users', require('./userRoutes'));

// Products route
router.use('/products', require('./productRoutes'));

// Catch-all for undefined routes
router.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = router;