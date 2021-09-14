const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const admin = require("firebase-admin");



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//const port = 8000
const password = "hotel";

// Firebase admin



var serviceAccount = require("./course-booking-5392b-firebase-adminsdk-zitii-8a0517d82e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://course-booking.firebaseio.com'
});




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
  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
      // res.redirect("/");
    });
    console.log(newBooking);
  });
  // data show in ui from mongDb
  app.get("/bookingShow", (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];

      admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if (tokenEmail == queryEmail) {
            collection.find({ email: req.query.email }).toArray((err, documents) => {
              res.status(200).send(documents);
            });
          }
          else{
            res.status(401).send("Unauthorized Access")
          }
        })
        .catch((error) => {
          // Handle error
        });

    }
    else{
      res.status(401).send("Unauthorized Access")
    }






  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000);
