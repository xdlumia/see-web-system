 <!--
 /**
  * @desc 文件上传工具
  * @author web-吴森
  * @param  addPictureUrl   子组件给父组件的方法返回url
  * @param  limit          上传的条件
  * @param  limit [ size ]   limit 下的size  上传文件的大小，默认2M
  * @param  limit [ type ]   limit type  允许上传的后缀名字
  * @slot  默认 <i class="el-icon-upload"></i>
  * @date 2018年7月10日
  * @example 使用示例
  *        <upload-pic @addPictureUrl="addPictureUrl" :limit="obj" > </upload-pic>
            obj = {
              size: ''  默认5M  上传的文件大小
              type: []  [ ipg, png, txt, js, gif, ....]
            }
  **/
-->
<template>
  <div class="upload">
     <el-upload
        class="building-picture"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :before-upload="doUpload"
        :accept="imgAccept(this.limit.type)"
         >
        <i class="el-icon-upload"></i>
      </el-upload>
  </div>
</template>
<script>

import { addZero } from '@/utils/tools'

  export default {
    name: 'upload',
    props:['limit'],
    data() {
      return {
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
              accArr.push(`image/${item}`)
            }else if (item === 'mp4' || item === 'avi') {
              accArr.push(`video/${item}`)
            }else if (item === 'mp3') {
              accArr.push(`audio/mpeg`)
            } else  {
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

        if(this.limit) {
          if(this.limit.size ) {
//          if(file.size / 1024 / 1024  >  this.limit.size) {
//             this.$message.error('上传头像图片大小超过最大限度');
//             return false
//          }
//        } else {
//        	console.log(file.size)
              if(file.size / 1024 / 1024  >  5 ) {
               this.$message.error('上传图片大小超过最大限度');
               return false
            }
          }
          if(this.limit.type && Array.isArray(this.limit.type) &&  this.limit.type.length > 1 ) {
            let appendName =  file.name.split(".").pop();
             if(!this.limit.type.includes(appendName)){
                 this.$message.error('上传文件的类型不合法');
                 return false
             }
          } else {
            this.$message.error('上传文件的类型不合法');
            return false
          }
        } else {
          this.$message.error('不符合限制条件');
            return false
        }
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
                  'Content-Disposition':`inline;filename=${encodeURIComponent(file.name||(`${randomName}.${filename}`))}`,
              }
            }).then((results) => {
            	let url = 'http://'+this.OSS.bucket+'.'+this.region+'.aliyuncs.com/'+results.name
              this.$emit('addPictureUrl',{name:randomName,url:url})
            }).catch((err) => {

            })
            return false
        }
      },
      deleteFile(path){

      }
    },
  }


</script>

<style>

</style>
