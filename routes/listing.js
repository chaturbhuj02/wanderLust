const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema, reviewSchema } = require("../schema.js");
let Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router();

const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let errorMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

//index route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({})
    .then()
    .catch((e) => console.log(e));
  res.render("listings/index.ejs", { allListings });
});

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

//Create route
router.post(
  "/",
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
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit route
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const editListing = await Listing.findById(id);
  res.render("listings/edit.ejs", { editListing });
});

//update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    const updateListing = await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country,
    });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

module.exports = router;
