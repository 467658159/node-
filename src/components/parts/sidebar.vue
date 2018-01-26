<template>
  <div class='col-md-3'>
    <div class='panel panel-default'>
      <div class='panel-body'>
        <div class="form-group">
          <input type="search" v-model.trim="keywords" @keyup.enter="search" name="s" id="s" class="form-control" placeholder="Get what you want..." />
        </div>
      </div>
    </div>
    <!--登录注册-->
    <div class="panel panel-default vc-panel" v-if="personalInfo.login">
      <div class="welcome">
        欢迎你，{{personalInfo.username}}
        <a href="javascript:void (0)" class="pull-right" @click="signout">退出</a>
      </div>
      <a href="javascript:void(0)" @click="toMyArticles">我的文章</a>
      <a href="javascript:void(0)" @click="postArticles" class="pull-right">发表文章</a>
    </div>
    <div class="login form-group" v-else>
      <div class="login-box" v-if="loginBox">
        <input placeholder="用户名" class="form-control" type="text" v-model.trim="user.username" @keyup.enter="login">
        <input placeholder="密码" class="form-control" type="password" v-model.trim="user.password" @keyup.enter="login">
        <p class="tips"  v-show="personalInfo.tips.flag">{{personalInfo.tips.words}}</p>
        <div>
          <a href="javascript:void(0)" class="registerBtn pull-left" @click="toggleLogin">没有账号？点击<b>注册</b></a>
          <button class="btn btn-default loginBtn pull-right" @click="login">登录</button>
        </div>
      </div>
      <div class="register-box" v-else>
        <input placeholder="用户名" class="form-control" type="text" v-model.trim="user.username" @keyup.enter="register">
        <input placeholder="密码" class="form-control" type="password" v-model.trim="user.password" @keyup.enter="register">
        <input placeholder="请重复密码" class="form-control" type="password" v-model.trim="user.rePassword" @keyup.enter="register">
        <p class="tips"  v-show="personalInfo.tips.flag">{{personalInfo.tips.words}}</p>
        <div>
          <a href="javascript:void(0)" class="registerBtn pull-left" @click="toggleLogin">已有账号？点击<b>登录</b></a>
          <button class="btn btn-default loginBtn pull-right" @click="register">注册</button>
        </div>
      </div>
    </div>
    <!--登录注册end-->

    <div class="panel panel-default vc-panel"  v-for="catg in catgs">
      <h4 class="vc-widget-title">{{catg.catgTit}}</h4>
      <ul>
        <li v-for="catgList in catg.catgLists">
          <a :href="catgList.catgLink">{{catgList.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default{
    name:'sidebar',
    data(){
          return {
              keywords:'',
              loginBox:false,
              user:{
                username:'',
                password:'',
                rePassword:''
              },
              personalInfo:{
                login:false,
                username:"",
                tips:{}
              },
              catgs:[
                {"catgTit":"近期文章","catgLists":[]},
                {"catgTit":"近期评论","catgLists":[]},
                {"catgTit":"文章分类","catgLists":[{
                    "title":"首页",
                    "catgLink":"/"
                  }, {
                    "title":"心情",
                    "catgLink":"/article"
                  }, {
                    "title":"前端",
                    "catgLink":"/front"
                  }, {
                    "title":"后端",
                    "catgLink":"/server"
                  }, {
                    "title":"干货",
                    "catgLink":"/share"
                  },
                ]}, {
                  "catgTit":"友情链接","catgLists":[{
                    "title":"中国知网",
                    "catgLink":"http://www.cnki.net"
                  }, {
                    "title":"重庆工商大学",
                    "catgLink":"http://www.ctbu.edu.cn"
                  }
                ]},
              ]
          }
      },
    mounted:function () {
      this.$nextTick(()=>{
        this.sidebarView()
      })
    },
    methods:{
      sidebarView () {
        this.$http.get('/api/posts/sidebar/latestNews').then( res => {
            console.log('sidebar内容',res);
          this.personalInfo = res.data.personalInfo;
          this.catgs[0].catgLists = res.data.sidebarList.catgLists;
          this.personalInfo.username?this.personalInfo.login=true:this.personalInfo.login=false;
        })
          .catch(error=>{
            console.log(error)
          });
        this.$http.get('/api/posts/sidebar/latestComment').then(res => {
            this.catgs[1].catgLists = res.data;
        })
          .catch(error=>{
            console.log(error)
          })
      },
      search(){
        this.$http.get('/api/posts/sidebar/search').then(res=>{
          let query = this.keywords;
            this.$router.push(`/search?keywords=${query}`);
            this.$router.go(0)
        })
          .catch(error=>{
            console.log(error)
          })
      },
      toggleLogin () {
        this.loginBox = !this.loginBox
      },
      register () {
        let user = this.user;
        if(!user.username||!user.password||!user.rePassword){
          this.personalInfo.tips.flag=true;
          this.personalInfo.tips.words = "用户名密码不能为空";
        }else if(user.password !== user.rePassword){
          this.personalInfo.tips.flag=true;
          this.personalInfo.tips.words = "前后密码不一致";
        }else{
          this.personalInfo.tips.flag = false;
          this.$http.post('/api/signup',user)
            .then(res=>{
              this.$set(this,'personalInfo',res.data);
              if (this.$route.path === '/'){
                this.$router.go(0);
              }else{
                this.$router.push('/')
              }
            })
            .catch(error=>{
              console.log(error)
            });
        }
      },
      login () {
        let user = {};
        user.username = this.user.username;
        user.password = this.user.password;
        this.$http.post('/api/signin',user)
          .then(res=>{
            if(res.data){
              this.$set(this,'personalInfo',res.data);
              if (this.$route.path === '/'){
                this.$router.go(0);
              }else{
                  this.$router.push('/')
              }
            }else{
              this.personalInfo.tips.flag=true;
              this.personalInfo.tips.words='用户名密码错误';
            }
        })
          .catch(error=>{
              console.log(error)
          })
      },
      signout(){
          this.$http.get('/api/signout').then(res =>{
            if (res.status === 200){
              this.personalInfo.login=false;
              if (this.$route.path === '/'){
                this.$router.go(0);
              }else{
                this.$router.push('/')
              }
            }
          })
            .catch(error=>{
              console.log(error)
            })
      },
      toMyArticles(){
          this.$router.push({
            path:'/author',
            query:{
              author:this.personalInfo.author
            }
          });
        this.$router.go(0)
      },
      postArticles(){
          if (typeof this.$route.params.postId !== 'undefined'){
            this.$router.push({path:'/edit'});
            this.$router.go(0);
          }else{
            this.$router.push({path:'/edit'});
          }
      }
    },
    watch:{
        '$route'(to,from){
          console.log(to,from);
        }
    }
  }
</script>
<style scoped>
 .welcome{
   padding: 0px 0px 3px 0px;
   border-bottom: 1px solid #eee;
   margin-bottom: 5px;
   color: #61B59E;
 }
  .registerBtn{
    font-size: 12px;
    color: #999;
    margin:15px 0px 0px 0px;
  }

  .loginBtn{
    margin-top:8px;;
  }
 .btn-default{
   background-color: #efefef;
 }
  .tips{
    margin-bottom: 0px;
    color: #F96F6F;
    margin-top: 2px;
  }
</style>
