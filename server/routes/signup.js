/**
 * Created by Administrator on 2017/8/4.
 */
const express = require('express');
const sha1 = require('sha1');
const router = express.Router();
const UserModel = require('../models/users');

router.post('/',(req,res) => {
  let username = req.body.username;
  let password = sha1(req.body.password);
  let user = {username,password};
  UserModel.findUser({username}).then((docs)=>{
    if (docs){
      let personalInfo = {
        login:false,
        username:'',
        tips:{
          flag:true,
          words:'用户名已经存在'
        },
      };
      res.json(personalInfo)
    }else{
      UserModel.createUser(user).then((docs)=>{
        req.session.user = docs;
        let personalInfo = {
          login:true,
          username:docs.username,
          tips:{
            flag:true,
            words:'用户注册成功'
          },
          author:docs._id
        };
        res.json(personalInfo);
      });
    }
  });

});

module.exports = router;
