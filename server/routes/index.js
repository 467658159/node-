/**
 * Created by Administrator on 2017/8/3.
 */

//路由
module.exports = app =>{
  app.get('/api/catg',(req,res)=>{
    res.send(catg)
  });
  app.use('/api/signup',require('./signup'));
  app.use('/api/signin',require('./signin'));
  app.use('/api/signout',require('./signout'));
  app.use('/api/posts',require('./posts'));
};
