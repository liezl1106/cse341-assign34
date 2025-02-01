const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: { type: String, required: true, unique: true },
    displayName: { type: String },
    username: { type: String },
    profileUrl: { type: String }
});

module.exports = mongoose.model('user', userSchema);