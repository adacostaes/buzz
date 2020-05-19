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
const {
  ensureAuthenticated
} = require('./auth')
const {
  ensureNotAuthenticated
} = require('./noauth')
const initializePassport = require('./passport-config')

const multer = require('multer')
var upload = multer({
  dest: './uploads/',
  rename: function(fieldname, filename) {
    return filename;
  },
});

var PictureModel = require('./pictureModel')
var UserModel = require('./userModel')
var PostModel = require('./postModel')

var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 5000

const app = express()



app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
  //cookie: { maxAge: 60000 }
}));
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})


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
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

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

app.get('/register', ensureNotAuthenticated, function(request, response) {
  response.render('register.ejs')
});

function capital_letter(str) {
  str = str.split(" ");

  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }

  return str.join(" ");
}

console.log(capital_letter("Write a JavaScript program to capitalize the first letter of each word of a given string."));

app.post('/register', function(req, res) {

  if (req.body.firstname && req.body.lastname && req.body.email && req.body.password && req.body.confirmPwd && req.body.gender && req.body.city) {
    if (req.body.password == req.body.confirmPwd) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          var newUser = new UserModel({
            id: Date.now().toString(),
            firstName: capital_letter(req.body.firstname),
            lastName: capital_letter(req.body.lastname),
            email: req.body.email,
            password: hash,
            gender: req.body.gender,
            country: req.body.country,
            city: capital_letter(req.body.city),
            birthdate: req.body.birthdate
          });
          console.log(req.body)
          console.log(newUser)
          newUser.save(function(err) {

            if (!err) {
              req.flash('success_msg', 'Vous êtes maintenant enregistré, vous pouvez vous identifier.')
              res.redirect('/')
            } else {
              if (err.name == 'ValidationError') {
                req.flash('error_msg', 'Mauvaise requête.')
                res.redirect('/')
              } else {
                req.flash('error_msg', 'Erreur interne.')
                res.redirect('/')
              }
            }
          });
        });
      });
    } else {
      req.flash('error_msg', 'Les mots de passes ne correspondent pas.')
      res.redirect('/register')
    }
  } else {
    req.flash('error_msg', 'Veuillez remplir tous les champs du formulaire.')
    res.redirect('/register')
  }
});

app.get('/', ensureNotAuthenticated, function(request, response) {
  response.render('index.ejs')
  //response.sendFile(__dirname + '/views/index.ejs')
});

app.post("/", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: true
}));

app.get('/home', ensureAuthenticated, function(request, response) {
  response.render('home.ejs', {
    firstname: request.user.firstName,
    lastname: request.user.lastName,
    email: request.user.email,
    gender: request.user.gender,
    country: request.user.country,
    city: request.user.city,
    birthdate: request.user.birthdate,
    isCompleted: request.user.isCompleted
  })

});

app.post('/home', function(req, res) {

  if (req.body.post) {
    var newPost = new PostModel({
      id: Date.now().toString(),
      firstName: "Yazid",
      lastName: "Mtkl",
      post: req.body.post,
      userId: "111111122222"
    });
    console.log(req.body)
    console.log(newPost)
    newPost.save(function(err) {
      if (!err) {
        req.flash('success_msg', 'Envoyé!')
        res.redirect('/home')
      } else {
        if (err.name == 'ValidationError') {
          req.flash('error_msg', 'Mauvaise requête.')
          res.redirect('/home')
        } else {
          req.flash('error_msg', 'Erreur interne.')
          res.redirect('/')
        }
      }
    });
  } else {
    res.send('Votre message est vide.')
  }
});

app.get('/logout', function(request, response) {
  request.logout();
  request.flash('sucess_msg', 'A plus tard!')
  response.redirect('/')

});

app.get('/updateProfile', function(req, res) {

  if (req.body.photo) {
    if (req.body.pseudo) {
      if (req.body.description) {
        var newPicture = new PictureModel();
        newPicture.img.data = fs.readFileSync(req.files.photo.path)
        newPicture.img.contentType = 'image/png';

        var query = {'profilePicture': req.user.profilePicture}
        User.findOneAndUpdate(query, newPicture, {upsert: true}, function(err, doc){
          if (err) return res.send(500, {error: err})
          return res.send('Sauvegardé.')
        })
      } else {
        req.flash('error_msg', 'Veuillez compléter votre biographie.')
        //res.redirect('/')
      }

    } else {
      req.flash('error_msg', 'Veuillez renseigner votre pseudonyme.')
      //res.redirect('/')
    }

  } else {
    req.flash('error_msg', 'Veuillez joindre une photo de profile.')
    //res.redirect('/')
  }
});
