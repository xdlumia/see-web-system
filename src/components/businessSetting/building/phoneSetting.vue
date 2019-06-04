<template>
  <div v-loading="loading" v-if="authorityButtons.includes('asystem_assist_bizsetting_1009')" style="color:#666">
    <div class="d-hidden">
      <el-col :span="16">
        <h3 class="mt10 d-text-gray">查看电话设置</h3>
        <p class="f12 pb10" style="color: #999">说明：房态说明</p>
      </el-col>
      <el-col :span="8" class="ar">
        <el-button size="small" style="margin-top: 20px;" @click="recoverHousesPhoneDefault">恢复默认</el-button>
        <el-button v-if="authorityButtons.includes('asystem_assist_bizsetting_1010')" type="primary" size="small" style="margin-top: 20px;" @click="saveHandle">保存</el-button>
      </el-col>
    </div>
    <fieldset class="customer mb20" v-for="(item,index) of phoneForm.list" :key="index">
      <legend><i class="d-round12 d-circle d-bg-blue"></i> {{item.name}} </legend>
      <el-form  :model="item" class="" size="small" label-width="160px">
        <el-row class="mb10">
          <el-col :span="12" v-for="(subItem,i) of item.values" :key="i">
            <!-- 开关 -->
            <el-form-item :label="subItem.name+':'" >
                <el-input-number v-model="subItem.actualValue" size="mini" class="w120" controls-position="right" :max="9999" :step="1" :min="1"></el-input-number>  {{subItem.valueUnit}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>

  </div>
</template>

<script>


  export default {
  	props: [],
    data() {
      return {
        phoneForm:{list:[]},
        loading:false,
      }
    },
    created() {
      this.getHousesPhoneConfig()
    },
    methods: {
      // 获取房源配置
      getHousesPhoneConfig:function(){
        this.loading = true
        this.$api.seeHouseConfigService.getHousesPhoneConfig()
        .then(res => {
            if (res.code == 200 ) {
             this.phoneForm.list = res.data
            }
          })
        .finally(()=>{
          this.loading = false
        })
      },
      // 图片保存
      saveHandle(){
        let params = {list:[]}
        this.phoneForm.list.forEach((item)=>{
          item.values.forEach((subItem)=>{
            params.list.push(subItem)
          })
        })
        this.loading = true
        this.$api.seeHouseConfigService.editHousesPhoneConfig(params)
        .then(res => {
            // console.log('保存成功');
          })
        .finally(()=>{
          this.loading = false
        })
      },
      // 恢复默认
      recoverHousesPhoneDefault(){
        this.$confirm('是否要恢复默认设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$api.seeHouseConfigService.recoverHousesPhoneDefault()
          .then(res => {
              if (res.code == 200 ) {
                this.getHousesPhoneConfig()
              }
            })
        }).catch(() => {});
      },
    }
  }
  ;
</script>
<style scoped style="scss">
.customer{
  border:1px dashed #999;
}
</style>






