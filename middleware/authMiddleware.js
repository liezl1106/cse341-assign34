const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // TODO: Verify token logic here
    next();
};

module.exports = authMiddleware;