/**
 * Created by Administrator on 2017/8/30.
 */
const mongoose = require('mongoose');
mongoose.promise = global.promise;
const CommentSchema = require('../lib/mongo.js').CommentSchema;
const CommentModel = mongoose.model('comments',CommentSchema);

module.exports = {
  createComment:(comment)=>{
    return CommentModel
      .create(comment)
  },
  getComments:(postId)=>{
    return CommentModel
      .find({postId:postId})
      .populate('author',['_id','username'])
      .sort({_id:1})
      .exec()
  },
  getLatestComments:(condition,projection,size)=>{
    return CommentModel
      .find(condition,projection)
      .limit(size)
      .sort({_id:-1})
      .exec()
  },
  delComment:(commentId)=>{
    return CommentModel
      .remove({_id:commentId})
      .exec()
  },
};
