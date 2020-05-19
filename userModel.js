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
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
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
  }
})

var UserModel = mongoose.model('User', userSchema)
module.exports = UserModel
