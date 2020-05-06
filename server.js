var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
var port = process.env.PORT || 5000
var path = require('path')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extendes: false
  })
)

const userSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
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
    type: Date
  },
  createdOn: {
    type: Date, default: Date.now
  }
})

var UserModel = mongoose.model('User', userSchema)


const mongoURI = 'mongodb://localhost:27017/buzzzdb'

mongoose
  .connect(
    mongoURI,
    {useNewUrlParser: true}
  )
  .then(() => console.log('MongoDB connecté.'))
  .catch(err => console.log('Erreur: ' + err))

  app.listen(port, function() {
    console.log('Le serveur tourne sur le port: ' + port)
  })

  app.get('/register', function(request, response) {
    response.sendFile( __dirname  + '/views/register.html');
  });

  app.post('/register', function(request, response) {
    var user = new UserModel(request.body)
    user.save()
      .then(item => {
        response.send("item saved to database")
      })
      .catch(err =>{
        response.status(400).send('Unable to save to database')
      })
    console.log(request.body)
});
