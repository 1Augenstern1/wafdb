var dbmodel = require("../model/dbmodel");
var User = dbmodel.User.model("Users");
var Webs = dbmodel.User.model("Webs");
var role = dbmodel.User.model("Roles");
var Log = dbmodel.User.model("Logs");
var Whiteips = dbmodel.User.model("Whiteips");
var Blackips = dbmodel.User.model("Blackips");
var login = function (req, res) {
  let { account, password } = req;
  User.find({ account, password })
    .then((users) => {
      if (users[0] != undefined) {
        res.send({ users });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
var logout = function (req, res) {
  res.send("logout");
};
var findweb = function (res) {
  Webs.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
    });
};
var userinfo = function (token, res) {
  var { token } = token;
  role
    .find({ token: token })
    .then((users) => {
      // 转换为对象
      res.send(users[0]);
    })
    .catch((err) => {
      console.error(err);
    });
};
// 管理员获取总用户api
var getUserinfo = function (req, res) {
  let { page, limit, searchObj } = req;
  page = Number(page);
  limit = Number(limit);
  console.log(searchObj);
  let skiptotal = (page - 1) * limit;
  // 当有搜索条件时候
  if (searchObj) {
    var c = 0;
    User.find({ name: searchObj })
      .count()
      .then((total) => {
        c = total;
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      User.find({ name: searchObj })
        .then((users) => {
          console.log(c);
          res.send({ total: c, users });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  } else {
    console.log("无条件搜索");
    User.find()
      .limit(limit)
      .skip(skiptotal)
      .then((users) => {
        User.find()
          .count()
          .then((total) => {
            res.send({ total: total, users });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
// 获取全部角色
var getRolesinfo = function (req, res) {
  let { page, limit, searchObj } = req;
  page = Number(page);
  limit = Number(limit);
  console.log(page, limit);
  console.log(searchObj);
  let skiptotal = (page - 1) * limit;
  // 当有搜索条件时候
  if (searchObj) {
    console.log("有搜索条件");
    var c = 0;
    role
      .find({ name: searchObj })
      .count()
      .then((total) => {
        c = total;
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      role
        .find({ name: searchObj })
        .then((roles) => {
          res.send({ total: c, roles });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  } else {
    console.log("无条件搜索");
    role
      .find()
      .limit(limit)
      .skip(skiptotal)
      .then((roles) => {
        role
          .find()
          .count()
          .then((total) => {
            res.send({ total: total, roles });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
// 根据id删除单个用户
var removeUserByid = function (req, res) {
  let { id } = req;
  console.log(id);
  User.deleteOne({ _id: id })
    .then((information) => {
      res.send("ok");
    })
    .catch((err) => {
      console.log(err);
    });
};
var removeUserBySelected = function (req, res) {
  for (let i = 0; i < req.length; i++) {
    User.deleteOne({ _id: req[i] })
      .then((information) => {})
      .catch((err) => {
        console.log(err);
      });
  }
  res.send("ok");
};
// 获取所有角色列表
var getRoles = function (req, res) {
  role
    .find()
    .then((rolesArr) => {
      console.log("getRoles success");
      res.send(rolesArr);
    })
    .catch((err) => {
      console.log(err);
    });
};
// 新增用户
var addUser = function (req, res) {
  let { roles } = req;

  role
    .find({ roles: [roles] })
    .then((role) => {
      console.log(role[0]);
      let ro = role[0];
      // 在当前状态下返回的数据较为怪异需要转化后才能使用
      let c = JSON.parse(JSON.stringify(ro));
      req["token"] = c.token;
      req["account"] = req.username;
      let userinfo = new User(req);
      userinfo.save();
      res.send("ok");
    })
    .catch((err) => {
      console.log(err);
    });
};
// 修改用户信息
var update = function (req, res) {
  // 查找对应的角色token
  var token = "";
  role
    .find({ roles: [req.roles] })
    .then((role) => {
      let ro = JSON.parse(JSON.stringify(role[0]));
      token = ro.token;
    })
    .then(() => {
      req.token = token;
      req.account = req.username;
      User.findOneAndUpdate({ _id: req._id }, { $set: req })
        .then((info) => {
          console.log(info);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// 修改角色
var assignRoles = function (req, res) {
  // 查找对应的角色token
  var token = "";
  role
    .find({ roles: [req.roles] })
    .then((role) => {
      let ro = JSON.parse(JSON.stringify(role[0]));
      token = ro.token;
    })
    .then(() => {
      req["token"] = token;
      User.findOneAndUpdate({ _id: req.userId }, { $set: req })
        .then((info) => {
          res.send("ok");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// 获取所有可访问的路由
var getAllRoutes = function (req, res) {
  role
    .find({ token: "abc" })
    .then((router) => {
      res.send(router);
    })
    .catch((err) => {
      console.log(err);
    });
};
// 新增或者修改一个角色
var addOrUpdateRole = function (req, res) {
  //  新增
  let roles = req.roles;
  req.roles = [];
  req.roles.push(roles);
  console.log(req);
  if (req.avatar == undefined) {
    req["role"] = req.name;
    req["avatar"] =
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";
    let newrole = new role(req);
    console.log(newrole);
    newrole.save();
    res.send("创建用户成功");
  }
  // 修改
  else {
    role
      .findOneAndUpdate({ _id: req._id }, { $set: req })
      .then((info) => {
        res.send("修改用户成功");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 删除单个角色通过id
};
var removeRoleById = function (req, res) {
  console.log(req);
  role
    .deleteOne({ _id: req.id })
    .then((role) => {
      res.send("删除角色成功");
    })
    .catch((err) => {
      console.log(err);
    });
};
var removeRoles = function (req, res) {
  console.log(req);
  for (let i = 0; i < req.length; i++) {
    role
      .deleteOne({ _id: req[i] })
      .then((information) => {})
      .catch((err) => {
        console.log(err);
      });
  }
  res.send("删除用户成功");
};

// 获取日志
// 取出日期
function gtime(str) {
  return Number(
    str.substring(0, 4) + str.substring(5, 7) + str.substring(8, 10)
  );
}
var getAlllogs = function (req, res) {
  let { page, limit, AttackType, selectTime } = req;
  page = Number(page);
  limit = Number(limit);
  let skiptotal = (page - 1) * limit;
  console.log("AttackType =", AttackType);
  console.log("selectTime =", selectTime);
  // 当有搜索条件时候
  if (AttackType || selectTime) {
    if (selectTime == undefined) {
      console.log("有搜索条件 有攻击类型无日期");
      // 查询异常访问
      if (AttackType == "Errlogs") {
        AttackType = { $ne: "Normal access" };
      }
      var c = 0;
      Log.find({ attack_method: AttackType })
        .count()
        .then((total) => {
          c = total;
        })
        .catch((err) => {
          console.log(err);
        });
      setTimeout(() => {
        Log.find({ attack_method: AttackType })
          .limit(limit)
          .skip(skiptotal)
          .then((logs) => {
            res.send({ total: c, logs });
          })
          .catch((err) => {
            console.log(err);
          });
      }, 100);
    }
    //无攻击条件有日期
    var gl, lt;
    if (selectTime) {
      gl = gtime(selectTime[0]);
      lt = gtime(selectTime[1]);
    }
    // Log.find({ timenumber: { $gte: gl, $lte: lt }}).then((log)=>{console.log(log)}).catch((err)=>{console.log(err)})
    if (AttackType == "") {
      console.log("noAttackType");
      Log.find({ timenumber: { $gte: gl, $lte: lt } })
        .count()
        .then((total) => {
          c = total;
        })
        .catch((err) => {
          console.log(err);
        });
      setTimeout(() => {
        Log.find({ timenumber: { $gte: gl, $lte: lt } })
          .limit(limit)
          .skip(skiptotal)
          .then((logs) => {
            res.send({ total: c, logs });
          })
          .catch((err) => {
            console.log(err);
          });
      }, 100);
    }
    if (AttackType && selectTime) {
      // 都有
      if (AttackType == "Errlogs") {
        AttackType = { $ne: "Normal access" };
      }
      console.log("douyou");
      Log.find({
        attack_method: AttackType,
        timenumber: { $gte: gl, $lte: lt },
      })
        .count()
        .then((total) => {
          c = total;
        })
        .catch((err) => {
          console.log(err);
        });
      setTimeout(() => {
        Log.find({
          attack_method: AttackType,
          timenumber: { $gte: gl, $lte: lt },
        })
          .limit(limit)
          .skip(skiptotal)
          .then((logs) => {
            res.send({ total: c, logs });
          })
          .catch((err) => {
            console.log(err);
          });
      }, 100);
    }
  } else {
    console.log("无条件搜索");
    Log.find()
      .limit(limit)
      .skip(skiptotal)
      .then((logs) => {
        Log.find()
          .count()
          .then((total) => {
            console.log(total);
            res.send({ total: total, logs });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
// 获取总访问数量
var getAllVisit = function (req, res) {
  let { VisitType } = req;
  console.log(req)
  console.log(VisitType);
  if (VisitType) {
    if (VisitType == "errLog") {
  
      VisitType = {$ne: "Normal access"}
      Log.find({attack_method:VisitType}).count().then((total)=>{
     res.send({total})
      }).catch(()=>{})
    } else {
    }
  } else {
    Log.find()
      .count()
      .then((total) => {
        res.send({ total });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
// var changedata = function(req,res){
//   Log.find().then((logs)=>{
//     var time = 1
//     var lgs = JSON.parse(JSON.stringify(logs))
//     // console.log(lgs)
//     var str,num,id
//     for(let i =0 ;i<logs.length;i++){
//       id = lgs[i]._id
//       str = lgs[i].local_time
//       num = Number(str.substring(0, 4) + str.substring(5, 7) + str.substring(8, 10))
//       lgs[i]['timenumber'] = num
//       Log.findOneAndUpdate({_id:id},{$set:{timenumber:num}}).then((ok)=>console.log("ok")).catch(err=>{console.log(err)})
//     }
//     // console.log(lgs)
//   }).catch((err)=>console.log(err))
// }

// 添加白名单
// 查找白名单
var getwhiteIPList = function (req, res) {
  let { page, limit, searchip } = req;
  page = Number(page);
  limit = Number(limit);
  console.log(page, limit);
  console.log(searchip);
  let skiptotal = (page - 1) * limit;
  console.log(page, limit, searchip);
  Whiteips.find()
    .then((data) => {
      console.log(data);
    })
    .catch();
  // 当有搜索条件时候
  if (searchip) {
    console.log("有搜索条件");
    var c = 0;
    Whiteips.find({ ip: searchip })
      .count()
      .then((total) => {
        c = total;
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      Whiteips.find({ ip: searchip })
        .then((roles) => {
          res.send({ total: c, roles });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  } else {
    console.log("无条件搜索");
    Whiteips.find()
      .limit(limit)
      .skip(skiptotal)
      .then((whiteiplist) => {
        Whiteips.find()
          .count()
          .then((total) => {
            res.send({ total: total, whiteiplist });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// 添加黑名单
var addblackIp = function (req, res) {
  let blackUser = new Blackips(req);
  blackUser.save();
  res.send("ok");
};
// 查找黑名单
var getblackIPList = function (req, res) {
  let { page, limit, searchip } = req;
  page = Number(page);
  limit = Number(limit);
  console.log(page, limit);
  console.log(searchip);
  let skiptotal = (page - 1) * limit;
  // 当有搜索条件时候
  if (searchip) {
    console.log("有搜索条件");
    var c = 0;
    Blackips.find({ ip: searchip })
      .count()
      .then((total) => {
        c = total;
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      Blackips.find({ ip: searchip })
        .then((blackiplist) => {
          res.send({ total: c, blackiplist });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  } else {
    console.log("无条件搜索");
    Blackips.find()
      .limit(limit)
      .skip(skiptotal)
      .then((blackiplist) => {
        Blackips.find()
          .count()
          .then((total) => {
            res.send({ total: total, blackiplist });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
// 删除黑名单
var removeBlackById = function (req, res) {
  let { _id } = req;
  Blackips.deleteOne({ _id })
    .then((information) => {
      res.send(information);
    })
    .catch((err) => {
      console.log(err);
    });
};
var removeBlackIps = function (req, res) {
  let { _id } = req;
  for (let i = 0; i < _id.length; i++) {
    console.log(i);
    Blackips.deleteOne({ _id: _id[i] })
      .then((information) => {
        console.log(information);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  res.send("ok");
};
var addwhiteIp = function (req, res) {
  let whiteUser = new Whiteips(req);
  whiteUser.save();
  res.send("ok");
};

// 删除白名单用户通过id
var removeWhiteById = function (req, res) {
  let { _id } = req;
  Whiteips.deleteOne({ _id })
    .then((information) => {
      res.send(information);
    })
    .catch((err) => {
      console.log(err);
    });
};
var removeWhiteIps = function (req, res) {
  let { _id } = req;
  for (let i = 0; i < _id.length; i++) {
    console.log(i);
    Whiteips.deleteOne({ _id: _id[i] })
      .then((information) => {
        console.log(information);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  res.send("ok");
};
module.exports = {
  login,
  findweb,
  logout,
  userinfo,
  getUserinfo,
  removeUserByid,
  removeUserBySelected,
  getRoles,
  addUser,
  update,
  assignRoles,
  getRolesinfo,
  getAllRoutes,
  addOrUpdateRole,
  removeRoleById,
  removeRoles,
  getAlllogs,
  getAllVisit,
  getwhiteIPList,
  addwhiteIp,
  removeWhiteById,
  removeWhiteIps,
  getblackIPList,
  addblackIp,
  removeBlackById,
  removeBlackIps,
  //changedata
};