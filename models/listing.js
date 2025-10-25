const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    image:{
        type: String,
        default: "https://unsplash.com/photos/city-skyline-across-the-water-from-a-ferry-deck-Heu_fJQNTf0",
        set: (v)=> v=== "" ? "https://unsplash.com/photos/two-surfers-wait-for-waves-near-a-rocky-coastline-MA0nBwOmuwQ" : v
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String
    },
    country: {
        type: String
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;