var express = require('express')
// 拿到express框架路由
var router = express.Router();
// 获取mongoose对象
var mongoose = require('mongoose');
// 加载模型
var Goods = require('../models/goods');
var User = require('../models/user');

// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/ImoocMall');

// 检验是否连接成功
mongoose.connection.on('connected',()=>{
  console.log('MongoDB connected success.：连接成功')
})

mongoose.connection.on('error',()=>{
  console.log('MongoDB connected fail.：连接失败')
})

mongoose.connection.on('disconnected',()=>{
  console.log('MongoDB connected disconnected.：断开连接')
})

//  查询商品列表数据
router.get('/',(req,res,next)=>{
  // 接收前端参数：sort
  let sort = req.query.sort;
  // 接收前端参数：分页页码
  let page = parseInt(req.query.page);
  // 接收前端参数：分页一页多少条
  let pageSize = parseInt(req.query.pageSize);
  // 分页：跳过多少条
  let skip = (page-1)*pageSize;
  // 价格级别0(0-100),1(100-500),2(500-1000),3(1000-2000)
  let priceLevel = req.query.priceLevel;
  var priceGt = '',priceLte = ''
  let params = {};
  if (priceLevel != 'all'){
    switch (priceLevel) {
      case '0':priceGt = 0;priceLte = 100;break;
      case '1':priceGt = 100;priceLte = 500;break;
      case '2':priceGt = 500;priceLte = 1000;break;
      case '3':priceGt = 1000;priceLte = 2000;break;
    }
    params = {
      salePrice: {
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);// 查找所有数据.跳过多少条().一页多少条()
  // 对金额进行排序
  goodsModel.sort({'salePrice':sort});


  goodsModel.exec((err,doc)=>{
    if(err){// 查询失败
      res.json({
        status:'1',//状态：1
        msg:err.message
      })
    }else{// 查询成功
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,// 数据个数
          list:doc
        }
      })
    }
  });
})

// 加入购物车
router.post('/addCart',(req,res,next)=>{
  var userId = '100000077',productId = req.body.productId;

  // userId:查询条件
  User.findOne({userId:userId},(err,userDoc)=>{
    if (err) {
      res.json({
        status:'1',
        msg:err.message
      })
    }
    else{
      // console.log("userDoc:"+userDoc);
      if (userDoc){// 拿到用户信息后
        let goodsItem = ''
        userDoc.cartList.forEach((item,index)=>{
          if (item.productId == productId) {
            goodsItem = item;
            // 商品数量++
            item.productNum++;
            console.log(`商品名称：${item.productName}`+"  item.productNum:"+item.productNum)
          }
        });
        if(goodsItem){// 如果购物车存在此商品，保存
          userDoc.save((err2,doc2)=>{
            if (err2) {
              res.json({
                status:'1',
                msg:err2.message
              })
            }
            else {
              res.json({
                status:'0',
                msg:'',
                result: 'suc'
              })
            }
          })
        }
        else {
          // 通过productId匹配商品信息
          Goods.findOne({productId:productId},(err1,goodsDoc)=>{
            if (err1) {
              res.json({
                status:'1',
                msg:err1.message
              })
            }
            else{// 当前购物车不存在此商品
              if (goodsDoc) {
                // 坑： goodsDoc.productNum = 1;
                // 坑： goodsDoc.checked = 1;
                let goodsOrder={
                  "productId": goodsDoc.productId,
                  "productName": goodsDoc.productName,
                  "salePrice": goodsDoc.salePrice,
                  "productImage": goodsDoc.productImage,
                  "checked": "1",
                  "productNum": 1
                };
                // 将商品信息添加到cartList
                userDoc.cartList.push(goodsOrder);
                // 保存到MongoDB数据库
                userDoc.save((err3,doc2)=>{
                  if (err3) {
                    res.json({
                      status:'1',
                      msg:err3.message
                    })
                  }
                  else {
                    console.log('添加成功')
                    res.json({
                      status:'0',
                      msg:'',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })

})
module.exports = router;
