/**
 * Created by Administrator on 2017/8/7.
 */
const express = require('express');
const sha1 = require('sha1');
const router = express.Router();

const userModel = require('../models/users');

router.post('/',(req,res)=>{
  let user = req.body;
  user.password = sha1(user.password);

  userModel.findUser(user)
    .then(docs=>{
      if(docs){
        req.session.user = docs;
        let personalInfo = {
          login:true,
          username:docs.username,
          tips:{
            flag:true,
            words:''
          },
          author:docs._id
        };
        res.json(personalInfo);
      }else{
        res.end()
      }
    });
});

module.exports = router;
