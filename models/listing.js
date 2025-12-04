const { ref } = require("joi");
const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

//creating middleware, if a listing gets delete the review will also delete
listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;