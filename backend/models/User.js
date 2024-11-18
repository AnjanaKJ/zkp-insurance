const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  did: { type: Number, required: true, unique: true },
  ehrData: { type: Object, required: true }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
