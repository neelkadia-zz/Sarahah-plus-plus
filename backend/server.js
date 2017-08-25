var express = require('express');
var mongo = require('mongodb');
var databaseUrl = "mongodb://username:password@url.mlab.com:12345/sarahah";
var mongojs = require('mongojs')
var db = mongojs(databaseUrl);
var Feedbacks = db.collection('Feedbacks');
var sentiment = require('sentiment');


var app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.get('/hello', function (req, res) {
  res.status(200).send('Hello, world!');
});

//Save Feedback from User
app.post('/submitFeedback', function (req, res) {
  console.log("----------------");
  console.log("/submitFeedback");
  
  console.log("params got:"+req.body.Feedback);
  console.log("params got:"+req.query.Feedback);
  
  var Feedback = req.body.Feedback; //get
  //var Feedback = req.bqueryody.Feedback; //post
  
  var r1 = sentiment(Feedback);
  console.log(r1);  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ Status: r1 }));
  
  Feedbacks.insert({
      Feedback : req.body.Feedback,
      Values : r1
  },function (err, data, lastErrorObject) {
            if(data>0){
              console.log("Feedback Saved!");
            }
            if (err){
              console.log(err);
            }else{
              console.log("Feedback Saved! : "+JSON.stringify(data));
            }
      });
});

// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});
