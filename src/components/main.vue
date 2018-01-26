<template>
  <div class="row">
    <mainList :postPath="postPath">没有发表的文章</mainList>
    <sidebar></sidebar>
  </div>
</template>

<script>
  import sidebar from './parts/sidebar.vue'
  import mainList from './parts/mainList.vue'
export default {
  name: 'main',
  data () {
      return{
          postPath:{
              viewPath:'/api/posts',
              pagePath:'/api/posts?curPage='
          }
      }
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
