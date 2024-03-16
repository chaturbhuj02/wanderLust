const express = require("express");
const app = express();
const mongoose = require("mongoose");
let Listing = require("./models/listing.js");
const path = require("path");

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