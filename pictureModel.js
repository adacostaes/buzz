var mongoose = require('mongoose');



const Picture = new mongoose.Schema(
  { img:
      { data: Buffer, contentType: String }
  }
);
var PictureModel = mongoose.model('Picture', Picture);

module.exports = Picture
