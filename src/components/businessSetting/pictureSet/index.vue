<template>
  <div style="color:#666" v-loading="loading">
      <div class="d-hidden">
        <el-col :span="16">
          <h3 class="mt10 d-text-gray">图片设置</h3>
          <p class="f12 pb10" style="color: #999">说明：水印设置默认关闭，水印设置打开后仅支持选择一种文字水印或图片水印！</p>
        </el-col>
        <el-col :span="8" class="ar">
          <el-button size="small" style="margin-top: 20px;" @click="recoverPicDefault">恢复默认</el-button>
          <el-button v-if="authorityButtons.includes('asystem_assist_bizsetting_1014')" type="primary" size="small" style="margin-top: 20px;" @click="saveHandle">保存</el-button>
        </el-col>
      </div>
      <el-form label-width="100px" size="mini" v-for="(item,index) of pictureForm.list" :key="index" ref="pictureForm">
        <fieldset class="d-fieldset mt15">
          <legend style="color: #666">{{item.title}}</legend>
            <el-form-item label="上传数量：" v-if="isShow(item.picSetType)">
              <el-input-number v-model="item.uploadNum" controls-position="right" :min="0" :max="item.title == '房间照片'?30:10"></el-input-number>
              <span class="fr d-text-red f12">上传数量：最多上传{{item.title == '房间照片'?30:10}}张</span>
            </el-form-item>
            <el-form-item label="上传大小：" v-if="isShow(item.picSetType)">
              <el-input-number v-model="item.uploadSize" controls-position="right" :min="0" :max="15"></el-input-number>
              <span class="fr d-text-red f12">上限说明：最大15M</span>
            </el-form-item>
             <el-form-item label="图片格式：" v-if="isShow(item.picSetType)">
               <el-checkbox-group v-model="item.picLayout">
                  <el-checkbox label="0">jpeg</el-checkbox>
                  <el-checkbox label="1">jpg</el-checkbox>
                  <el-checkbox label="2">gif</el-checkbox>
                  <el-checkbox label="3">png</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="水印设置：">
               <el-switch :active-value="1" :inactive-value="0" v-model="item.watermarkSwitch"></el-switch>
            </el-form-item>
            <watermark :form="item" v-show="item.watermarkSwitch"> </watermark>
        </fieldset>
      </el-form>
  </div>
</template>
<script>

  import watermark from './watermark'
  export default {
  	props: [],
    data() {
      return {
        loading:false,
        pictureForm:{list:[
          {
            title:'楼盘相册',
            watermarkType:1, //水印方式(0图片水印1文字水印)
            picSetType:0, //图片设置类型(0楼盘相册1户型照片2房间照片3证件照片4产证照片5合同预览及下载)
            picLayout:[],// 图片格式(0jpeg1jpg2gif3png)
            watermarkPosition:0, //水印位置
          },
          // {
          //   title:'户型照片',
          //   watermarkType:1, //水印方式(0图片水印1文字水印)
          //   picSetType:1, //图片设置类型(0楼盘相册1户型照片2房间照片)
          //   picLayout:[],// 图片格式(0jpeg1jpg2gif3png)
          //   watermarkPosition:0, //水印位置
          // },
          // {
          //   title:'房间照片',
          //   watermarkType:1, //水印方式(0图片水印1文字水印)
          //   picSetType:2, //图片设置类型(0楼盘相册1户型照片2房间照片)
          //   picLayout:[],// 图片格式(0jpeg1jpg2gif3png)
          //   watermarkPosition:0, //水印位置
          // },
        ]},
      }
    },
    components:{
      watermark,
    },
    created() {
     this.getPicConfig()
    },
    methods: {
      getPicConfig:function(){
        this.loading = true
        this.$api.seeHouseConfigService.getPicConfig()
        .then(res => {
            if (res.code == 200 ) {
             let data = res.data || []
             res.data.forEach((item)=>{
              item.picLayout= item.picLayout? item.picLayout.split(',') : []
             })
             this.pictureForm.list = data || []
              
            }
          })
        .finally(()=>{
          this.loading = false
        })
      },
      // 图片保存
      saveHandle(){
        let params = {list:[]}
        // Object.assign({},this.pictureForm)
        // 复制数据
        this.pictureForm.list.forEach((item,index)=>{
          params.list[index]=Object.assign({},item)
        })
        params.list.forEach((item)=>{
          item.picLayout=item.picLayout.join(',')
        })
        this.loading = true
        this.$api.seeHouseConfigService.updatePicConfig(params)
        .then(res => {
            // console.log('保存成功');
          })
        .finally(()=>{
          this.loading = false
        })
      },
      // 根据picSetType 判断图片类型 
      isShow(picSetType){
        let show = {
          0:true, //阿尔法楼盘相册
          1:true, //阿尔法户型照片
          2:true, //阿尔法房间照片
          3:true, //阿尔法证件照片
          4:true, // 产证照片
          5:false, // 合同预览
          6:false, // 铺脉动铺脉动首页
          7:false, // 铺脉动最新铺源
          8:false, // 铺脉动项目招商
          9:false, // 铺脉动加盟项目
          10:false, // 铺脉动项目竞标
          11:false, //铺脉动发现
        }
        return show[picSetType]
      },
      // 恢复默认
      recoverPicDefault(){
        this.$confirm('是否要恢复默认设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$api.seeHouseConfigService.recoverPicDefault()
          .then(res => {
              // console.log('恢复成功')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  };
</script>
<style scoped style="scss">
.position-header{position: fixed; top:80px; padding-top:10px;left:132px; right: 46px; background: #fff; z-index:99;}

</style>
<style>
  .business-setting .el-tabs__item.is-left{
    width:100px !important;
    text-align:center !important;
  }
</style>






