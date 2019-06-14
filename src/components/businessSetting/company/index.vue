<!--：企业组件
/**
* 辅助管理-业务设置-企业
* @/components/asistant/businessSetting 组件存放位置
* @author web-王晓冬
* @date 2019年4月17日
**/
-->
<template>
  <div class="ml20" v-loading="loading">
    <!-- 图例标题 -->
    <el-row class="h60 pl20">
      <el-col :span="12">企业信息</el-col>
      <el-col :span="12" class="ar">
        <el-button type="primary" size="small" @click="saveCompany">保存</el-button>
      </el-col>
    </el-row>
    <el-form :model="companyForm" ref="companyForm" size="small" label-width="60px">
      <el-form-item label="名称" prop="picName" :rules="{required:true,message:'请输入企业名称'}">
        <el-input class="w220" v-model.trim="companyForm.picName" maxlength="8" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <div class="company-logo">
          <img v-if="companyForm.picUrl" :src="companyForm.picUrl" alt="">
          <p v-else class="company-logo-tips ac">图片</p>
        </div>
        <p class="f12 d-text-gray">建议尺寸:150*150，支持的图片格式:jpg、png、gif、bmp</p>
        <upload-file @addPictureUrl="getPicInfo" :limit="{size:'5M',type:['png','jpg','gif','bmp']}">
          <el-button size="mini" icon="el-icon-upload2">上传图片</el-button>
        </upload-file>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import uploadFile from "../../common/upload-file"

export default {
  components:{
      uploadFile,
  },
  data() {
    return {
      loading: false, // 显隐Loading动画
      companyForm: {
        sysCode:'',
        companyCode:'', //公司code
        picName:'', //公司名称
        picUrl:'', //公司logourl
	    },
    };
  },
  mounted() {
  },
  created(){
    let companyInfo = this.$local.fetch('companyInfo')
    this.companyForm.picName = companyInfo.picName
    this.companyForm.picUrl = companyInfo.picUrl
  },
  computed:{
  },
  methods: {
    // 公司信息保存
    saveCompany() {
      this.$refs.companyForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.companyForm.sysCode = this.$local.fetch("userInfo").syscode;
            this.$api.seeBaseinfoService.logoEditCompanyLogo(this.companyForm)
              .then(res => {
                let companyInfo = {
                  picName:this.companyForm.picName,
                  picUrl:this.companyForm.picUrl,
                }
                this.$local.save('companyInfo',companyInfo)
                this.$store.commit('company/companyInfo',companyInfo)
              })
              .finally(() => {
                this.loading = false;
              });
          }
        })
    },
    getPicInfo(file){
        this.companyForm.picUrl = file.url
    }
  }
};
</script>
<style scoped lang="scss">
.company-logo{
	width:150px; 
	height: 150px;
	border:1px dashed #ddd;
	overflow: hidden;
	display: flex;
    justify-content: center;
    align-items: center;
	img{display: block; width:100%;height: 100%; object-fit: cover}
	.company-logo-tips{ width:110px; height: 110px; font-size:14px; line-height: 110px; color:#666; background:#f2f2f2; border-radius: 50%;}
}
</style>