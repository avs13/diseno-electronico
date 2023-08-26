const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    coordinates: String,
    // Otros campos que quieras almacenar
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;