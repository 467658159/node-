<template>
  <div class="row">
    <catgList :postPath="postPath">
      没有发表的文章
      <span slot="catgName">干货</span>
    </catgList>
    <sidebar></sidebar>
  </div>
</template>

<script>
  import sidebar from './parts/sidebar.vue'
  import catgList from './parts/catgList.vue'
  export default {
    name: 'front',
    data () {
      return{
        postPath:{
          viewPath:'/api/posts/catg/catgName?catgName=干货',
          pagePath:'/api/posts/catg/catgName?catgName=干货&curPage='
        }
      }
    },
    components: {
      sidebar,
      catgList
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
