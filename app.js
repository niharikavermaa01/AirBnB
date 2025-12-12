const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const Review = require("./models/review.js");
const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

app.use("/listings",listing);
app.use("/listings/:id/reviews", reviews)

// 3. The final error-handling middleware is LAST
app.use((err, req, res, next) => {
  // Provide default values for status and message
  let { status = 500, message = "Something went wrong! Try again" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

app.listen(8080,()=>{
    console.log("Server started")
});

