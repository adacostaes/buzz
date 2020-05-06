const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = (req, res, next) => {
  bcrypt.hash(req.body.registerPassword, 10, function(err, hashedPass) {
    if(err) {
      res.json({
        error: err
      })
    }
  })

  let user = new User ({
    firstname: req.body.registerFirstName,
    lastname: req.body.registerLastName,
    password: hashedPass,
    gender: req.body.gender,
    country: req.body.country,
    city: req.body.city,
    birthdate: req.body.birthdate,
  })
  user.save()
  .then(user => {
    res.json({
      message: 'User added succesfully'
    })
  })
  .catch(error => {
    res.json({
      message: 'An error occured'
    })
  })
}

module.exports = {
  register
}
