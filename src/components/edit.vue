<template>
  <div class="row">
    <div class="col-sm-12 col-md-9">
      <div class="articleEditor">
        <div class="form-group ">
          <label for="articleTitInp">文章标题</label>
          <input type="text" class="form-control" id="articleTitInp" placeholder="请输入文章标题" v-model="title">
        </div>

        <label>文章内容</label>
        <vue-editor
          useCustomImageHandler
          @imageAdded="handleImageAdded"
          v-model="content" placeholder="请输入文章内容">
        </vue-editor>
        <div class="form-group">
          <label>文章封面图（可不填）</label>
          <imgInputer v-model="cover"></imgInputer>
        </div>
        <div class="form-group ">
          <label for="articleIntro">文章简介（少于170个字）</label>
          <textarea maxlength="170"  class="form-control" id="articleIntro" placeholder="请输入文章简介" v-model="intro"></textarea>
        </div>
        <div class="form-group ">
          <label for="articleTagInp">文章标签（使用“,”分隔）</label>
          <input type="text" class="form-control" id="articleTagInp" placeholder="请输入文章标签" v-model="tags">
        </div>
        <div class="form-group">
          <label for="articleTagInp">选择文章分类</label>
          <select class="form-control" id="catg" @change="getCatg" ref="catg">
            <option  v-for="(catg,index) in catgArr">{{catg}}</option>
          </select>
        </div>
        <p class="verify pull-left">{{verify}}</p>
        <button class="btn pull-right" @click="publish" >发表文章</button>
      </div>
    </div>
    <sidebar></sidebar>
  </div>
</template>

<script>
  import { VueEditor } from 'vue2-editor'
  import sidebar from './parts/sidebar.vue'
  import imgInputer from './parts/imgInputer.vue'
  export default{
      components:{
        VueEditor,
        sidebar,
        imgInputer
      },
    data(){
        return {
            postId:'',
            title:'',
            content:'',
            cover:'',
            tags:'',
            intro:'',
            catg:'',
            verify:'',
            catgArr:['心情','前端','后端','干货']
        }
    },
    mounted () {
      this.$nextTick(()=>{
        this.editView()
      })
    },
    methods:{
      editView(){
        if (typeof this.$route.params.postId !== 'undefined') {
          this.postId = this.$route.params.postId;
          this.$http.get(`/api/posts/${this.postId}/edit`)
            .then(res=>{
              this.title= res.data.title;
              this.content = res.data.content;
              this.cover = res.data.cover;
              this.intro = res.data.intro;
              this.tags = res.data.tags;
              this.catg = res.data.catg;

              let selectIndex = this.catgArr.indexOf(res.data.catg);
              this.$refs.catg.options[selectIndex].selected =true;

            })
            .catch(error=>{
              console.log(error)
            })
        }
        this.catg = this.$refs.catg.value;
      },
      handleImageAdded(file,Editor,cursorLocation){
        let formData = new FormData();
        formData.append('editorImg',file);
        let config = {
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        };
        this.$http.post('/api/posts/images',formData,config)
          .then(res=>{
            let url = res.data;
            Editor.insertEmbed(cursorLocation,'image',url, );
          })
          .catch(error=>{
            console.log(error)
          })
      },
      getCatg(){
          this.catg = this.$refs.catg.value;
      },
      publish () {
        let formData = new FormData();
        if(this.title&&this.content&&this.tags&&this.intro){
          formData.append('title',this.title);
          formData.append('content',this.content);
          formData.append('coverPic',this.cover);
          formData.append('tags',this.tags);
          formData.append('intro',this.intro);
          formData.append('catg',this.catg);
          let config = {
            headers:{
              'Content-Type': 'multipart/form-data'
            }
          };
           let postAddress = '/api/posts';
           if (typeof this.$route.params.postId !== 'undefined'){
             postAddress = `/api/posts/${this.$route.params.postId }/edit`
           }
          this.$http.post(postAddress,formData,config)
            .then(res=>{
              if (res.status === 200){
                this.$router.push(`/posts/${res.data}`)
              }
            })
            .catch(error=>{
              console.log(error)
            })
        }else {
            this.verify = '请输入完整的文章信息'
        }

      }
    }
  }
</script>

<style scoped>
.articleEditor{
  margin: 0px 0px 30px;
  overflow: hidden;
}
.articleEditor label{
  display: block;
  font-size: 14px;
  margin-top: 10px;
  border-left: 4px solid #1abc9c;
  padding-left: 6px;
}
  .btn{
    width: 100px;
    height: 32px;
    border: 0;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    background: #1abc9c;
    color: #fff;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    line-height: 21px;
  }
  .verify{
    color: #F96F6F;
  }
  #articleIntro{
    resize: none;
    height: 110px;
    max-height: 110px;
    background-color: #fff;
    text-indent: 10px;
    padding: 10px;
  }
</style>
