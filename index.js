const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//const port = 8000
const password = "hotel";

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://hotel:hotel@cluster0.npcff.mongodb.net/Hotel_Booking?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("Hotel_Booking").collection("hotelBooking");
  // data send to mongodb from ui
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking)
    .then(result => {
      res.send(result.insertedCount > 0);
      // res.redirect("/");
    });
    console.log(newBooking);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000);
