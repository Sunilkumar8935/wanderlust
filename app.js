const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const Mongo_Url="mongodb://127.0.0.1:27017/wanderlust";

//mongodb connect
main()
.then(()=>{
    console.log("connected to db");
})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect( Mongo_Url);

 
}

//basic api
app.get("/",(req,res)=>{
    res.send("Hi,I am root.");
});
//Index Route
//return everythings
app.get("/listings",async (req,res)=>{
  const allListings= await Listing.find({})
  res.render("listing/index.ejs",{allListings});
});
//new route
app.get("/listings/new",(req,res)=>{

  
  res.render("listing/new.ejs");
});
//edit route

app.get("/listings/:id/edit",async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listing/edit.ejs",{listing});
});

//show route
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  console.log(id);
  const listing=await Listing.findById(id);
  res.render("listing/show.ejs",{listing});
});
//database insert
// app.get("/testListings",async (req,res)=>{
//     let sampleList=new Listing({
//         title:"My new home",
//         description:"Near the Jungle & Mountain",
//         price:100,
//         location:"Kathmandu",
//         country:"Nepal",
//     });
//    await  sampleList.save();
//    console.log("sample was saved");
//    res.send("server");
// });
//server start
//create route

// // app.post("/listings",async (req,res)=>{
//   //let {title,image,description,price,location,country} = req.body;
//   const  newListing=new Listing(req.body);
//   await newListing.save();
//  // console.log(newListing);
//   res.redirect("/listings");
// });
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);

  await newListing.save();

  res.redirect("/listings");
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    // Correct redirect syntax (Sahi path):
    res.redirect(`/listings/${id}`); 
    // Ya phir: res.redirect("/listings");
});
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
});
app.listen(8080,()=>{
    console.log("app is listeining on 8080");
});