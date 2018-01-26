/**
 * Created by Administrator on 2017/8/7.
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');
const multer = require('multer');

//封面图存储文件夹和文件名
const storage = multer.diskStorage({
  destination(req,file,cb){
    cb(null,'../static/images/upload')
  },
  filename(req,file,cb){
    cb(null,file.originalname)
  }
});
const upload = multer({storage});

//存储文章到数据库
const cpUpload = upload.fields([{ name: 'coverPic', maxCount: 1 }, { name: 'editorImg', maxCount: 20 }]);
router.post('/',cpUpload,(req,res,next)=>{
    let author = req.session.user._id;
    let title = req.body.title;
    let content = req.body.content;
    let tags = req.body.tags.split(',');
    let cover = '';
    let intro = req.body.intro;
    let pv = 0;
    let catg = req.body.catg;
    if(typeof req.files.coverPic !== 'undefined'){
      cover = req.files.coverPic[0].path.replace('..','');
    }
    let post = {author,title,content,cover,tags,intro,pv,catg};

    PostModel.createPost(post)
      .then(docs=>{
          res.json(docs._id);
        })
      .catch(next);
});

//富文本图片存储
router.post('/images',cpUpload,(req,res)=>{
  if (req.files.editorImg!== 'undefined'){
    res.json(req.files.editorImg[0].path.replace('..',''));
  }
});

//根据文章ID查找相应文章
router.get('/:postId',(req,res,next)=>{
  let postId = req.params.postId;
  let articleInfo = {
    postInfo:{},
    commentsInfo:{},
    siblingInfo:{}
  };
  PostModel.getPostById(postId)
    .then(docs=>{
      PostModel.incPv(postId);
      articleInfo.postInfo.title = docs.title;
      articleInfo.postInfo.postTime = docs.postTime;
      articleInfo.postInfo.author = docs.author.username;
      articleInfo.postInfo.view = docs.pv;
      articleInfo. postInfo.content = docs.content;
      articleInfo. postInfo.tags = docs.tags;
      if(req.session.user){
        articleInfo.postInfo.isAuthor = (docs.author._id.toString()===req.session.user._id);
      }else {
        articleInfo.postInfo.isAuthor = false;
      }

      articleInfo.commentsInfo.commentsAccount = 1;
      PostModel.getPrev(postId);  //找到上一篇文章
      return PostModel.getPrev(postId);
    })
    .then(getPrev=>{
        if (typeof getPrev[0] !== 'undefined' ){
          articleInfo.siblingInfo.prevTit = getPrev[0].title;
          articleInfo.siblingInfo.prevId = getPrev[0]._id;
        }else {
          articleInfo.siblingInfo.prevTit = '';
          articleInfo.siblingInfo.prevId = '';
        }
        return PostModel.getNext(postId) //找到下一篇文章
    })
    .then(getNext=>{
      if (typeof getNext[0] !== 'undefined' ){
        articleInfo.siblingInfo.nextTit = getNext[0].title;
        articleInfo.siblingInfo.nextId = getNext[0]._id;
      }else {
        articleInfo.siblingInfo.nextTit = '';
        articleInfo.siblingInfo.nextId = '';
      }
    })
    .then(()=>{
      res.json(articleInfo);
    })
    .catch(next);
});

//找到所有文章
router.get('/',(req,res,next)=>{
  getArticles({},req,res,next)
});

//找到对应用户的所有文章
router.get('/author/:userId',(req,res,next)=>{
  let author = {author:req.params.userId};
  getArticles(author,req,res,next)
});

//找到分类的文章
router.get('/catg/catgName',(req,res,next)=>{
  let query = {catg:req.query.catgName};
  getArticles(query,req,res,next)
});

//查找文章函数
function getArticles(condition,req,res,next) {
  let pageNum = 0;
  let curPage = parseInt(req.query.curPage-1);
  let pageShowNum = 5; //每页显示文章的篇数;
  PostModel.getPostsNum(condition)
    .then(doc=>{
      pageNum = Math.ceil(doc/pageShowNum);
    })
    .catch(next);
  PostModel.getPosts(condition,pageShowNum,curPage)
    .then(docs=>{
      let articles = {};
      articles.articlesArr = [];
      articles.pageNum = pageNum;
      docs.forEach(function (value) {
        let articleInfo = {};
        articleInfo.title = value.title;
        articleInfo.link = `/posts/${value._id}`;
        articleInfo.cover = value.cover;
        articleInfo.intro = value.intro;
        articleInfo.tags = value.tags;
        articleInfo.info = {};
        articleInfo.info.postTime = value.postTime;
        articleInfo.info.author = value.author.username;
        articleInfo.info.authorLink = `/author?author=${value.author._id}`;
        articleInfo.info.comments = {commentsAccount:1,commentsLink:''};
        articleInfo.info.view = value.pv;
        if(req.session.user){
          articleInfo.info.isAuthor = (value.author._id.toString()===req.session.user._id);
        }else {
          articleInfo.info.isAuthor = false;
        }
        articles.articlesArr.push(articleInfo)
      });
      res.json(articles);
    })
    .catch(next);
}

//编辑文章
router.get('/:postId/edit',(req,res,next)=>{
  let author = req.session.user._id;
  let postId = req.params.postId;
  PostModel
    .getPostById(postId)
    .then((docs)=>{
      let curArticleInfo = {};
      curArticleInfo.title = docs.title;
      curArticleInfo.content = docs.content;
      curArticleInfo.cover = docs.cover;
      curArticleInfo.intro = docs.intro;
      curArticleInfo.tags = docs.tags.join(',');
      curArticleInfo.catg = docs.catg;
      res.json(curArticleInfo)
    })
    .catch(next);
});

//编辑文章
router.post('/:postId/edit',cpUpload,(req,res,next)=>{
  let postId = req.params.postId;
  let author = req.session.user._id;
  let title = req.body.title;
  let content = req.body.content;
  let tags = req.body.tags.split(',');
  let cover = '';
  let intro = req.body.intro;
  let catg = req.body.catg;
  let post = {};
  if(typeof req.files.coverPic !== 'undefined'){
    cover = req.files.coverPic[0].path.replace('..','');
    post = {title,content,cover,tags,intro,catg};
  }else {
    post = {title,content,tags,intro,catg};
  }
  PostModel
    .updatePostById(postId,author,post)
    .then(docs=>{
      res.json(postId)
    })
    .catch(next);
});

//删除文章
router.get('/:postId/remove',(req,res,next)=>{
  let postId = req.params.postId;
  let author = req.session.user._id;
  PostModel
    .delPostById(postId,author)
    .then(docs=>{
      res.end();
    })
    .catch(next)
});

//侧边栏“最近更新”
// const sidebar =  require('../vitualData/sidebar');
router.get('/sidebar/latestNews',(req,res,next)=>{
  let sidebar = {
    personalInfo:{},
    sidebarList:{}
  };
  if (req.session.user && typeof req.session.user !== 'undefined' ){
    sidebar.personalInfo.username = req.session.user.username;
    sidebar.personalInfo.author = req.session.user._id;
  }else{
    sidebar.personalInfo.username =''
  }
  sidebar.personalInfo.tips = {flag:false, words:""};
  PostModel.getPosts({},5,0,{title:1})
    .then(docs=>{
      let catgLists = [];
      docs.forEach(function (value,index) {
        catgLists[index] = {};
        catgLists[index].title = value.title;
        catgLists[index].catgLink =`/posts/${value._id}`;
      });
      sidebar.sidebarList.catgLists = catgLists;
      res.send(sidebar)
    })
    .catch(next);
});

//侧边栏关键词搜索文章
router.get('/sidebar/search',(req,res,next)=>{
  let keywords = req.query;
  let reg = new RegExp(keywords.keywords,'i');
  let condition = {
    $or:[
      {title:{$regex:reg}},
      {intro:{$regex:reg}},
      {tags:{$regex:reg}},
      {content:{$regex:reg}}
    ]
  };
  getArticles(condition,req,res,next);
});

//近期评论
router.get('/sidebar/latestComment',(req,res,next)=>{
  CommentModel.getLatestComments({},{content:1,postId:1},5)
    .then(docs=>{
      let catgLists = [];
      docs.forEach(function (value,index) {
        catgLists[index] = {};
        catgLists[index].title = value.content.slice(0,30);
        catgLists[index].catgLink =`/posts/${value.postId}`;
      });
      res.json(catgLists)
    })
});

//创建评论
router.post('/:postId/comment',(req,res,next)=>{
  let comment = {};
  if(req.session.user){
    comment.author = req.session.user._id;
    comment.postId = req.params.postId;
    comment.content = req.body.comment;
    CommentModel.createComment(comment)
      .then(()=>{
        CommentModel.getComments(comment.postId)
          .then(docs=>{
            res.json(docs);
          })
      })
      .catch(next)
  }else {
    res.json('notLogin')
  }

});

//查找评论
router.get('/:postId/comment',(req,res,next)=>{
  let postId = req.params.postId;
    CommentModel.getComments(postId)
    .then(docs=>{
      res.json(docs);
    })
      .catch(next)
});

//删除评论
router.get('/:postId/comment/:commentId/remove',(req,res,next)=>{
  let commentId = req.params.commentId;
  let postId = req.params.postId;
  CommentModel.delComment(commentId)
    .then(()=>{
      CommentModel.getComments(postId)
        .then(docs=>{
          res.json(docs)
        })
        .catch(next);
    })
    .catch(next)
});

module.exports = router;
