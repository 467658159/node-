<template>
  <div class="row">
    <mainList :postPath="postPath">未搜索到相关文章</mainList>
    <sidebar></sidebar>
  </div>
</template>

<script>
  import sidebar from './parts/sidebar.vue'
  import mainList from './parts/mainList.vue'
  export default {
    name: 'search',
    data () {
      return {
        postPath:{
          viewPath:'',
          pagePath:''
        }
      }
    },
    created () {
      this.$nextTick(()=>{
        this.blogView()
      })
    },
    methods:{
      blogView () {
        let query = this.$route.query.keywords;
        this.postPath.viewPath = `/api/posts/sidebar/search?keywords=${query}`;
        this.postPath.pagePath = `/api/posts/sidebar/search?curPage=`;
      },
    },
    components: {
      sidebar,
      mainList
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
