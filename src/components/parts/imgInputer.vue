<template>
  <div class="box">
    <i class="img-inputer__icon">ヾ(๑╹◡╹)ﾉ"</i>
    <p class="img-inputer__placeholder">点击选择图片</p>
    <label for="articleCover" class="img-inputer__label"></label>
    <div class="img-inputer__preview-box" v-bind:class="{black:!!dataUrl}">
      <img :src="dataUrl" class="img-inputer__preview-img">
    </div>
    <input type="file" id="articleCover" @change="upload" ref="inputer">
  </div>
</template>

<script>

  export default{
      name:'imgInputer',
      data(){
        return{
            dataUrl:''
        }
      },
      mounted(){
          this.$nextTick(()=>{
            this.imgView()
          })
      },
      methods:{
        imgView(){
          if (typeof this.$route.params.postId !== 'undefined') {
            this.postId = this.$route.params.postId;
            this.$http.get(`/api/posts/${this.postId}/edit`)
              .then(res=>{
                this.dataUrl = res.data.cover;
              })
              .catch(error=>{
                console.log(error)
              })
          }
        },
        imgPreview(file){
            let that = this;
            if(!file || !window.FileReader) return;
            if (/^image/.test(file.type)){
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                  that.dataUrl = this.result
                }
            }

        },
        upload(e){
            let inputer = this.$refs.inputer;
            this.file = inputer.files[0];
            this.imgPreview(this.file);

            let size = Math.floor(this.file.size/1024/1024);
            if(size>10){
              return false;
            }
          this.$emit('input',this.file);
        }
      }
  }
</script>

<style scoped>
  .box {
    position: relative;
    display: inline-block;
    width: 260px;
    height: 150px;
    border-radius: 5px;
    background: #f0f0f0;
    box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    transition: .3s cubic-bezier(.4,0,.2,1)
  }
  input {
    position: absolute;
    left: -9999px;
  }
  /* 使label充满整个box*/
  label {
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    z-index: 10; /* 这个z-index之后说到*/
  }
  .img-inputer__placeholder {
    position: absolute;
    margin: 0;
    font-size: 14px;
    width: 100%;
    color: #aaa;
    top: 62%;
    text-align: center;
  }
  .img-inputer__label {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    cursor: pointer;
    margin-bottom: 0;
  }
  .box:hover {
    -webkit-transform: scale(1.015);
    transform: scale(1.015);
    box-shadow: 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.3);
  }
  .img-inputer__icon {
    position: absolute;
    font-size: 17px!important;
    left: 50%;
    top: 40%;
    color: #757575;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }
  .img-inputer__preview-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 5px;
    overflow: hidden;
  }
  .black{
    background: #333;
  }
  .img-inputer__preview-img {
    position: relative;
    top: 0;
    z-index: 2;
    width: 100%;
  }
</style>
