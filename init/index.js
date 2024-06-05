const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

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

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner: '664b3115e89ac5c9fad2a1db'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();