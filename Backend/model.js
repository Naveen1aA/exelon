const mongoose = require('mongoose');

const Cities = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model("cities", Cities)

