var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var produtSchema =  new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice": Number,
  "productImage": String,
  "checked":String,
  "productNum":Number
})

// 坑：默认会加s进行查找，第三个参数指定数据库
module.exports = mongoose.model('Good',produtSchema)
