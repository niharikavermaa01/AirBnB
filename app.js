const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./joiSchema.js");

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//building connection 
main()
    .then(()=>{console.log("Database connected")})
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/home",(req,res)=>{
    res.render("home.ejs")
});

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
app.get("/listings",wrapAsync(async (req,res,next)=>{
  const alllistings= await Listing.find({});
     res.render("listings/index.ejs",{alllistings});
}));

//for creating new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//submitting user data for creating new listing
app.post("/listings", 
      validateListing,
      wrapAsync(async (req ,res,next)=>{
      const newListing = new Listing(req.body.newListing);
      await newListing.save();
      res.redirect("/listings");
}));

//show route: that will display the particular detail of house
app.get("/listings/:id", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "The listing you are looking for does not exist."));
    }
    res.render("listings/show.ejs", { listing });
}));

//route to edit your list
app.get("/listings/:id/edit", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "The listing you are looking for does not exist."));
    }
    res.render("listings/edit.ejs", { listing });
}));

//updating the route (edit request)
app.put("/listings/:id",
  validateListing,
  wrapAsync(async (req,res,next)=>{
  let {id}= req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.newListing});
  res.redirect(`/listings/${id}`);
}));

///deleting the listing the button in presend in show route 
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
  let {id}= req.params;
  let deletelisting = await Listing.findByIdAndDelete(id);
  if(!deletelisting){
    throw new ExpressError(400, "Bad request")
  };
  res.redirect("/listings");
}));

// 3. The final error-handling middleware is LAST
app.use((err, req, res, next) => {
  // Provide default values for status and message
  let { status = 500, message = "Something went wrong! Try again" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

app.listen(8080,()=>{
    console.log("Server started")
});