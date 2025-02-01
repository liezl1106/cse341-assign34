const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json())
   .use(session({
       secret: "secret",
       resave: false,
       saveUninitialized: true,
   }))
   .use(passport.initialize())
   .use(passport.session())
   .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
   .use(cors({ origin: '*' }))
   .use((req, res, next) => {
       res.setHeader('Access-Control-Allow-Origin', '*');
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
       res.setHeader('Access-Control-Allow-Headers', 'Origin, x-Requested-With, Content-Type, Accept, z-Key, Authorization');
       next();
   });

// GitHub Authentication Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://cse341-assign34.onrender.com/github/callback" // Use Render URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("./routes/index.js"));
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Root Route
app.get('/', (req, res) => { 
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// GitHub OAuth Callback
app.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/api-docs', session: false
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

// Connect to Database and Start Server
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on http://localhost:${port}`);
            console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
        });
    }
});