var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/test1')
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.info("连接数据库WAF打开成功")
});
module.exports = db
