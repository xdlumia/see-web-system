 <!--
 /**
  * @desc 文件上传工具
  * @author web-吴森
  * @param  limit          上传的条件
  * @param  limit [ size ]   limit 下的size  上传文件的大小，默认2M
  * @param  limit [ type ]   limit type  允许上传的后缀名字
  * @slot  默认 <i class="el-icon-upload"></i>
  * @date 2018年7月10日
  * @example 使用示例
  *        <upload-file v-model :limit="obj" > </upload-pic>
            obj = {
              size: '5'  默认5M  上传的文件大小
              type: []  [ ipg, png, txt, js, gif, ....]
            }
  **/
-->
<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在上传中">
     <el-upload
        :drag="drag"
        :list-type="listType"
        action=""
        :before-upload="doUpload"
        :accept="imgAccept(this.limit.type)"
        :show-file-list="showFileList"
         >
        <slot>
          <el-button size="small" type="primary">点击上传</el-button>
        </slot>
      </el-upload>
  </div>
</template>
<script>

import { addZero } from '../utils/tools'

  export default {
    name: 'upload',
    props:{
      drag:{
        default:false
      },
      listType:{},
      limit:{},
      showFileList:{
        default:true
      }
    },
    data() {
      return {
        fullscreenLoading:false,
        OSS:{},
        region: 'oss-cn-beijing',
        id: 'upload',
        percentage: 0,
      }
    },
    created(){
      let timeStamp = new Date().getTime()
      this.OSS = this.$local.fetch('OSS')
      if(!this.OSS || this.OSS && !this.OSS.expiration ||  this.OSS && this.OSS.expiration && this.OSS.expiration  <  timeStamp ) {
        // oss不存在 或者 且oss expiration不存在 或者 expartion 小于 timeStamp 重新请求
        this.getOssTicket()
      }
    },
    methods: {
      imgAccept:function(arr){
        let accArr = []
        arr.forEach((item)=>{
            if (item === 'jpg' || item === 'png' ||  item === 'jpeg' || item == 'gif' ){
              // 统一处理 jpg 为 jpeg
              let type = { 'jpg': 'jpeg' }
              accArr.push(`image/${type[item] ? type[item] : item}`)
            }else if (item === 'mp4' || item === 'avi') {
              accArr.push(`video/${item}`)
            }else if (item === 'mp3') {
              accArr.push(`audio/mpeg`)
            } else if (item === 'zip' || item === 'rar') {
              accArr.push(`application/x-${item}-compressed`)
            } else if(item==="pdf"){
              accArr.push('application/pdf')
            } else if(item==="doc"){
              accArr.push('.doc') 
              accArr.push('.docx') 
            } else if(item==="xls"){
              accArr.push('.xls')
              accArr.push('.xlsx')
            } else if(item==="ppt"){
              accArr.push('.ppt')
              accArr.push('.pptx')
            } else {
              accArr.push('/')
            } 
        })
        return accArr.join(',')
      },
      getOssTicket(){
        return new Promise(respone => {
          this.$api.seeExternService.getOssTicket()
          .then(res => {
            if(res.code == 200) {
              this.$local.save('OSS' , res.data)
              this.OSS = res.data || {}
              respone()
            }
          })
        })
      },
      async doUpload(file) {
        let timeStamp = new Date().getTime()
        this.OSS = this.$local.fetch('OSS')
        if(!this.OSS || this.OSS && !this.OSS.expiration ||  this.OSS && this.OSS.expiration && this.OSS.expiration  <  timeStamp ) {
          // oss不存在 或者 且oss expiration不存在 或者 expartion 小于 timeStamp 重新请求
          await this.getOssTicket()
        }
      	let oldName=file.name
        if(this.limit) {
          let size = this.limit.size || 5
          if(file.size / 1024 / 1024  >  size ) {
              this.$message.error('上传文件大小超过最大限度');
              return false
          }
          
          if(this.limit.type && Array.isArray(this.limit.type) &&  this.limit.type.length > 0 ) {
            let appendName =  file.name.split(".").pop();
             if(!this.limit.type.includes(appendName)){
                 this.$message.error('上传文件的类型不合法');
                 return false
             }
          }
        } else {
          this.$message.error('不符合限制条件');
            return false
        }
        this.fullscreenLoading = true
        let companyCode = this.$local.fetch('userInfo').companyCode
        const client = new OSS.Wrapper({
          region: this.region,
          accessKeyId: this.OSS.accessKeyId,
          accessKeySecret: this.OSS.accessKeySecret,
          stsToken: this.OSS.securityToken,
          bucket: this.OSS.bucket,
          secure:true
        })
        this.percentage = 0;
        if (file) {
            let datePath = ''
            let myDate = new Date()
            datePath = myDate.getFullYear() +  addZero( myDate.getMonth() + 1 ) + '/'
            let randomNum = 0
            while(randomNum.length != 4 ) {
              randomNum = Math.floor( Math.random() * 10000 ).toString()
            }

            let filename  = file.name.split('.').pop()
            let randomName = new Date().getTime() +'-' + randomNum  + '.' + filename
            let filePath = ''


            if (filename === 'jpg' || filename === 'png' ||  filename === 'jpeg' || filename == 'gif' ){
              filePath = '/pic/'
            }else if ( filename === 'mp4' || filename === 'avi') {
              filePath = '/video/'
            }else if (filename === 'mp3') {
              filePath = '/audio/'
            } else  {
              filePath = '/file/'
            }
            // 上传
            client.multipartUpload(companyCode + filePath + datePath + randomName  , file, {
              progress: function* (percentage, cpt) {
                // 上传进度
                this.percentage = percentage
              },
              headers:{
                  // 保证下载时还是原文件名，可设置值有inline 和 attachment，其中inline是将文件内容直接显示在页面而attachment则弹出对话框让用户下载
                  'Content-Disposition':`inline;filename=${encodeURIComponent(oldName)}`,
              }
            }).then((results) => {
            	let url = 'http://'+this.OSS.bucket+'.'+this.region+'.aliyuncs.com/'+results.name
              this.$emit('addPictureUrl',{name:randomName,url:url,oldName:oldName})
              this.$emit('input',{name:randomName,url:url,oldName:oldName})
              this.fullscreenLoading = false
              this.$message({
                type:'success',
                showClose: true,
                message:'上传成功'
              })
            }).catch((err) => {
              this.fullscreenLoading = false
              this.$message({
                type:'error',
                showClose: true,
                message:'上传失败'
              })
            })
            return Promise.reject();
        }
      },
      deleteFile(path){

      }
    },
  }


</script>

<style>
  .building-picture  {
  width:100%;
  height:100%;
}
.building-picture  .el-upload-dragger{
  width:100%;
  height:100%;
}
.building-picture .el-upload {
  width:100%;
  height:100%;
}
</style>
