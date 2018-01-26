
/**
 * Created by Administrator on 2017/8/11.
 */
const mongoose = require('mongoose');
mongoose.promise = global.promise;
const PostSchema = require('../lib/mongo').PostSchema;
const PostModel = mongoose.model('posts',PostSchema);

module.exports = {
  createPost:(post)=>{
    return PostModel.create(post);
  },
  getPostById:(postId)=>{
    return PostModel
      .findOne({_id:postId})
      .populate('author')
      .exec()
  },
  getPostsNum:(option)=>{
    return PostModel
      .count(option)
      .exec()
  },
  getPosts:(conditions,size,count,projection)=>{
    return PostModel
      .find(conditions,projection)
      .populate('author')
      .sort({_id:-1})
      .limit(size)  //限制查找到的条数
      .skip(count*size)  //跳过多少条
      .exec()
  },
  getPrev:(postId)=>{
    return PostModel
      .find({'_id':{'$lt':postId}})
      .sort({_id:-1})
      .limit(1)
  },
  getNext:(postId)=>{
    return PostModel
      .find({'_id':{'$gt':postId}})
      .sort({_id:1})
      .limit(1)
  },
  incPv:(postId)=>{
    return PostModel
      .update({_id:postId},{$inc:{pv:1}})
      .exec()
  },
  updatePostById:(postId,author,data)=>{
    return PostModel
      .update({author:author,_id:postId},{$set:data})
      .exec()
  },
  delPostById:(postId,author)=>{
    return PostModel
      .remove({author:author,_id:postId})
      .exec()
  },
};
