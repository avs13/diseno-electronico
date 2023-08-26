const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number,
    timestamp: Number
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;