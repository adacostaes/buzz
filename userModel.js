var mongoose = require('mongoose');

function toLower(str) {
  return str.toLowerCase();
}

const userSchema = new mongoose.Schema({
  id: {
    type: String
  },
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
module.exports = UserModel
