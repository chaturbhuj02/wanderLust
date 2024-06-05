const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema.js");
let Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const router = express.Router();

//index route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({})
    .then()
    .catch((e) => console.log(e));
  res.render("listings/index.ejs", { allListings });
});

//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { title, description, image, price, location, country } = req.body;
    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const editListing = await Listing.findById(id);
  if (!editListing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { editListing });
});

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country,
    });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

module.exports = router;
