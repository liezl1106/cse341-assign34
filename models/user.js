const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        user_id: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password_hash: { type: String, required: true },
});

module.exports = mongoose.model('user', userSchema);