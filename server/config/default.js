/**
 * Created by Administrator on 2017/8/3.
 */
module.exports = {
  port:3000,
  session:{
    secret:'myFullStackBlog',
    key:'myFullStackBlog',
    maxAge:2592000000
  },
  mongodb:'mongodb://localhost:27017/fullstack-blog'
};
