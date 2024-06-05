const Listing = require("./models/listing");
const { listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to create listing!');
        return res.redirect('/login');
      }
      next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
      let errorMsg = result.error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errorMsg);
    } else {
      next();
    }
  };

module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash('error', 'You are not the owner of this listing');
      return res.redirect(`/listings/${id}`);
    }

    next();
}