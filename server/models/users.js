/**
 * Created by Administrator on 2017/8/8.
 */
const mongoose = require('mongoose');
const UserSchema = require('../lib/mongo').UserSchema;

const UserModel = mongoose.model('user',UserSchema);
module.exports = {
  createUser:(user)=>{
    return UserModel.create(user);
  },
  findUser:(user)=>{
    return UserModel.findOne(user).exec();
  }
};
