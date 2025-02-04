const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/authenticate');

// Swagger route
router.use('/api-docs', require('./swagger'));

// GitHub authentication route (Prevents re-login if already authenticated)
router.get('/login', (req, res, next) => {
    if (req.session.user) {
        return res.json({ message: "Already logged in", loginStatus: `Logged in as ${req.session.user.username}` });
    }
    next();
}, passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Callback (Stores user session)
router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }), 
    (req, res) => {
        req.session.user = {
            id: req.user.id,
            username: req.user.username
        };
        res.redirect('/'); // Redirect after login
    }
);

// Logout route (Clears session)
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.user = null; // Clear session
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

// Base route (Shows login status)
router.get('/', (req, res) => {
    const message = "Welcome to the API!";
    if (req.session.user) { // Use session instead of `req.isAuthenticated()`
        res.json({ 
            message, 
            loginStatus: `Logged in as ${req.session.user.username}` 
        });
    } else {
        res.json({ message, loginStatus: "Logged Out" });
    }
});

// Protected Users Route
router.use('/users', isAuthenticated, require('./userRoutes'));

// Protected Products Route
router.use('/products', isAuthenticated, require('./productRoutes'));

// Catch-all for undefined routes
router.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = router;