require('dotenv/config');

const cors = require('cors');
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const jsonObj = require('./baykar.json');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

app.get('/*',function(req,res,next){
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
