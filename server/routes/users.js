var express = require('express');
var router = express.Router();

require('./../util/util');

let User = require('./../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function (req, res, next) {
  res.send('respond with a resource');
});

// 登录接口
router.post('/login', (req, res, next) => {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  console.log(req.body.userName);

  User.findOne(param, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    }
    else {
      if (userDoc) {
        res.cookie('userId', userDoc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', userDoc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        // req.session.user = userDoc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: userDoc.userName
          }
        })
      }
    }
  })
})

// 登出接口
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

// 登录效验
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    })
  }
  else {
    res.json({
      status: '',
      msg: '未登录',
      result: ''
    })
  }
})

// 获取购物车数量
router.get("/getCartCount",(req,res,next)=>{
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId; // 获取用户ID
    User.findOne({userId:userId},(err,doc)=>{// 获取用户信息
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }
      else{
        let cartList = doc.cartList; // 获取购物车列表
        let cartCount = 0;
        cartList.map((item)=>{
          cartCount += parseInt(item.productNum);// 获取每条商品数量
        })
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        })
      }
    })
  }
})

// 查询当前用户的购物车数据
router.get('/cartList', (req, res, next) => {
  var userId = req.cookies.userId;

  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})


// 购物车删除
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId, productId = req.body.productId;

  User.update({ "userId": userId },
    {
      $pull: {
        'cartList': {
          'productId': productId
        }
      }
    }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }
      else {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    });
});

// 修改商品数量
router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;

  // 通过用户ID 、 商品ID 修改商品数量
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 修改商品选中状态
router.post("/editCheckAll", function (req, res, next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({ userId: userId }, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        })
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1, message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        })
      }
    }
  });
});

// 查询用户地址接口
router.get("/addressList", (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})

// 设置默认地址接口
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is unll',
      result: ''
    })
  }
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else {
      let addressList = doc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        }
        else {
          item.isDefault = false;
        }
      });
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        }
        else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          })
        }
      })
    }
  })
})

// 删除地址接口
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;

  User.update({
    userId: userId
  }, {
      $pull: {
        'addressList': {
          'addressId': addressId
        }
      }
    }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }
      else {
        res.json({
          status: '0',
          msg: '',
          result: ''
        })
      }
    });
})

// 生成订单接口
router.post('/payMent', (req, res, next) => {
  let userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;

  User.findOne({userId:userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else {
      let address = '',goodsList = [];
      // 获取当前用户的地址信息
      doc.addressList.forEach((item)=>{
        if(addressId == item.addressId){
          address = item;
        }
      });
      
      // 获取用户购物车的购买商品
      doc.cartList.filter((item)=>{
        if(item.checked == '1'){
          goodsList.push(item);
        }
      })

      // 生成订单ID
      let platfrom = '662'
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = platfrom + r1 + sysDate + r2;
      
      
      // 创建订单
      let order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
     };

      // 将订单插入数据库中进行保存，如果保存成功将返回订单ID、订单中金额
      doc.orderList.push(order);

      doc.save((err1,doc1)=>{
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        }
        else{
          res.json({
            status: '0',
            msg: '',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })
    }
  })
})

// 根据订单ID查询订单信息
router.get('/orderDetail',(req,res,next)=>{
  let userId = req.cookies.userId,
      orderId = req.param("orderId");
  
  User.findOne({userId:userId},(err,userInfo)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else{
      // 获取数据库中的订单信息
      let orderList = userInfo.orderList;
      if(orderList.length > 0){
        let orderTotal =  0;
        // 通过订单ID进行比对获取订单的总金额
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        // 如果订单总金额大于0，将返回订单ID、订单总金额
        if(orderTotal > 0 ){
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }
        else{
          res.json({
            status: '120002',
            msg: '无此订单',
            result: ''
          })
        }
      }
      else{
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        })
      }
    }
  })
})
module.exports = router;
