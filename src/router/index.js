import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import main from '@/components/main'
import article from '@/components/article'
import front from '@/components/front'
import server from '@/components/server'
import share from '@/components/share'
import about from '@/components/about'
import single from '@/components/single'
import edit from '@/components/edit'
import author from '@/components/author'
import searchResult from '@/components/searchResult'

Vue.use(VueAxios,axios);
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component:main
    },{
      path:'/article',
      component:article
    },{
      path:'/front',
      component:front
    },{
      path:'/server',
      component:server
    },{
      path:'/share',
      component:share
    },{
      path:'/about',
      component:about
    },{
      path:'/posts/:postId',
      component:single
    },{
      path:'/edit',
      component:edit
    },{
      path:'/author',
      name:'author',
      component:author
    },{
      path:'/posts/:postId/edit',
      component:edit
    },{
      path:'/search',
      name:'search',
      component:searchResult
    }
  ]
})
