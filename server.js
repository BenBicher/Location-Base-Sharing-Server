const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const port = process.env.port || 8000;

var corsOptions = {
  origin: 'https://location-base-sh-1530431619237.firebaseapp.com',
  // origin: 'http://localhost:4200,'
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('Server started!');
});

var url = "mongodb+srv://benbicher:benbicher@location-base-sharing-f2dij.mongodb.net/";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("mydb");
  dbo.createCollection("event", function (err, res) {
    if (err) throw err;
    console.log("Collection created!");

    app.get('/api/getevents', (req, res) => {
      var dbo = db.db("mydb");
      dbo.collection("event").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    });

    app.post('/api/addevents', (req, res) => {
      console.log("i'm in");
      
      var newEvent = req.body;
      console.log(newEvent);

      var dbo = db.db("mydb");
      dbo.collection("event").insertOne(newEvent, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
  });

    app.delete('/api/events/:name', (req, res) => {
      var dbo = db.db("mydb");
      var myquery = { name: req.params.name  };
      dbo.collection("event").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        res.send(200, req.body);
      });
    });

    app.put('/api/updateEvents/:name', (req, res) => {
      var dbo = db.db("mydb");
      var myquery = { name: req.body.name };
      var newvalues = { $set: { peopleThatJoined: req.body.peopleThatJoined,
                                numOfParticipants: req.body.numOfParticipants 
                              }};
      dbo.collection("event").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
      res.send(200, req.body);
    });
  });
});