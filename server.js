var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
  user: 'mm15b001',
  database: 'mm15b001',
  host: 'db-mm15b001-20949',
  port:'5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt){
    //How do we create hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 1000, 512, 'sha512');
    return["pbkdf2","1000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req,res){
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
   //username, passward
   //JSON
   var username = req.body.username;
   var passward = req.body.passward;
   
   var salt = crypto.getRandomBytes(128).toString('hex');
   pool.query('INSERT INTO "user" (username, passward) VALUES ($1, $2)',[username, dbString], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send('user successfully created: '+ username);
        }
    });
});

var pool = new Pool (config);
app.get('/test-db', function(req, res){
    //make a select request
    //return a reponse with a results
    pool.query('SELECT * FROM test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringfy(result));
        }
    });
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/article-one', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});

app.get('/article-two', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
