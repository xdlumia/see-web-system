<!--私有组件：客户
/**
* 辅助管理-公共设置-私有组件：客户
* @/components/asistant/customer 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div style="color:#666" v-loading="loading">
      <div class="d-hidden">
        <el-col :span="16">
          <h3 class="mt10 d-text-gray">查看电话设置</h3>
          <p class="f12 pb10" style="color: #999">说明：查看电话的设置</p>
        </el-col>
        <el-col :span="8" class="ar">
          <el-button size="small" style="margin-top: 20px;" @click="recoverCustomerDefault">恢复默认</el-button>
          <el-button type="primary" v-if="authorityButtons.includes('asystem_assist_bizsetting_1016')" size="small" style="margin-top: 20px;" @click="saveHandle">保存</el-button>
        </el-col>
      </div> 
      <fieldset class="d-fieldset mb20" v-for="(item,index) of customerForm.list" :key = "index">
          <legend><i class="d-round12 d-circle d-bg-green"></i> {{item.name}} </legend>
            <div v-if="index==0">
              <el-col :span="12"  v-for="(subItem,i) of item.values" :key = "i">
                <div class="">
                {{subItem.name}}：<el-input-number v-model="subItem.actualValue" size="mini" controls-position="right"  :step="1" :min="1"></el-input-number> {{subItem.valueUnit}}
                </div>
              </el-col>
            </div>
            <div v-if="index==1" class="mb10 mt10">
              <el-row>
                <el-col :span="24"  v-for="(subItem,i) of item.values" :key = "i" v-if="subItem.code == 'JJR_KCK_KHDH'">
                  {{subItem.name}}：<el-input-number v-model="subItem.actualValue" size="mini" controls-position="right"  :step="1" :min="1"></el-input-number> {{subItem.valueUnit}}
                </el-col>
              </el-row>
              <el-row class="mt15">
                <el-col :span="4" style="width:80px;margin-top: 3px;height: 70px;">跟进周期：</el-col>
                <el-col :span="5" v-for="(subItem,i) of item.values" :key = "i" v-if="subItem.type==0" class="mb5">
                  {{subItem.name}}：<el-input-number v-model="subItem.actualValue" size="mini" controls-position="right"  :step="1" :min="1"></el-input-number> {{subItem.valueUnit}}
                </el-col>
              </el-row>
              <el-row class="mt5">
                <el-col :span="4" style="width:80px;margin-top: 3px;height: 70px;">跟进警告：</el-col>
                <el-col :span="5" v-for="(subItem,i) of item.values" :key = "i" v-if="subItem.type==1"  class="mb5">
                  {{subItem.name}}：<el-input-number v-model="subItem.actualValue" size="mini" controls-position="right"  :step="1" :min="1"></el-input-number> {{subItem.valueUnit}}
                </el-col>
              </el-row>
            </div>
            <div v-if="index==2" class="mb10">
            	<el-col :span="12"  v-for="(subItem,i) of item.values" :key = "i">
                <div class="">
                {{subItem.name}}：<el-input-number v-model="subItem.actualValue" size="mini" controls-position="right"  :step="1" :min="1"></el-input-number> {{subItem.valueUnit}}
                </div>
              </el-col>
            </div>
      </fieldset>
  </div>
</template>

<script>
  export default {
  	props: [],
    data() {
      return {
        customerForm:{list:[]},
        loading:false,
      }
    },

    created() {
      // 初始化数据
      this.getCustomerConfig()
    },
    methods: {
      // 获取客户配置
      getCustomerConfig:function(){
        this.loading = true
        this.$api.seeHouseConfigService.getCustomerConfig()
        .then(res => {
          if (res.code == 200 ) {
            // 商圈表格
            this.customerForm.list = res.data||[]        
          }
        })
        .finally(()=>{
          this.loading = false
        })
      },
      // 客户电话保存
      saveHandle(){
      	let arr = this.customerForm.list[1].values
      	let codeArr = []
      	for(let i=0;i<arr.length;i++){
      		for(let j=1;j<arr.length;j++){
      			if((arr[i].code.substring(5) == arr[j].code.substring(5)) && (arr[i].code != arr[j].code ) && !codeArr.includes(arr[i].code.substring(5))){
      				codeArr.push(arr[i].code.substring(5))
      				if(arr[i].actualValue <= arr[j].actualValue){
      					this.$message({
		              type: 'error',
		              message: '警告周期只能小于跟进周期！'
		            })
      					return false
      				}
      				
      			}
      		}
      	}
        let params = {list:[]}
        this.loading = true
        this.customerForm.list.forEach((item)=>{
          item.values.forEach((subItem)=>{
            params.list.push(subItem)
          })
        })
        this.$api.seeHouseConfigService.updateCustomerConfig(params)
        .then(res => {
            // console.log('保存成功');
          })
        .finally(()=>{
          this.loading = false
        })
      },
      // 恢复默认
      recoverCustomerDefault(){
        this.$confirm('是否要恢复默认设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$api.seeHouseConfigService.recoverCustomerDefault()
          .then(res => {
              if (res.code == 200 ) {}
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  }
  ;
</script>
<style scoped lang="scss">

</style>






