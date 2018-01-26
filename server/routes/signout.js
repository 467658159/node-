/**
 * Created by Administrator on 2017/8/7.
 */
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  req.session.user = null;
  res.json(req.session.user);
});

module.exports = router;
