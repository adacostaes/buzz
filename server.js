const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const initializePassport = require('./passport-config')

var UserModel = require('./userModel')
var PostModel = require('./postModel')

var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 5000

const app = express()

app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
  //cookie: { maxAge: 60000 }
}));
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extendes: false
  })
)

// PASSPORT

initializePassport(
  passport,
  email =>  users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

/*
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(users, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  UserModel.findById(_id, (err, user) => done(err, user));
});

passport.use("local", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    console.log(UserModel.findOne({email}))
    UserModel.findOne({ email })
      .then(users => {
        if (!users || !users.validPassword(password)) {
          done(null, false, { message: "Invalid email/password" });
        } else {
          done(null, users);
        }
      })
      .catch(e => done(e));
  }
));

const loggedInOnly = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect("/");
};

const loggedOutOnly = (req, res, next) => {
  if (req.isUnauthenticated()) next();
  else res.redirect("/home");
};
*/
// END PASSPORT



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
  response.sendFile(__dirname + '/views/register.html')
});

app.post('/register', function(req, res) {

  if (req.body.firstname && req.body.lastname && req.body.email && req.body.password && req.body.confirmPwd && req.body.gender && req.body.city) {
    if (req.body.password == req.body.confirmPwd) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          var newUser = new UserModel({
            id: Date.now().toString(),
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
            if (!err) {
              return res.send({
                status: 'User created'
              })
            } else {
              if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({
                  error: 'Bad Request'
                })
              } else {
                res.statusCode = 500;
                res.send({
                  error: 'Internal Server Error'
                })
              }
            }
          });
        });
      });
    } else {
      res.send('Les mots de passes ne correspondent pas.')
    }
  } else {
    res.send('Veuillez remplir tous les champs du formulaire.')
  }
});

app.get('/', function(request, response) {
  response.render('index.ejs')
  //response.sendFile(__dirname + '/views/index.ejs')
});

app.post("/", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: true
}));
