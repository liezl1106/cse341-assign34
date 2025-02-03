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
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

// Base route (Welcome Message + Login Status)
router.get('/', (req, res) => {
    const message = "Welcome to the API!";
    if (req.isAuthenticated()) {
        res.json({ 
            message, 
            loginStatus: `Logged in as ${req.user.username}` 
        });
    } else {
        res.json({ message, loginStatus: "Logged Out" });
    }
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