const { reset } = require("nodemon");
var dbmodel = require("../model/dbmodel");
var User = dbmodel.User.model("Users");
var Webs = dbmodel.User.model("Webs");
var role = dbmodel.User.model("Roles");
var Log = dbmodel.User.model("Logs");
var Whiteips = dbmodel.User.model("Whiteips");
var Blackips = dbmodel.User.model("Blackips");
var Rule = dbmodel.User.model("Rules");
const express = require("express");
const fs = require("fs");
const path = require("path");
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
  console.log(req);
  let UserExists = false;
  User.find({ name: req.username })
    .then((user) => {
      console.log("user", user);
      if (user[0] != undefined) {
        UserExists = true;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  setTimeout(() => {
    // 角色不存在才创建
    if (UserExists == false) {
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
          res.send("用户创建成功");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.send("创建失败，用户已存在");
    }
  }, 300);
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
          res.send("用户信息修改成功");
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
  let roledata = req.role
  let newrole = roledata;
  let add = req.add;
  let RoleExists = false;
  // 检查新增的用户是否已经存在
  if (add) {
    role.find({ name: newrole.name })
      .then((ro) => {
        if (ro[0] != undefined) {
          console.log('存在了')
          RoleExists = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  console.log("newrole =", newrole)
  newrole["roles"] = [roledata.roles];
  console.log(roledata)


  setTimeout(() => {
    if (RoleExists == false) {
      if (newrole.avatar == undefined) {
        console.log('新建')
        // newrole["role"] = req.name;
        newrole["avatar"] =
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";
        let nerole = new role(newrole);
        console.log("newrole",nerole);
        nerole.save();
        res.send("创建用户成功");
      }
      // 修改
      else {
        console.log('修改')
        role
          .findOneAndUpdate({ _id: newrole._id }, { $set: newrole })
          .then((info) => {
            res.send("修改用户成功");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      res.send("创建用户失败，用户已存在");
    }
  }, 300);

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
// 获取月份天数
function getMonthLength(year, month) {
  return new Date(year, month, 0).getDate();
}
// 计算百分比
function percent(a, b) {
  if (a == 0 && b == 0) {
    return 0;
  }
  if (a == 0) {
    a = 1;
  }
  if (b == 0) {
    b = 1;
  }
  console.log("a是=", a, "b是", b);
  var trend = "";

  var precent = (Number(a) / Number(b)) * 10000;
  var round = Math.round(precent) / 100;

  if (a > b) {
    // 增加
    round = round - 100;
    trend = "add";
  } else {
    round = 100 - round;
    trend = "down";
  }
  round = round.toFixed(2);
  var res = round + "%";
  var obj = {
    res: res,
    trend: trend,
  };
  return obj;
}

var getAlllogs = function (req, res) {
  let { page, limit, AttackType, selectTime, searchIp } = req;
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
      Log.find({
        client_ip: searchIp ? searchIp : { $exists: true },
        attack_method: AttackType,
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
          client_ip: searchIp ? searchIp : { $exists: true },
          attack_method: AttackType,
        })
          .sort({ _id: -1 })
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
    if (AttackType == "") {
      console.log("noAttackType");
      Log.find({
        client_ip: searchIp ? searchIp : { $exists: true },
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
          client_ip: searchIp ? searchIp : { $exists: true },
          timenumber: { $gte: gl, $lte: lt },
        })
          .sort({ _id: -1 })
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
        client_ip: searchIp ? searchIp : { $exists: true },
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
          client_ip: searchIp ? searchIp : { $exists: true },
          attack_method: AttackType,
          timenumber: { $gte: gl, $lte: lt },
        })
          .sort({ _id: -1 })
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
    Log.find({ client_ip: searchIp ? searchIp : { $exists: true } })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skiptotal)
      .then((logs) => {
        Log.find({ client_ip: searchIp ? searchIp : { $exists: true } })
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
// 获取访问数量 有无日期和数量都能处理
var getAllVisit = function (req, res) {
  let { VisitType, times } = req;
  // 返回数量
  let c;
  // 返回变化量
  let percentage = 0;
  let contrast = "";
  // 有搜索条件
  if (VisitType || times) {
    // 有条件无日期时候
    if (times == undefined) {
      console.log("有条件没日期");
      // 异常条件时候
      if (VisitType == "Errlogs") {
        console.log("err");
        VisitType = { $ne: "Normal access" };
        Log.find({ attack_method: VisitType })
          .count()
          .then((total) => {
            res.send({ total });
          })
          .catch(() => {});
      } else {
        Log.find({ attack_method: VisitType })
          .count()
          .then((total) => {
            res.send({ total });
          })
          .catch(() => {});
      }
    }
    var gl, lt, days; // gt是选着时间的开始 lt是选着时间的结束 days是相差天数
    var glo, lto; // glo是对比的时间开始 lto是对比的时间结束
    var da; //上个月的天数
    if (times) {
      // 有时间限制没有搜索条件
      var startdate = Number(times[0].substring(8, 10)); // 开始日
      var enddate = Number(times[1].substring(8, 10)); // 结束日
      var startmonth = times[0].substring(5, 7); //开始月
      var endmonth = times[1].substring(5, 7); //结束月
      var startyear = times[0].substring(0, 4); //开始年
      var endyear = times[1].substring(0, 4); //结束年
      // 获取上个月天数
      gl = gtime(times[0]);
      lt = gtime(times[1]);
      if (startmonth == endmonth) {
        // 月份时长
        da = getMonthLength(startyear, startmonth - 1);
        // 选取时间段
        days = enddate - startdate;
        // 当选着的时间不在同一个月份时
      } else {
        da = getMonthLength(startyear, startmonth);
  
        days = da - startdate + enddate;
      }
      console.log("startmonth = ", startmonth, "endmonth =", endmonth);
      console.log("startdate = ", startdate, "enddate =", enddate);
      console.log("days = ", days);
    }
    console.log("gl 和 lt", gl, lt);
    // 假如选择的是某一天
    if (days == 0) {
      glo = gl;
      lto = lt;
      contrast = "与上一天相比访问变化";
    }
    // 假如选择的是小于一个月份的时间
    if (
      startdate < days ||
      enddate < days ||
      startmonth != endmonth ||
      days <= 27
    ) {
      // 对比的开始时间往前推了一个月
      if (startdate <= days) {
        console.log("1");
        glo = da - (days - startdate) - 1;
          startmonth = "0" + (startmonth - 1);
      } else {
      // 还在当月
        glo = startdate - days - 1;
      }
      if (enddate <= days) {
      // 对比的开始和结束时间都往前退一个月
        console.log("2");
        lto = da - (days - enddate) - 1;
          endmonth = "0" + (endmonth - 1);
      } else {
        lto = enddate - days - 1;
      }
      if (glo == 0 && startmonth<11) {
        glo = da;
        startmonth = "0" + (startmonth - 1);
      }
      if (lto == 0 && endmonth<11) {
        lto = da;
        endmonth = "0" + (endmonth - 1);
      }
      if(glo < 10){
        glo = '0' +glo
      }
      if(lto < 10){
        lto = '0' +lto
      }
      console.log("下雨一星期内的 glo 和 lto", glo, lto);
      console.log(
        "下雨一星期内的 startmonth 和 endmonth",
        startmonth,
        endmonth
      );
      glo = Number(startyear + startmonth + glo);
      lto = Number(endyear + endmonth + lto);
      console.log("下雨一星期内的 glo 和 lto", glo, lto);
      if (days == 6) {
        contrast = "与上一周相比访问变化";
      } else {
        contrast = "与上一段时间相比访问变化";
      }
    } else {
      glo = gl;
      lto = lt;
    }
    if (days > 27 && days < 1100) {
      // 本月
      console.log("本月");
      var year = times[0].substring(0, 4);
      var month =
        times[0].substring(5, 6) + (Number(times[0].substring(6, 7)) - 1);
      days = getMonthLength(year, month);
      glo = gl - Number(1 + times[0].substring(8, 10));
      lto = gl + days;
      contrast = "与上一月相比访问变化";
    }
    if (days > 1100) {
      // 本年
      glo = Number(Number(times[0].substring(0, 4) - 1) + "0101");
      lto = Number(Number(times[0].substring(0, 4) - 1) + "1231");
      console.log(glo, lto);
      contrast = "与上一年相比访问变化";
    }
    // 有时间没有攻击类型的搜索结果
    if (VisitType == "") {
      // console.log("noAttackType");
      // 这段时间的访问量
      // console.log("gl =", gl, "lt =", lt, "glo =", glo, "lto =", lto);
      Log.find({ timenumber: { $gte: gl, $lte: lt } })
        .count()
        .then((total) => {
          // console.log("没有攻击条件这段时间访问量 = ", total)
          c = total;
        })
        .catch((err) => {
          console.log(err);
        });
      //  上一段时间访问量
      // console.log("gl =", gl, "lt =", lt, "glo =", glo, "lto =", lto);
      setTimeout(() => {
        Log.find({
          timenumber: { $gte: glo, $lte: lto },
        })
          .count()
          .then((total) => {
            percentage = percent(c, total);
            var value = percentage.res;
            var trend = percentage.trend;
            console.log("数值是 =", value, "趋势是", trend);
            // console.log("无条件有时间上一段访问量 =" + total);
            res.send({ total: c, contrast, value, trend });
          })
          .catch((err) => {
            console.log(err);
          });
      }, 50);
    }
    // 两种条件都有时
    if (VisitType && times) {
      if (VisitType == "Errlogs") {
        VisitType = { $ne: "Normal access" };
      }
      // 当前日志数量
      // console.log("gl =", gl, "lt =", lt, "glo =", glo, "lto =", lto);
      Log.find({
        attack_method: VisitType,
        timenumber: { $gte: gl, $lte: lt },
      })
        .count()
        .then((total) => {
          // console.log("两个都有时间和类型错误 =", total);
          c = total;
        })
        .catch((err) => {
          console.log(err);
        });
      // 对比日志数量
      // console.log("gl =", gl, "lt =", lt, "glo =", glo, "lto =", lto);
      setTimeout(() => {
        Log.find({
          attack_method: VisitType,
          timenumber: { $gte: glo, $lte: lto },
        })
          .count()
          .then((total) => {
            // console.log("都有错误对比上回" + total);
            percentage = percent(c, total);
            var value = percentage.res;
            var trend = percentage.trend;
            console.log("数值是 =", value, "趋势是", trend);
            res.send({ total: c, contrast, value, trend });
          })
          .catch((err) => {
            console.log(err);
          });
      }, 50);
    }
  } else {
    // 无条件
    // console.log("无条件");
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
        .then((whiteiplist) => {
          res.send({ total: c, whiteiplist });
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

// 查找规定时间段内的攻击数
var getlogranking = function (req, res) {
  let { time } = req;
  let arr = [];
  let Monthstart = [];
  let Monthend = [];
  let strat = gtime(time[0]);
  let end = gtime(time[1]);
  console.log("strat = ", strat, "end=", end);
  let days = end - strat;
  let Res = new Array(days);
  let AttackType = { $ne: "Normal access" };
  if (days <= 31) {
    for (let i = 0; i <= days; i++) {
      arr.push(strat + i);
    }
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      Log.find({ attack_method: AttackType, timenumber: arr[i] })
        .count()
        .then((count) => {
          console.log(i);
          Res[i] = count;
        })
        .catch((err) => console.log(res));
    }
  } else {
    let year = time[0].substring(0, 4);
    for (let i = 1; i < 13; i++) {
      Monthstart.push(Number(year + "0" + i + "01"));
      Monthend.push(Number(year + "0" + i + "31"));
    }
    for (let i = 0; i < 12; i++) {
      Log.find({
        attack_method: AttackType,
        timenumber: { $gte: Monthstart[i], $lte: Monthend[i] },
      })
        .count()
        .then((count) => {
          console.log(count);
          Res[i] = count;
        })
        .catch((err) => console.log(res));
    }
    arr = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
  }

  setTimeout(() => {
    res.send({ errdata: Res, time: arr });
  }, 100);
};
var getAttckranking = function (req, res) {
  let { time, Type } = req;
  let gl = gtime(time[0]);
  let lt = gtime(time[1]);
  let Attcktype = new Array(7);
  let Res = new Array(7);
  for (let i = 0; i < Type.length; i++) {
    Log.find({ attack_method: Type[i], timenumber: { $gte: gl, $lte: lt } })
      .count()
      .then((count) => {
        Attcktype[i] = Type[i];
        Res[i] = count;
      })
      .catch((err) => console.log(res));
  }
  setTimeout(() => {
    res.send({ Attckdata: Res, AttcktypeArr: Attcktype });
  }, 100);
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

// 查找触发的规则排名

var getRuleRangking = function (req, res) {
  Log.aggregate([
    {
      $group: {
        _id: "$rule_tag",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 7,
    },
  ])
    .then((obj) => {
      console.log(obj);
      res.send(obj);
    })
    .catch((err) => {
      console.log(err);
    });
};
// 查找访问ip的次数
var getvisitIp = function (req, res) {
  Log.aggregate([
    {
      $group: {
        _id: "$client_ip",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 100,
    },
  ])
    .then((obj) => {
      console.log(obj);
      res.send(obj);
    })
    .catch((err) => {
      console.log(err);
    });
};

// 查找规则表
var getRuleList = function (req, res) {
  let { page, limit, RuleType, searchRule } = req;
  page = Number(page);
  limit = Number(limit);
  console.log(page, limit);
  console.log(RuleType);
  let skiptotal = (page - 1) * limit;
  // 当有搜索条件时候
  console.log(searchRule);
  if (searchRule) {
    console.log("有搜索条件");
    var c = 0;
    Rule.find({ RuleType: RuleType, rule: searchRule })
      .count()
      .then((total) => {
        c = total;
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      Rule.find({ RuleType: RuleType, rule: searchRule })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skiptotal)
        .then((Rululist) => {
          res.send({ total: c, Rululist });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  } else {
    let b = 0;
    Rule.find({ RuleType: RuleType })
      .count()
      .then((total) => {
        b = total;
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      Rule.find({ RuleType: RuleType })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skiptotal)
        .then((Rululist) => {
          res.send({ total: b, Rululist });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  }
};
// 添加规则
var putRule = function (req, res) {
  let { arr } = req;
  let RuleExists = false;
  Rule.find({ RuleType: arr.RuleType, rule: arr.rule })
    .then((res) => {
      console.log(res[0]);
      if (res[0] != undefined) {
        RuleExists = true;
      }
    })
    .catch(() => {});
  setTimeout(() => {
    console.log(RuleExists);
    // 规则已经存在
    if (RuleExists == true) {
      res.send("新建错误，规则已经存在");
    } else {
      re = new Rule(arr);
      re.save();
      res.send("规则新建成功");
    }
  }, 300);
};
//
var putRules = function (req, res) {
  let { Rules } = req;
  console.log(Rules);
  let RuleExists = false;
  let name = Rules.textname;
  const filePath = path.join(__dirname, "..", "uploads", "frist.txt");
  fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.log(err);
      res.send("读取文件失败,请查看上传文件名字是否符合要求");
    } else {
      const lines = data.split("\n");
      const newArray = lines.map((line) => line.trim()); // 假设您需要去除每行的空格
      for (let i = 0; i < newArray.length; i++) {
        Rule.find({ RuleType: Rules.RuleType, rule: newArray[i] })
        .then((res) => {
          if(res[0] == undefined){   
            Rules['rule'] = newArray[i]
            re = new Rule(Rules);
            console.log(re)
            re.save();
          }
        })
        .catch((err) => {console.log(err)});
      }
      res.send("规则集新建成功")
    }
  });
};
var removeRuleByid = function (req, res) {
  let { id } = req;
  Rule.deleteOne({ _id: id })
    .then((information) => {
      res.send(information);
    })
    .catch((err) => {
      console.log(err);
    });
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
  getlogranking,
  getAttckranking,
  getRuleRangking,
  getvisitIp,
  getRuleList,
  putRule,
  putRules,
  removeRuleByid,
  //changedata
};
