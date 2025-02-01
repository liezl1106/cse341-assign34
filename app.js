require('dotenv').config(); // Load environment variables

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

// Debugging: Ensure environment variables are loaded
console.log("✅ Checking Environment Variables:");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "LOADED" : "MISSING");
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID || "MISSING");
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET ? "LOADED" : "MISSING");
console.log("CALLBACK_URL:", process.env.CALLBACK_URL || "MISSING");
console.log("SESSION_SECRET:", process.env.SESSION_SECRET || "MISSING");

// Middleware
app.use(bodyParser.json());

// Use `connect-mongo` for secure session storage
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

// Unified CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// GitHub Authentication Strategy
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error("❌ ERROR: Missing GitHub OAuth credentials. Set them in .env or Render.");
    process.exit(1);
}

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

// Root Route (Debugging Sessions)
app.get('/', (req, res) => { 
    console.log("Session Data:", req.session);
    res.send(req.session.user ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// Login route: Redirects to GitHub OAuth
app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth Callback (Fixed: No Duplicate)
app.get('/github/callback', passport.authenticate('github', { 
    failureRedirect: '/login', session: true
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

// Connect to Database and Start Server
mongodb.initDb((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`✅ Server running at http://localhost:${port}`);
            console.log(`📄 Swagger docs: http://localhost:${port}/api-docs`);
        });
    }
});