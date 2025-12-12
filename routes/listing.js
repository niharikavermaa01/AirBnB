const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../joiSchema.js");
const router = express.Router();

//this middleware will validate the form submission data that is coming from client side
const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
}

//index route in which our all listings are presend 
router.get("/",wrapAsync(async (req,res,next)=>{
  const alllistings= await Listing.find({});
     res.render("listings/index.ejs",{alllistings});
}));

//for creating new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//submitting user data for creating new listing
router.post("/", 
      validateListing,
      wrapAsync(async (req ,res, next)=>{
      const newListing = new Listing(req.body.newListing);
      await newListing.save();
      res.redirect("/listings");
}));

//show route: that will display the particular detail of house
router.get("/:id", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        return next(new ExpressError(404, "The listing you are looking for does not exist."));
    }
    res.render("listings/show.ejs", { listing });
}));

//route to edit your list
router.get("/:id/edit", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "The listing you are looking for does not exist."));
    }
    res.render("listings/edit.ejs", { listing });
}));

//updating the route (edit request)
router.put("/:id",
  validateListing,
  wrapAsync(async (req,res,next)=>{
  let {id}= req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.newListing});
  res.redirect(`/listings/${id}`);
}));

///deleting the listing the button in present in show route 
router.delete("/:id", wrapAsync(async (req,res)=>{
  let {id}= req.params;
  let deletelisting = await Listing.findByIdAndDelete(id);
  if(!deletelisting){
    throw new ExpressError(400, "Bad request")
  };
  res.redirect("/listings");
}));

module.exports = router;