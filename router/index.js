const express = require("express");
const app = express();
var dbserver = require("../dao/dbserver");
var router = express.Router();
var woll = express.Router();

router.get("/test", (req, res) => res.send("this is test"));
// 登录传递信息检测数据库内容
router.post("/login", (req, res) => {
  console.log('1231231')
  console.log(req.body)
  dbserver.login(req.body,res);

});
router.post("/logout", (req, res) => {
  // const { username, password } = req.body;
  console.log(req.body)
  dbserver.logout(req.body,res);
});
router.get("/userinfo", (req, res) => {
  dbserver.userinfo(req.query,res)
});
// admin查找存在用户
router.get("/getPageList", (req, res) => {
  console.log("getPageList")
  dbserver.getUserinfo(req.query,res)
});
// 搜索或者渲染角色列表
router.get("/getRolesinfo", (req, res) => {
  console.log("getRolesinfo")
  dbserver.getRolesinfo(req.query,res)
});
// 查找角色列表
router.get("/getRoles", (req, res) => {
  console.log("getRoles")
  dbserver.getRoles(req.query,res)
});
// 删除单个用户
router.delete("/removeById", (req, res) => {
  console.log("removeById")
  console.log(req.body)
  dbserver.removeUserByid(req.body,res)
});
// 删除选中用户
router.delete("/removeUsers", (req, res) => {
  console.log("removeUsers")
  dbserver.removeUserBySelected(req.body,res)
});
// 新增用户
router.post("/addUser", (req, res) => {
  console.log('addUSer')
  dbserver.addUser(req.body,res);
});
// 新增或者修改一个角色
router.post("/addOrUpdateRole", (req, res) => {
  console.log('addOrUpdateRole')
  dbserver.addOrUpdateRole(req.body,res);

});
// 修改一个用户
router.post("/update", (req, res) => {
  console.log('update')
  dbserver.update(req.body,res);
});
router.post("/assignRoles", (req, res) => {
  console.log('assignRoles')
  dbserver.assignRoles(req.body,res);
});
// 获取所有可以访问的路由
router.get("/getAllRoutes", (req, res) => {
  console.log('getAllRoutes')
  dbserver.getAllRoutes(req,res);
});
// 删除一个角色
router.delete("/removeRoleById", (req, res) => {
  console.log("removeRoleById")
  dbserver.removeRoleById(req.body,res)
});
router.delete("/removeRoles", (req, res) => {
  console.log("removeRoleById")
  dbserver.removeRoles(req.body,res)
});

// 获取日志
router.get("/getAlllogs", (req,res)=>{
  console.log('getAlllogs')
  dbserver.getAlllogs(req.query,res)
})

// router.get("/changedata", (req,res)=>{
//   console.log('changedata')
//   dbserver.changedata(req.query,res)
// })

// 获取总访问数量
router.get("/getAllVisit", (req,res)=>{
  console.log('getAllVisit')
  dbserver.getAllVisit(req.query,res)
})

// 添加白名单
router.post("/addwhiteIp" , (req,res)=>{
  console.log('addwhiteIp')
  dbserver.addwhiteIp(req.body,res)
})
// 删除黑名单
router.delete("/removeBlackById", (req, res) => {
  console.log("removeBlackById")
  dbserver.removeBlackById(req.body,res)
});
router.delete("/removeBlackIps", (req, res) => {
  console.log("removeBlackIps")
  dbserver.removeBlackIps(req.body,res)
});
// 查找白名单
router.get("/getwhiteIPList", (req,res)=>{
  console.log('getwhiteIPList')
  dbserver.getwhiteIPList(req.query,res)
})
// 删除白名单用户通过id
router.delete("/removeWhiteById", (req, res) => {
  console.log("removeWhiteById")
  dbserver.removeWhiteById(req.body,res)
});
router.delete("/removeWhiteIps", (req, res) => {
  console.log("removeWhiteIps")
  dbserver.removeWhiteIps(req.body,res)
});
// 添加黑名单
router.post("/addblackIp" , (req,res)=>{
  console.log('addblackIp')
  dbserver.addblackIp(req.body,res)
})
// 查找黑名单
router.get("/getblackIPList", (req,res)=>{
  console.log('getblackIPList')
  dbserver.getblackIPList(req.query,res)
})

// router.get("/getblack_IPList", (req,res)=>{
//   console.log('getblack_IPList')
//   dbserver.getblack_IPList(req.query,res)
// })


// 查找规定时间段内的攻击数
router.get("/getlogranking", (req,res)=>{
  console.log('getlogranking')
  dbserver.getlogranking(req.query,res)
})
// 查找规定时间段内各种攻击数类型与排行
router.get("/getAttckranking", (req,res)=>{
  console.log('getAttckranking')
  dbserver.getAttckranking(req.query,res)
})

module.exports = {
  router,
  woll,
};

  // const fakeUserinfo1 = {
   
  //   routes: [
  //     "Attr",
  //     "Test2",
  //     "test1",
  //     // "ActivityAdd",
  //     // "我不会啊",
  //     // "CouponEdit",
  //     // "OrderShow",
  //     // "312312",
  //     // "1111",
  //     // "haha1",
  //     // "5555",
  //     // "扳回一局",
  //     // "btn",
  //     // "33",
  //     // "ss",
  //     // "qwer",
  //     // "爱是短视丢好",
  //     // "怎么加不上",
  //     // "Acl",
  //     // "0311212",
  //     // "dasdasdasd",
  //     "Test1",
  //     // "后悔何及",
  //     "test2",
  //     // "lolo",
  //     // "发货单号给发",
  //     // "666",
  //     // "545",
  //     // "达到啊",
  //     // "为求翁群",
  //     // "打算电饭锅",
  //     // "qwdwqd",
  //     // "的",
  //     // "羊儿的重名难以想象",
  //     // "dgSDGSDXvgggggggg",
  //     // "12345678",
  //     // "00000",
  //     // "rrbebebaaa",
  //     // "2222222222",
  //     // "686868",
  //     // "GGSGSDGdSGhhhhhhhhhhh",
  //     "Test",
  //     // "www",
  //     // "2222",
  //     // "aaaaaaafafaf",
  //     // "lala",
  //     // "我不好",
  //     // "Refunddasdasd",
  //     // "Spu",
  //     // "6666",
  //     // "王琪琪yyds",
  //     // "牛逼普洛斯",
  //     // "胡丢暗红色的啊啊",
  //     // "7878",
  //     // "不牛逼1123123123123",
  //     // "34外大事话",
  //     // "Order",
  //     // "bhgbgfdvcdxt",
  //     // "55",
  //     // "new",
  //     "log",
  //     "Log",
  //     // "66666",
  //     // "Orderdasdasd",
  //     // "Role",
  //     // "RoleAuth",
  //     // "大叔大婶",
  //     // "测试修改",
  //     // "TinyMCE",
  //     // "3444",
  //     // "ghgjh",
  //     // "敲代码11",
  //     // "66",
  //     // "44444",
  //     // "User",
  //     // "Category",
  //     // "AGGSDDSgSgfffff",
  //     // "vhygtdf",
  //     // "bybnjmkl",
  //     // "王琪琪",
  //     // "vynhyes",
  //     // "333",
  //     // "ddddd",
  //     // "3333",
  //     // "7777",
  //     // "达到大萨达",
  //     // "就看看闭包",
  //     // "Component",
  //     // "UserList",
  //     // "ClientUser",
  //     // "FileUpload",
  //     // "Coupon",
  //     // "我最我i解耦i都",
  //     // "31312313",
  //     // "21212",
  //     // "595959595",
  //     // "嗷嗷",
  //     // "vdvd",
  //     // "发发发",
  //     // "6666666666",
  //     // "addddddd",
  //     // "3466",
  //     // "敲代码",
  //     // "12345",
  //     // "OrderList",
  //     "Sku",
  //     "AAAAAA",
  //     "';lkjhgfcx",
  //   ],
  //   buttons: [
  //     "cuser.detail",
  //     "cuser.update",
  //     "cuser.delete",
  //     "btn.User.add",
  //     "btn.User.remove",
  //     "btn.User.update",
  //     "btn.User.assgin",
  //     "btn.Role.assgin",
  //     "btn.Role.add",
  //     "btn.Role.update",
  //     "btn.Role.remove",
  //     "btn.Permission.add",
  //     "btn.Permission.update",
  //     "btn.Permission.remove",
  //     "btn.Activity.add",
  //     "btn.Activity.update",
  //     "btn.Activity.rule",
  //     "btn.Coupon.add",
  //     "btn.Coupon.update",
  //     "btn.Coupon.rule",
  //     "btn.OrderList.detail",
  //     "btn.OrderList.Refund",
  //     "btn.UserList.lock",
  //     "btn.Category.add",
  //     "btn.Category.update",
  //     "btn.Category.remove",
  //     "btn.Trademark.add",
  //     "btn.Trademark.update",
  //     "btn.Trademark.remove",
  //     "btn.Attr.add",
  //     "btn.Attr.update",
  //     "btn.Attr.remove",
  //     "btn.Spu.add",
  //     "btn.Spu.addsku",
  //     "btn.Spu.update",
  //     "btn.Spu.skus",
  //     "btn.Spu.delete",
  //     "btn.Sku.updown",
  //     "btn.Sku.update",
  //     "btn.Sku.detail",
  //     "btn.Sku.remove",
  //     "123",
  //     "BSbbhhhhhhhhhhh",
  //     "aababbabbaaa",
  //     "1231231",
  //     "ClientUser",
  //     "热热热荣荣",
  //     "1",
  //     " 而非我",
  //     "预约驱蚊器",
  //     "dvd",
  //     "ss",
  //     "阿斯顿",
  //     "11",
  //     "的附属国豆腐干",
  //     "3232",
  //     "btn.Attr.FenPei",
  //     "4",
  //     "btn.Add1",
  //     "btn.Add2",
  //     "Test3",
  //     "btn.cangku.add",
  //     "btn.cangku.detele",
  //   ],
  //   roles: ["平台管理员"],
  //   name: "admin",
  //   avatar:
  //     "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
  // }

