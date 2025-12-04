const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../joiSchema.js");
const Review = require("../models/review.js");
const router = express.Router();

//reviews
//this middleware will validate the form submission data that is coming from client side
const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
}
//creating review section
router.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview= new Review(req.body.review);
  if (!listing) {
    throw new ExpressError(404, "review not found.");
  }
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// deleting reviews 
router.delete("/listings/:id/reviews/:reviewID", wrapAsync(async (req,res)=>{
  let {id, reviewID}= req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewID}});
  await Review.findByIdAndDelete(reviewID);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;