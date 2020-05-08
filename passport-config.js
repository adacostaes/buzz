const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const UserModel = require('./userModel')


function getUserByEmail(email) {
  var email = req.body.email
  console.log(email)
  UserModel.findOne({
    email: email
  })
};

function initialize(passport, getUserByEmail, getUserById) {

  /*const authenticateUser = async (email, password, done) => {
    const user = UserModel.findOne({
        email: email
      })
    if (user == null) {
      return done(null, false, {
        message: 'Cet e-mail n\'est lié à aucun utilisateur.'
      })
    }

    try {
      if (await bcrypt.compare(password, user.password, function(err, result){

      })) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: 'Le mot de passe est incorrect.'
        })
      }
    } catch (err) {
      return done(err)
    }
  }*/

  passport.use(new LocalStrategy({
          usernameField: 'email'
        }, (email, password, done) => {
          // voir si l'@ mail est dans la base
          UserModel.findOne({
              email: email
            })
            .then(user => {
              if (!user) {
                return done(null, false, {
                    message: 'Cet -email n\'est lié à aucun utilisateur.'})
                  }
                  // voir si les mdp matchent
                  bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err

                    if(isMatch){
                      return done(null, user)
                    } else {
                      return done(null, false, {message: 'Mot de passe incorrect.'})
                    }
                  })
                })
              .catch(err => console.log(err))
            })
          )

            passport.serializeUser(function(user, done){
              done(null, user.id)
            })

            passport.deserializeUser(function (id, done){
          UserModel.findById(id, function(err, user) {
            done(err, user)
          })
        })
      }

      module.exports = initialize
