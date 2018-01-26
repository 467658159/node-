<template>
  <div class="row">
    <div class="col-sm-12 col-md-9">
      <div class="panel panel-default">
        <article class="vc-blog">
          <p class="pull-right refactor" v-if="postInfo.isAuthor">
            <a :href="`/posts/${$route.params.postId}/edit`">编辑</a>
            <a href="javascript:void(0)" :data-link="`/posts/${$route.params.postId}/`" @click="removeArticle">删除</a></p>
          <h1 class="vc-blog-title">{{postInfo.title}}</h1>
          <p class="vc-author-info">
            <time>{{postInfo.postTime | formatTime}}</time> &bull;
            <span>{{postInfo.author}}</span> &bull;
            <span> {{postInfo.view}} 次浏览</span>
          </p>
          <div class="vc-blog-content" v-html="postInfo.content"></div>
          <span class="vc-tags"><a v-for="tag in postInfo.tags">{{tag}}</a></span>
          <div class="vc-copyright">
            本站文章除注明原创外，均为转载文章。
          </div>
        </article>
      </div>
      <nav>
        <ul class="pager">
          <li class="previous" v-if="siblingInfo.prevId">
            <a :href="siblingInfo.prevId" rel="next"><i class="fa fa-angle-left"></i> {{siblingInfo.prevTit}}</a>
          </li>
          <li class="next" v-if="siblingInfo.nextId">
            <a :href="siblingInfo.nextId" rel="prev">{{siblingInfo.nextTit}}<i class="fa fa-angle-right"></i></a>
          </li>
        </ul>
      </nav>
      <hr>
      <comment :postInfo="postInfo"></comment>
    </div>
    <sidebar ></sidebar>
  </div>
</template>

<script>
  import sidebar from './parts/sidebar'
  import comment from './parts/comment'
export default{
  name:'single',
  data(){
    return{
      postInfo:{},
      commentsInfo:{},
      siblingInfo:{}
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.articleView()
    })
  },
  filters:{
    formatTime:value=>{
      let dateStr = new String(value);
      return dateStr.substring(0,10)
    }
  },
  methods:{
    articleView(){
        let articleId = this.$route.params.postId;
        this.$http.get(`/api/posts/${articleId}`)
          .then(res=>{
            let postTime = res.data.postInfo.postTime;
            res.data.postInfo.postTime = postTime.substring(0,10);
            this.$set(this,'postInfo',res.data.postInfo);
            this.$set(this,'commentsInfo',res.data.commentsInfo);
            this.$set(this,'siblingInfo',res.data.siblingInfo);
          })
          .catch(error=>{
            console.log(error)
          })
    },
    removeArticle(e){
      let articleLink = `/api${e.target.dataset.link}/remove`;
      let r = confirm("确定要删除这篇文章吗？");
      if(r === true){
        this.$http.get(articleLink).then(res=>{
          this.$router.push('/')
        })
          .catch(error=>{
            console.log(error)
          })
      }else{
        return;
      }
    }
  },
  components:{
      sidebar,
      comment
  }
}
</script>
<style scoped>
  .vc-blog:hover .refactor{
    display: block;
  }
  .refactor{
    display: none;
  }
  .refactor a{
    font-size: 12px;
    color: #ababab;
    padding-right:10px;
  }
</style>
