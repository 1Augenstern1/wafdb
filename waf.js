const express = require('express')
const app = express()
const port = 3000

const bodyparser = require('body-parser');
app.use(bodyparser())


app.all("*",function(req,res,next){
    // 设置允许跨域的域名,*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin','*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers','content-type');
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods','DELETE,PUT,POST,GET,OPTIONS');
    if(req.method.toLowerCase() == 'options')
        res.send(200); // 让options 尝试请求快速结束
    else
        next();
})
var router = require('./router/index')
app.use(router.router);
app.use(router.woll);
app.get('/', (req,res)=>res.send('Hello W'))
app.use(function(req,res,next){
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
})
app.use(function(err,req,res,next){
    console.error(err);
	res.status(err.status || 500)
	res.send(err.message);
})
app.listen(port,()=>console.log(`Example app listening on port ${port}!`))
