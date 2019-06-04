<template>
  <div>
    <el-radio v-model="form.watermarkType" :label="1">文字水印</el-radio>
    <el-radio v-model="form.watermarkType" :label="0">图片水印</el-radio>
    <div class="mt10">
      <div class="fl" style=" width: 650px;">
        <div>
            <el-form-item label="水印文字:" v-show="form.watermarkType==1">
                 <el-input  v-model="form.watermarkContent" class="w320" maxlength="10" placeholder="请输入文字" ></el-input>
            </el-form-item>
            <el-form-item label="上传图片:" v-show="form.watermarkType==0">
                 <upload-watermark class="upload-box" v-model="form.watermarkUrl">
                   <el-button type="primary" icon="el-icon-upload" size="small">上传水印</el-button>
                 </upload-watermark>
                 <!-- <el-input  v-model="form.watermarkContent" class="w320" maxlength="10" placeholder="请输入文字" ></el-input> -->
            </el-form-item>
            <el-form-item label="字体大小:" v-show="form.watermarkType == 1" >
              <el-row>
                <el-col :span="6">
                  <el-input-number v-model="form.fontSize" class="w100 mr5" controls-position="right"  :step="1" :min="12" :max="72"></el-input-number>号
                </el-col>
                <el-col :span="16" >
                  <el-slider v-model="form.fontSize" :min="12" :step="2" :max="72"></el-slider>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="不透明度:" >
              <el-row>
                <el-col :span="6">
                  <el-input-number v-model="form.opacity" class="w100 mr5" controls-position="right"  :step="1" :min="0" :max="100"></el-input-number>%
                </el-col>
                <el-col :span="16" >
                  <el-slider v-model="form.opacity" :min="0" :max="100" ></el-slider>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="旋转角度:" v-show="form.watermarkType==1">
              <el-row>
                <el-col :span="6">
                  <el-input-number v-model="form.rotationAngle" class="w100 mr5" controls-position="right"  :step="1" :min="0" :max="360"></el-input-number>度
                </el-col>
                <el-col :span="16" >
                  <el-slider v-model="form.rotationAngle" :min="0" :max="360" ></el-slider>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="缩放比例：" v-if="form.watermarkType==0">
              <el-row>
                <el-col :span="6">
                  <el-input-number v-model="form.zoom" class="w100 mr5" controls-position="right"  :step="1" :min="0" :max="100"></el-input-number>
                </el-col>
                <el-col :span="16" >
                  <el-slider v-model="form.zoom" :min="1" :max="100" ></el-slider>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="字体颜色:" v-show="form.watermarkType == 1" >
               <el-color-picker v-model="form.fontColor" :predefine="predefineColors" ></el-color-picker>
            </el-form-item>
            <el-form-item label="文字铺满:" v-show="form.watermarkType == 1" >
               <el-switch v-model="form.fill" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="水平边距：">
              <el-row>
                <el-col :span="6">
                  <el-input-number 
                  v-model="form.horizontalMargin" 
                  class="w100 mr5" 
                  controls-position="right"  
                  :disabled="form.watermarkPosition==1 || form.watermarkPosition==7 || form.watermarkPosition==4"
                  :min="0" :max="100"></el-input-number>px
                </el-col>
                <el-col :span="16" >
                  <el-slider 
                  v-model="form.horizontalMargin"
                  :disabled="form.watermarkPosition==1 || form.watermarkPosition==7 || form.watermarkPosition==4" 
                  :step="5" :min="0" :max="100"></el-slider>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="垂直边距：">
              <el-row>
                <el-col :span="6">
                  <el-input-number 
                  v-model="form.verticalMargin" class="w100 mr5" controls-position="right"
                  :disabled="form.watermarkPosition==3 || form.watermarkPosition==5 || form.watermarkPosition==4"  
                  :min="0" :max="100"></el-input-number>px
                </el-col>
                <el-col :span="16" >
                  <el-slider 
                  v-model="form.verticalMargin"
                  :disabled="form.watermarkPosition==3 || form.watermarkPosition==5 || form.watermarkPosition==4"    
                  :step="5" :min="0" :max="100" ></el-slider>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="水印位置:">
              <div class="position-box">
                <li v-for="(item,index) of tableOptions" :key="index">
                  <input type="radio" v-model="form.watermarkPosition" :value="index" class="position-radio">
                  <span>{{item}}</span>
                </li>
              </div>
            </el-form-item>
        </div>
      </div>
      <fieldset  class="d-fieldset onpreview">
        <legend style="font-size: 14px;">预览</legend>
        <div class="view" :style="watermarkFlex(form.watermarkPosition,form)">
          <span
          class="d-inlineblock" 
          v-show="form.watermarkType==1"
          :style="{
            fontSize:form.fontSize+'px',  //字体大小
            lineHeight:form.fontSize+'px', //行高（和字体大小统一）
            opacity:form.opacity/100, //透明度
            transform:`rotate(${form.rotationAngle}deg)`, //旋转角度
            color:form.fontColor, //旋转角度
            margin:`${form.verticalMargin}px ${form.horizontalMargin}px`
            // margin:''++'px'+form.horizontalMargin+'px', //水平居中
          }">
          {{form.watermarkContent}}
          </span>
          <span
          class="d-inlineblock" 
          v-show="form.watermarkType==0"
          :style="{
            opacity:form.opacity/100, //透明度
            margin:`${form.verticalMargin}px ${form.horizontalMargin}px`,
            width:`${form.zoom}%`
          }">
            <img :src="form.watermarkUrl" />
          </span>
          
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
  import uploadWatermark from '@/components/upload-watermark' //上传水印

  export default {
    props:['form'],
    components:{
      uploadWatermark,
    },
    data() {
      return {
          // 预定义颜色
          predefineColors: [
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
          ],
         tableOptions:['左上','中上','右上','左中','中央','右中','左下','中下','右下'],
      }
    },

    created() {

    },
    methods: {
      watermarkFlex:function(val,item){
        switch(val){
          case 0:
            return {alignItems: 'flex-start', justifyContent: 'flex-start',}
            break;
          case 1:
            item.horizontalMargin = 0 //取消水平修改
            return {justifyContent: 'center',alignItems: 'flex-start',}
            break;

          case 2:
            return { justifyContent: 'flex-end',alignItems: 'flex-start', }
            break;

          case 3:
            item.verticalMargin = 0 //取消水平修改
            return { alignItems: 'center', justifyContent: 'flex-start',}
            break;

          case 4:
            item.horizontalMargin = 0 //取消水平修改
            item.verticalMargin = 0 //取消垂直修改
            return { alignItems: 'center', justifyContent: 'center',}
            break;

          case 5:
            item.verticalMargin = 0 //取消垂直修改
            return { alignItems: 'center', justifyContent: 'flex-end',}
            break;

          case 6:
            return { alignItems: 'flex-end', justifyContent: 'flex-start',}
            break;

          case 7:
            item.horizontalMargin = 0 //取消水平修改
            return { alignItems: 'flex-end', justifyContent: 'center',}
            break;
          case 8:
          default:
            return { alignItems: 'flex-end', justifyContent: 'flex-end',}
        }
      },
      // picSetType:function(arr){
      //   let imgArr = []
      //   arr.forEach((item)=>{
      //     if(item ==0){
      //       imgArr.push('jpeg')
      //     }else if(item ==1){
      //       imgArr.push('jpg')
      //     }else if(item ==2){
      //       imgArr.push('gif')
      //     }else if(item ==3){
      //       imgArr.push('png')
      //     }
      //   })
      //   return imgArr
      // },
    }
  }
  ;
</script>
<style scoped lang="scss">
  .watermark {
    width:680px;
    color:#666;
    float:left;
    .fake-border{
      border-left: 2px solid #666;
      border-right: 2px solid #666;
      height:16px;
      .border-right{
        height:15px;
        border-right:2px solid #999;
        display:inline-block;
        width:10%;
        box-sizing: border-box;
      }
    }

  }
  .number-position {
    position: relative;
    top:-18px;
  }
  .position-box{position:relative; width:120px; height:120px; border-right:1px solid #dcdfe6; border-top:1px solid #dcdfe6;}
  .position-box li{position:relative; width:40px; height:40px; float:left;border-bottom:1px solid #dcdfe6; border-left:1px solid #dcdfe6;box-sizing: border-box;}
  .position-radio{position:absolute; left:0; top:0; width:100%; height:100%; opacity:0; z-index:1}
  .position-radio + span{color:#666; text-align:center; line-height:40px; position:absolute; left:0; top:0; width:100%; height:100%; font-size:12px;box-sizing: border-box;}
  .position-radio:checked + span{ background:#409EFF; color:#fff;}

  
  .onpreview{
    box-sizing:border-box;
    width: 400px;
    height: 400px;
    font-size: 0;
    padding:10px;
    padding-top: 5px;
    .view{
      border:1px solid #efefef;
      width:500px; 
      height: 360px; 
      display: flex;
      overflow: hidden;
      span{
        
        img{display: block; overflow: hidden; width: 100%; height: 100%;}
      }
      
    }
  }
</style>
<style>
  .upload-box .building-picture{ width:60px; height: 30px;}
  .upload-box .el-upload-dragger .el-icon-upload{line-height:30px; margin:0; font-size: 16px;}
</style>






