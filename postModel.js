var mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  id: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  post: {
    type: String
  },
  postImage: {
    type: String,
  },
  userId: {
    type: String,
  },
  createdOn: {
    type: String,
    default: Date.now
  }
})

var PostModel = mongoose.model('Post', postSchema)
module.exports = PostModel
