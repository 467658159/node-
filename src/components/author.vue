<template>
  <div class="row">
    <mainList :postPath="postPath">你目前还没有发表过文章</mainList>
    <sidebar></sidebar>
  </div>
</template>

<script>
  import sidebar from './parts/sidebar.vue'
  import mainList from './parts/mainList.vue'
export default {
  name: 'author',
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
      this.author = this.$route.query.author;
      this.postPath.viewPath = `/api/posts/author/${this.author}`;
      this.postPath.pagePath = `/api/posts/author/${this.author}?curPage=`;
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
