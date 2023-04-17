var mongoose = require('mongoose');
var db = require('../conf/db');
var Schema = mongoose.Schema;

// 用户集合
var SchemaUser = new Schema({
	username: { type: String },
	roles:{type:String},
	account: { type: String },
	password: { type: String },
	phone: { type: Number },
	token: {type: String}
})
var webs = new Schema({

})
// 角色集合
var roles = new Schema({
	role:{type:String},
	token:{type:String},
	routes:{type:Array},
	roles:{type:Array},
	name:{type:String},
	avatar:{type:String}
})
var logs = new Schema({
	client_ip:{type:String},
	local_time:{type:String} ,
	server_name:{type:String} ,
	user_agent:{type:String} ,
	attack_method:{type:String} ,
	req_url:{type:String} ,
	req_data:{type:String} ,
	rule_tag:{type:String} ,
	timenumber:{type:Number, get: v => parseFloat(v).toFixed(2),
		set: v => parseFloat(v).toFixed(2)} 
})
var whiteips = new Schema({
	ip:{type:String},
	setuser:{type:String},
	settime:{type:String},
})
var blackips = new Schema({
	ip:{type:String},
	setuser:{type:String},
	settime:{type:String},
})
var rules = new Schema({
	setuser:{type:String},
	RuleType:{type:String},
	settime:{type:String},
	rule:{type:String}
})
var User = db.model('Users', SchemaUser)
var Webs = db.model('Webs', webs)
var Roles = db.model('Roles',roles)
var Logs = db.model('Logs',logs)
var Whiteips = db.model('Whiteips',whiteips)
var Blackips = db.model('Blackips',blackips)
var Rules = db.model('Rules',rules)
module.exports = {
	User,
	Webs,
	Roles,
	Logs,
	Whiteips,
	Blackips,
	Rules
}