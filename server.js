var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
var port = process.env.PORT || 5000
var path = require('path')


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extendes: false
  })
)

function toLower(str) {
  return str.toLowerCase();
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    set: toLower,
    unique: true
  },
  password: {
    type: String
  },
  gender: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  birthdate: {
    type: String
  },
  createdOn: {
    type: String,
    default: Date.now
  }
})

var UserModel = mongoose.model('User', userSchema)


const mongoURI = 'mongodb://localhost:27017/buzzzdb'

mongoose
  .connect(
    mongoURI, {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB connecté.'))
  .catch(err => console.log('Erreur: ' + err))

app.listen(port, function() {
  console.log('Le serveur tourne sur le port: ' + port)
})

app.get('/register', function(request, response) {
  response.sendFile(__dirname + '/views/register.html');
});

app.post('/register', function(req, res) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      var newUser = new UserModel({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: hash,
        gender: req.body.gender,
        country: req.body.country,
        city: req.body.city,
        birthdate: req.body.birthdate
      });
      console.log(req.body)
      console.log(newUser)
      newUser.save(function(err) {
        if(!err) {
          return res.send({ status: 'User created' });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Bad Request' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Internal Server Error' });
          }
        }
      });
    });
  });
});
