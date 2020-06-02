var mongoose = require('mongoose');

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
  },
  profilePictureURL: {
    type: String,
    default: ""
  },
  alias: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    maxlength: 200,
    default: ""
  },
  isCompleted: {
    type: Boolean,
    default: false
<<<<<<< HEAD
=======
  },
  lastUpdated: {
    type: String,
    default: Date.now
>>>>>>> 1bdde7b926a5a6c9170b63230b47ae26d1316927
  }
})

var UserModel = mongoose.model('User', userSchema)
module.exports = UserModel
