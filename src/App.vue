<template>
  <div id="app">
    <header class="vc-header">
      <nav class="navbar navbar-default">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#vmenu">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <router-link to="/"><h1 class="vc-logo">个人博客</h1></router-link>
          </div>
          <div class="collapse navbar-collapse" id="vmenu">
            <ul id="menu-victheme" class="nav navbar-nav navbar-right">
              <li @click="toHome" :class="{active:$route.path=='/'}">
                <a href="javascript:void(0)">首页</a>
              </li>
              <li @click="article" :class="{active:$route.path=='/article'}">
                <a href="javascript:void(0)">心情</a>
              </li>
              <li @click="front" :class="{active:$route.path=='/front'}">
                <a href="javascript:void(0)">前端</a>
              </li>
              <li @click="server" :class="{active:$route.path=='/server'}">
                <a href="javascript:void(0)">后端</a>
              </li>
              <li @click="share" :class="{active:$route.path=='/share'}">
                <a href="javascript:void(0)">干货</a>
              </li>
              <li @click="about" :class="{active:$route.path=='/about'}">
                <a href="javascript:void(0)">关于</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <div class="container vc-container">
      <transition>
        <router-view></router-view>
      </transition>
    </div>

    <footer class="vc-footer">
      <div class="vc-footer-info">
        <ul class="vc-footer-menu">
          <li><a class="vc-a" href="#"><i class="fa fa-weixin"></i>shenxiangan2009</a>
          </li>
          <li><a class="vc-a" target="_blank" href="http://weibo.com/u/1553193602"><i class="fa fa-weibo"></i></a>
          </li>
          <li><a class="vc-a" target="_blank" href="https://github.com/467658159"><i class="fa fa-github"></i></a>
          </li>
        </ul>
      </div>
      <div class="vc-footer-copyright">
        <div> Copyright &copy; 2017 <a class="vc-a" href="http://www.codedancer.cn">安安</a>
        </div>
        Powered by <a class="vc-a" href="#">安安</a> &bull; 没得备案号         </div>
      <div class="backtop" title="返回顶部" ></div>
    </footer>
  </div>
</template>

<script>
  import jquery from './static/js/jquery.min.js'
  import bootstrap from './static/js/bootstrap.js'
  import base from './static/js/base.js'
export default {
  name: 'app',
  methods:{
    toHome:function () {
      this.$router.push('/');
    },
    article:function () {
      this.$router.push('/article');
    },
    front:function () {
      this.$router.push('/front');
    },
    server:function () {
      this.$router.push('/server');
    },
    share:function () {
      this.$router.push('/share');
    },
    about:function () {
      this.$router.push('/about');
    }
  }
}
</script>

<style>
  @import "./static/css/bootstrap.min.css";
  @import "./static/css/font-awesome.min.css";
  @import "./static/css/rewrite-bootstrap.css";
  @import "static/css/style.css";
  .ql-editor{
    background:#fff;
  }
</style>
