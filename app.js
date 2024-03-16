const express = require("express");
const app = express();
const mongoose = require("mongoose");
let Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("Error:", err)
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req, res)=>{
    res.send("Hi, I am groot");
});

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});

//index route
app.get("/listings",async (req,res)=>{
    const allListings= await Listing.find({}).then().catch(e=>console.log(e));
    res.render("listings/index.ejs", {allListings});
}); 

//new route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});  

app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create route
app.post("/listings", async(req, res)=>{
    let {title,description,image,price,location,country} = req.body;
    const newListing = new Listing({
        title,description,image,price,location,country
    }); 
    await newListing.save();
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const editListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {editListing});
});

//update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let {title,description,image,price,location,country} = req.body
    const updateListing = await Listing.findByIdAndUpdate(id, {title,description,image,price,location,country});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


// app.get("/test", (req,res)=>{
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "calagute, goa",
//         country: "India",
//     });

//     sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });