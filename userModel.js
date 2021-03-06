var mongoose = require('mongoose');
const friends = require("mongoose-friends")

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
  },
  lastUpdated: {
    type: String,
    default: Date.now
  }
})

var UserModel = mongoose.model('User', userSchema.plugin(friends()))
module.exports = UserModel