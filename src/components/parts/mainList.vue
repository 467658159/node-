<template>
    <div class="col-sm-12 col-md-9">
      <div v-if="!articles.length" class="vc-copyright">
        <slot></slot>
      </div>
      <div v-else class="thumbnail"  v-for="article in articles">
        <div class="vc-pagelist-img">
          <a :href="article.link">
            <img width="2000" height="600" :src="article.cover" v-if="article.cover" class="attachment-post-thumbnail wp-post-image" />
          </a>
        </div>
        <div class="caption">
          <h1 class="vc-page-title pull-left" ><a :href="article.link">{{article.title}}</a></h1>
          <p class="pull-right refactor" v-if="article.info.isAuthor">
            <a :href="`${article.link}/edit`">编辑</a>
            <a href="javascript:void(0)" :data-link="`${article.link}`" @click="removeArticle">删除</a></p>
          <div class="clearfix"></div>
          <p class="vc-author-info">
            <time>{{article.info.postTime | formatTime}}</time> &bull;
            <a :href="article.info.authorLink">{{article.info.author}}</a> &bull;
            <span> {{article.info.view}} 次浏览</span>
          </p>
          <p class="hidden-xs" v-html="article.intro"></p>
          <p class="clearfix">
            <a class="hidden-xs pull-right vc-more-link" :href="article.link" role="button">继续阅读 &raquo;</a>
            <span class="vc-tags">
              <a v-for="tag in article.tags">{{tag}}</a>
            </span>
          </p>
        </div>
      </div>
      <!--分页-->
      <nav aria-label="Page navigation" >
        <ul class="pagination">
          <li>
            <a href="javascript:void(0)" aria-label="Previous" @click="toFirstPage">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li><a href="javascript:void(0)" v-for="(pageNum,index) in pageNums" @click="toPage" :class="{active:index===isActive}">{{pageNum}}</a></li>
          <li>
            <a href="javascript:void(0)" aria-label="Next" @click="toLastPage">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
</template>

<script>
  export default {
    name: 'mainList',
    props:['postPath'],
    data () {
      return {
        articles:[],
        pageNums:[],
        isActive:0,
        isAuthor:true
      }
    },
    mounted () {
      this.$nextTick(()=>{
        this.blogView()
      })
    },
    filters:{
      formatTime:value=>{
        let dateStr = new String(value);
        return dateStr.substring(0,10)
      }
    },
    methods:{
      blogView () {
        let that = this;
        this.$http.get(this.postPath.viewPath).then( res => {
          res.data.articlesArr.forEach(function (value) {
            that.articles.push(value)
          });
          let pageNum = res.data.pageNum;
          let pageNums = [];
          for (let i=0;i<pageNum;i++){
            pageNums.push(i+1)
          }
          this.pageNums = pageNums;
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
            this.$router.go(0)
          })
            .catch(error=>{
              console.log(error)
            })
        }else{
            return;
        }
      },
      toPage(e){
        let curPage = e.target.innerText;
        this.pageFn(curPage)
      },
      toFirstPage(){
        this.pageFn(1);
      },
      toLastPage(){
        this.pageFn(this.pageNums[this.pageNums.length-1]);
      },
      pageFn(num){
        this.isActive = num-1;
        this.$http.get(`${this.postPath.pagePath}${num}`).then(res=>{
          let replaceNum = res.data.articlesArr.length;
          this.articles.splice(0,replaceNum,res.data.articlesArr);
          this.$set(this,'articles',this.articles[0])
        })
          .catch(error=>{
            console.log(error)
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pagination > li > a.active{
    background-color: #1abc9c;
    color: #fff;
  }
  .vc-copyright{
    background: #f9f9f9;
    padding: .5em .7em;
    margin: 1em 0;
    border: 1px solid #1abc9c;
    border-left-width: 4px;
    font-size: 16px;
    color: #a54343;
  }
  .thumbnail:hover .refactor{
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
