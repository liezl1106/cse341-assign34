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
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'z-Key', 'Authorization']
}));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://lzel76:lezLaway1176@cluster0.56ovd.mongodb.net/project3', 
        collectionName: 'sessions'
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

// // Debugging Session Data (Only when user is authenticated)
// app.use((req, res, next) => {
//     if (req.session.passport) {
//         console.log("Authenticated User Session:", req.session.passport.user);
//     }
//     next();
// });

// GitHub Authentication Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("./routes/index.js"));
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Root Route
app.get('/', (req, res) => { 
    res.send(req.session.user ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// GitHub OAuth Callback Route
app.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/', 
    session: true 
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
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