<template>
  <div id="comments" class="comments-area">
    <div id="respond" class="comment-respond">
      <h3 id="reply" class="comment-reply-title">评论 </h3>
      <div class="replies" v-for="(comment,index) in commentsInfo">
        <span class="pull-left floor">{{index+1}}楼</span>

        <span class="pull-right commentTime">{{comment.date | formatTime}}</span>
        <div class="clearfix"></div>
        <div class="content">
          <a class="commentAuthor pull-left" :href="'/author?author='+comment.author._id">{{comment.author.username}}：</a>
          <a href="javascript:void(0)"
             :data-commentId="comment._id"
             @click="removeComment"
             v-if="postInfo.isAuthor"
             class="removeComment pull-right"
          >删除</a>
          <div class="clearfix"></div>
          <p>{{comment.content}}</p>
        </div>
      </div>

      <h3 id="reply-title" class="comment-reply-title">发表评论 </h3>
      <div id="commentform" class="comment-form">
        <p class="comment-form-comment">
          <textarea id="comment" name="comment" cols="45" rows="5" placeholder="评论点什么吧..." v-model.trim="content"></textarea>
        </p>
        <p class="form-submit">
          <input name="submit" type="submit" id="submit" class="submit" value="发表评论" @click="submitComment"/>
        </p>
        <div class="tips">{{tips}}</div>
      </div>
    </div><!-- #respond -->
  </div><!-- #comments -->
</template>

<script>
  export default {
      name:'comment',
      props:['postInfo'],
      data(){
          return{
            commentsInfo:[],
            content:'',
            tips:''
          }
      },
      mounted(){
          this.$nextTick(()=>{
              this.commentView();
          })
      },

      filters:{
          formatTime:value=>{
            let dateStr = new String(value);
            return dateStr.substring(0,10)
          }
      },
      methods:{
          commentView(){
              let postId = this.$route.params.postId;
              this.$http.get(`/api/posts/${postId}/comment`).then(res=>{
                this.commentsInfo = res.data;
              })
                .catch(error=>{
                  console.log(error)
                })
          },
          submitComment(){
              let comment = {comment:this.content};
              let postId = this.$route.params.postId;
              if(this.content){
                this.$http.post(`/api/posts/${postId}/comment`,comment).then(res=>{
                  if (res.data === 'notLogin'){
                    this.tips = '请登录后再评论'
                  }else {
                    this.commentsInfo = res.data;
                    this.content = '';
                    this.tips = ''
                  }
                })
                  .catch(error=>{
                    console.log(error)
                  })
              }else{
                  this.tips = '评论不能为空'
              }
          },
          removeComment(e){
              let postId = this.$route.params.postId;
              let commentId = e.target.dataset.commentid;
              this.$http.get(`/api/posts/${postId}/comment/${commentId}/remove`).then(res=>{
                this.commentsInfo = res.data;
              })
                .catch(error=>{
                  console.log(error)
                })
          }
      }
  }
</script>

<style scoped>
  textarea{
    resize: none;
  }
  .replies{
    margin-bottom: 10px;
  }
  .replies .content{
    border: 1px solid #eee;
    padding: 5px 10px;
  }
  .replies .content p{
    text-indent: 10px;
    margin-bottom: 0em;
  }
  .commentTime{
    font-size: 12px;
    color: #999;
  }
  .commentAuthor{
    font-weight: bold;
  }
  .floor{
    margin-right:10px;
  }
  .removeComment{
    font-size: 12px;
    color: #9a9a9a;
    display: none;
  }
  .replies:hover .removeComment{
    display: block;
  }
  .tips{
    margin-bottom: 0px;
    color: #F96F6F;
    margin-top: 2px;
  }
</style>
