const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    badge: {
        type: String
    },

    rating: {
        type: Number,
        min: 0,
        max: 5
    },

    tags: {
        type: [String]
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;