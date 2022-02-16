const express = require("express")
const res = require("express/lib/response")
const mongo = require("mongodb").MongoClient
const app = express()

const url = "mongodb://localhost:27017/"

let db, trips, expenses


mongo.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
},
(err,client)=>{
    if(err){
        console.error(err)
        return;
    }
    console.log("Database Connected");
    db= client.db("ArrayAPI")
    trips = db.collection("trips")
    expenses = db.collection("expenses")
}
)


app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).json({message:"Root working"})
})


// add trips
app.post("/trip",(req,res)=>{
    const name =req.body.name;
    console.log(req.body.name);
    trips.insertOne({name:name},(err,result)=>{
        if(err){
            console.error(err);
            res.status(500).json({err:err})
            return;
        }
        res.status(200).json({message:"Trip added"})
    })

})

// get all trips
app.get("/trips",(req,res)=>{
    trips.find().toArray((err,items)=>{
        if(err){
            console.error(err);
            res.status(500).json({err:err})
            return;
        }
        res.status(200).json({trips:items})
    })

})


// Add Expences
app.post("/expense", (req, res) => {
    expenses.insertOne(
    {
      trip: req.body.trip,
      date: Date(),
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
    },
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      res.status(200).json({ message: "Expenses Added Successfully" })
    }
    )
})

//List all expenses
app.get("/expenses", (req, res) => {
    expenses.find({trip:req.body.trip}).toArray((err, items) => {
        if (err) {
          console.error(err)
          res.status(500).json({ err: err })
          return
        }
        res.status(200).json({ expenses : items})
      })
})




let port =4000;
app.listen(port,()=>{
    console.log(`server working on port ${port}`);
})