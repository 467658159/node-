/**
 * Created by Administrator on 2017/8/3.
 */
const config = require('config-lite')(__dirname);
const mongoose = require('mongoose');
mongoose.connect(config.mongodb);

const db = mongoose.connection;
db.once('error',()=>console.log('Mongo connection error'));
db.once('open',()=>console.log('Mongo connection successfully'));

const Schema = mongoose.Schema;
exports.UserSchema = new Schema({
  username:{type:String,unique:true},
  password:{type:String},
  date:{type:Date,default:Date.now}
});
exports.PostSchema = new Schema({
  author:{type:Schema.Types.ObjectId,ref:'user'},
  title:{type:String},
  content:{type:String},
  postTime:{type:Date,default:Date.now},
  tags:{type:Array},
  cover:{type:String},
  intro:{type:String},
  pv:{type:Number},
  catg:{type:String}
});
exports.PostSchema.index({author:1,_id:-1});
const CommentSchema = new Schema({
  author:{type:Schema.Types.ObjectId,ref:'user'},
  postId:{type:Schema.Types.ObjectId,ref:'posts'},
  content:{type:String},
  date:{type:Date,default:Date.now}
});
CommentSchema.index({postsId:1,_id:-1});
CommentSchema.index({author:1,_id:-1});
exports.CommentSchema = CommentSchema;
