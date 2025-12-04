const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1, 
        max: 5, 
        required: true // Ensures a rating is always provided
    },
    createdAt: {
        type: Date,
        default: Date.now // Mongoose calls this function reference when saving
    }
});

module.exports = mongoose.model("Review", reviewSchema);
