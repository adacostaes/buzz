const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const cookieParser = require('cookie-parser');

const {
  ensureAuthenticated
} = require('./auth')
const {
  ensureNotAuthenticated
} = require('./noauth')
const initializePassport = require('./passport-config')
const multer = require('multer')

// Stockage image
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, callback) {
    callback(null, req.user.email + path.extname(file.originalname))
  }
})
const storagePostImage = multer.diskStorage({
  destination: './imagesPost/',
  filename: function (req, file, callback) {
    callback(null, req.user.alias + Date.now().toString() + path.extname(file.originalname))
  }
})

// Initialisation upload
const upload = multer({
  storage: storage,
  limits: {
    filesize: 2000000
  },
  fileFilter: function (req, file, callback) {
    checkFileType(file, callback);
  }
}).single('photo')

const uploadPostImage = multer({
  storage: storagePostImage,
  limits: {
    filesize: 2000000
  },
  fileFilter: function (req, file, callback) {
    checkFileType(file, callback);
  }
}).single('customFile')

// Check extension image
function checkFileType(file, callback) {

  // Extensions acceptées
  const filetypes = /jpeg|jpg|png|gif/;

  // Vérification
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return callback(null, true)
  } else {
    callback('Erreur, le fichier n\'est pas une image.')
  }
}



var UserModel = require('./userModel')
var PostModel = require('./postModel')

var LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 5000




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


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')))

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/imagesPost', express.static(path.join(__dirname, '/imagesPost')));

app.use(cors())

// PASSPORT

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

const mongoURI = 'mongodb://localhost:27017/buzzzdb'

mongoose
  .set('useUnifiedTopology', true)
  .connect(
    mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
  }
  )
  .then(() => console.log('MongoDB connecté.'))
  .catch(err => console.log('Erreur: ' + err))

server.listen(port, function () {
  console.log('Le serveur tourne sur le port: ' + port)
})

app.get('/register', ensureNotAuthenticated, function (request, response) {
  response.render('register.ejs')
});

function capital_letter(str) {
  str = str.split(" ");

  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }

  return str.join(" ");
}

app.post('/register', ensureNotAuthenticated, function (req, res) {

  if (req.body.firstname && req.body.lastname && req.body.email && req.body.password && req.body.confirmPwd && req.body.gender && req.body.city) {
    if (req.body.password == req.body.confirmPwd) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
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
          newUser.save(function (err) {

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

app.get('/', ensureNotAuthenticated, function (request, response) {
  response.render('index.ejs')
});

app.post("/", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: true
}));

app.get('/home', ensureAuthenticated, function (request, response) {

  PostModel.find({}).lean().sort({ createdOn: -1 }).exec(function (err, post) {
    if (err) throw err;
    UserModel.find({}).lean().exec(function (err2, result) {
      if (err2) throw err2;
      var currentUser = request.user;

      UserModel.getFriends(currentUser, function (err, friendships) {
        if (err) {
          console.log(err);
        }
        else {

          response.render('home.ejs', {
            id: request.user.id,
            firstname: request.user.firstName,
            lastname: request.user.lastName,
            email: request.user.email,
            gender: request.user.gender,
            country: request.user.country,
            city: request.user.city,
            birthdate: request.user.birthdate,
            isCompleted: request.user.isCompleted,
            alias: request.user.alias,
            profilePictureURL: request.user.profilePictureURL,
            description: request.user.description,
            friendships: friendships,
            posts: post,
            users: result
          });
        }
      });
    });
  });
});

app.post('/home', ensureAuthenticated, function (req, res) {

  uploadPostImage(req, res, function (err) {
    if (err) {
      req.flash('error_msg', 'Une erreur est survenue. Vérifiez l\'extension du fichier.')
      res.redirect('/home')
    } else if (req.file) {

      var newPostImage = new PostModel({
        id: Date.now().toString(),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        postImage: "../imagesPost/" + req.file.filename,
        userId: req.user.id
      });
      newPostImage.save(function (err) {
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
    } else if (req.body.post && !req.file) {

      var newPost = new PostModel({
        id: Date.now().toString(),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        post: req.body.post,
        userId: req.user.id
      });
      newPost.save(function (err) {
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
    }
  });/*else {
    res.send('Votre message est vide.')
  }*/
});

aliasConnected = [];

io.on('connection', function (socket) {

  socket.on('new user', function (data, callback) {

    if (aliasConnected.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.usernameConnected = data;
      aliasConnected.push(socket.usernameConnected);
      socket.emit('usernames', aliasConnected);
    }

    //socket.broadcast.emit("send message", data);
  });

  function updateAlias() {
    socket.emit('usernames', aliasConnected);
  }

  socket.on('send message', function (data) {
    socket.broadcast.emit("send message", data);
    socket.emit("send message", data);
  });

  socket.on('disconnect', function (data) {
    if (socket.usernameConnected) return;
    aliasConnected.splice(aliasConnected.indexOf(socket.uesernameConnected), 1);
    updateAlias();
  });


});

app.get('/logout', function (request, response) {
  request.logout();
  request.flash('sucess_msg', 'A plus tard!')
  response.redirect('/')

});

app.post('/confirmProfile', ensureAuthenticated, function (req, res) {

  upload(req, res, function (err) {
    if (err) {
      req.flash('error_msg', 'Une erreur est survenue. Vérifiez l\'extension du fichier.')
      res.redirect('/home')
    } else {
      if (req.file) {
        if (req.body.pseudo) {
          if (req.body.description) {

            var id = req.user._id

            UserModel.findOne({
              _id: id
            }, function (err, foundObject) {
              if (err) {
                req.flash('error_msg', 'Une erreur est survenue.')
                res.redirect('/home')
              } else {

                if (!foundObject) {
                  req.flash('error_msg', 'Objet non trouvé..')
                  res.redirect('/home')
                } else {
                  trimmedAlias = req.body.pseudo
                  foundObject.alias = trimmedAlias.replace(/\s/g, "")
                  foundObject.description = req.body.description
                  foundObject.profilePictureURL = "../uploads/" + req.file.filename
                  foundObject.isCompleted = true
                  foundObject.lastUpdated = Date.now()

                  foundObject.save(function (err, updatedObject) {
                    if (err) {
                      req.flash('error_msg', 'Une erreur est survenue lors de l\'enregistrement. Veuillez recommencer.')
                      res.redirect('/home')
                    } else {
                      req.flash('success_msg', 'Vous avez complété votre profil avec succès.')
                      res.redirect('/home')
                    }
                  })

                }
              }
            })

          } else {
            req.flash('error_msg', 'Veuillez compléter votre biographie.')
            res.redirect('/home')
          }
        } else {
          req.flash('error_msg', 'Veuillez renseigner votre pseudonyme.')
          res.redirect('/home')
        }
      } else {
        req.flash('error_msg', 'Veuillez joindre une photo de profil.')
        res.redirect('/home')
      }
    }
  })
});

// Profil utilisateur


app.get("/profile/:id", ensureAuthenticated, function (req, res) {

  var currentUser = req.user;

  UserModel.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err)
      req.flash('error_msg', 'Utilisateur non trouvé.')
      res.redirect('/home')
      return
    } else {
      UserModel.getFriends(currentUser, function (err, friendships) {
        if (err) {
          console.log(err);
        }
        else {
          res.render('profile.ejs', { user: foundUser, req: req, friendship: friendships })
        }

      })
    }
  })
})

app.post("/updateProfile", ensureAuthenticated, function (req, res) {

  upload(req, res, function (err) {
    if (err) {
      req.flash('error_msg', 'Une erreur est survenue. Vérifiez l\'extension du fichier.')
      res.redirect('/home')
    } else {
      var id = req.user._id

      UserModel.findOne({
        _id: id
      }, function (err, foundObject) {
        if (err) {
          req.flash('error_msg', 'Une erreur est survenue.')
          res.redirect('/home')
        } else {

          if (!foundObject) {
            req.flash('error_msg', 'Objet non trouvé..')
            res.redirect('/home')
          } else {

            var str = "Vous avez mis à jour les champs suivants: "

            if (req.file) {
              foundObject.profilePictureURL = "../uploads/" + req.file.filename
              str += "Photo de profil  "
            }

            if (req.body.updateCity) {
              foundObject.city = req.body.updateCity.trim()
              str += "Ville "
            }

            if (req.body.updateDescription) {
              foundObject.description = req.body.updateDescription
              str += "Description "
            }

            if (req.body.updatePassword != "" && req.body.updatePasswordConfirmation != "") {
              if (req.body.updatePassword == req.body.updatePasswordConfirmation) {

                const password = req.body.updatePassword
                const saltRounds = 10;

                const hashedPassword = bcrypt.hashSync(password, saltRounds);

                foundObject.password = hashedPassword
                str += "Mot de passe "
              }
            }

            foundObject.lastUpdated = new Date()

            foundObject.save(function (err, updatedObject) {
              if (err) {
                req.flash('error_msg', 'Une erreur est survenue lors de l\'enregistrement. Veuillez recommencer.')
                res.redirect('/home')
              } else {
                req.flash('success_msg', str)
                res.redirect('/home')
              }
            })

          }
        }
      })
    }
  })
});

app.get("/addAsFriend/:id", ensureAuthenticated, function (req, res) {

  UserModel.requestFriend(req.user.id, req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      req.flash('success_msg', 'Vous venez d\'effectuer une demande d\'ami.')
      res.redirect('/home')
    }
  });
})

app.get("/removeFriend/:id", ensureAuthenticated, function (req, res) {
  var currentUser = req.user;
  var conditions = { "_id": req.params.id };
  UserModel.findOne(conditions)
    .then(user => {
      var friendUser = user;
      // Friend remove
      console.log(friendUser)
      console.log(currentUser)
      UserModel.removeFriend(currentUser, friendUser, (err, result) => {
        if (err) {
          res.send(500);
        }
        else {
          req.flash('success_msg', 'Vous venez de retirer ' + friendUser.alias + ' de vos amis.')
          res.redirect('/home')
        }
      });
    })
})

app.post("/search", ensureAuthenticated, function (req, res) {

  if (req.body.search) {

    searchedUser = req.body.search
    var conditions = { "alias": searchedUser };

    UserModel.findOne(conditions).exec(function (err, foundUser) {
      if (err){
        console.log(err)
      } else if (!foundUser) {
        req.flash('error_msg', 'L\'utilisateur '+ searchedUser +' n\'éxiste pas.')
        res.redirect('/home')
      }
      res.render('search.ejs', { foundUser: foundUser })
    });
  } else {
    req.flash('error_msg', 'Vous n\'avez pas remplit le champ de recherche.')
    res.redirect('/home')
  }
});