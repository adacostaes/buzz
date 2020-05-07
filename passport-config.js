const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
var getUserByEmail = require('./userController')


getUserByEmail(req, res, next) {
  var email = req.body.email;
  UserModel.findOne({
    email: email
  }, function(err, data) {
    if (err) {
      next.ifError(err);
    }
    res.send({
      status: true,
      data: data
    });
    return next();
  });
};

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    console.log(getUserByEmail('r@r'))
    if (user == null) {
      return done(null, false, {
        message: 'Cet e-mail n\'est lié à aucun utilisateur.'
      })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: 'Le mot de passe est incorrect.'
        })
      }
    } catch (err) {
      return done(err)
    }
  }

  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize
