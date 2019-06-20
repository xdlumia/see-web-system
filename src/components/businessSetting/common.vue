<!--私有组件：房态
/**
* 辅助管理-公共设置-私有组件：公共
* @/components/asistant/common 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div style="color:#666" v-loading="loading">
    <div class="d-hidden">
      <el-col :span="16">
        <h3 class="mt10 d-text-gray">公共设置</h3>
        <p class="f12 pb10" style="color: #999">说明：公共说明</p>
      </el-col>
      <el-col :span="8" class="ar">
        <el-button size="small" style="margin-top: 20px;" @click="recoverHouseDefault">恢复默认</el-button>
        <el-button v-if="authorityButtons.includes('asystem_assist_bizsetting_1012')" type="primary" size="small" style="margin-top: 20px;" @click="saveHandle">保存</el-button>
      </el-col>
    </div>
    <fieldset class="d-fieldset mb20" v-for="(item,index) of houseData" :key="index" v-if="item.name!='杂费设置'">
      <legend><i class="d-round12 d-circle d-bg-blue"></i> {{item.name}} </legend>
      <el-form :model="item" class="" size="small" label-width="190px">
        <el-row class="mb10">
          <el-col :span="[6,7].includes(subItem.type)?24:12" v-for="(subItem,i) of item.values" :key="i">
            <!-- type==0开关 -->
            <el-form-item v-if="subItem.type==0" :label="subItem.name+':'" >
                <el-switch active-value="1" inactive-value="0" v-model="subItem.actualValue"></el-switch>
            </el-form-item>
            <!-- type==1数字 -->
            <el-form-item v-if="subItem.type==1" :label="subItem.name+':'" >
              <el-input-number v-if="subItem.name=='出房逾期提前提醒'" v-model="subItem.actualValue" size="mini" class="w100" controls-position="right" :precision="0" :step="1" :min="0" :max="rentRemind"></el-input-number>
              <el-input-number v-else v-model="subItem.actualValue" size="mini" class="w100" controls-position="right"  :precision="0" :step="1" :min="0" :max="999"></el-input-number>
               {{subItem.valueUnit}}
            </el-form-item>
            <!-- type ==2单选 -->
            <el-form-item v-if="subItem.type==2" :label="subItem.name+':'" >
              <!-- 付款方式写死：1 -->
              <el-radio-group v-model="subItem.actualValue">
                <el-radio v-model="subItem.actualValue" :label="radioItem.actualValue" v-for="(radioItem,index) of subItem.childValue" :key="index">{{radioItem.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- type == 3文字输入框 -->
            <el-form-item
            v-else-if="subItem.type==3"
            :label="subItem.name"
            :prop="'values.'+i+'.actualValue'"
            :rules= "[{ required: true, message: ' ', trigger: 'blur' }]">
              <el-input v-model="subItem.actualValue" class="w200" :placeholder="'请填写'+subItem.name"></el-input>
            </el-form-item>
            <!-- type == 4上传 -->
            <el-form-item
            v-else-if="subItem.type==4"
            :label="subItem.name"
            :prop="'values.'+i+'.actualValue'"
            :rules= "[{ required: true, message: ' ', trigger: 'blur' }]">
               <upload-file class="w120 fl" @click.native="uploadPicClick(subItem)"  @addPictureUrl="uploadPic" :limit="{type:['jpg','png']}" >
                  <div class="d-absolute" style="width:110px; height:110px; border:1px solid #efefef; line-height:110px;"><i class="el-icon-upload2"></i>   </div>
                  <img class="fl mr5" style="width:110px; height:110px;" :src="subItem.actualValue" alt="">
              </upload-file>
            </el-form-item>
            <!-- type==5多选 -->
            <!-- <el-form-item v-if="subItem.type==5" :label="subItem.name+':'" >
                <el-checkbox-group v-model="chargeViewType">
                  <el-checkbox label="0">总</el-checkbox>
                  <el-checkbox label="1">尖</el-checkbox>
                  <el-checkbox label="2">峰</el-checkbox>
                  <el-checkbox label="3">平</el-checkbox>
                  <el-checkbox label="4">谷</el-checkbox>
                </el-checkbox-group>
            </el-form-item> -->
            <!-- type==6 自定义 -->
            <div v-if="subItem.type==6">
              <!-- <el-form-item class="state-form-label"> -->
                  <ul class="state-form-box" v-for="(valueItem,index) of subItem.actualValue" :key="index">
                    <li>
                      <p v-if="valueItem.default" size="mini" class="w120">{{valueItem.title}}</p>
                      <el-input v-else size="mini" class="w120" maxlength="5" placeholder="标题" v-model.trim="valueItem.title"></el-input>
                    </li>
                    <li>
                      <el-input :disabled="true" v-model="valueItem.startDate" size="mini" class="w80"></el-input>
                      <span>≤空置天数＜</span>
                      <!-- 最后一条数据空置天数少于不限 -->
                      <el-input v-if="(subItem.actualValue.length-1) == index" class="w100" disabled v-model="valueItem.endDate" size="mini"></el-input>
                      <el-input-number :precision="0" v-else v-model="valueItem.endDate" @change="actualEndDateChange(valueItem.endDate,index,subItem.actualValue)" size="mini" class="w100" :min="0" :max="9999" :step="1" controls-position="right" ></el-input-number>
                    </li>
                    <li>简称:<el-input size="mini"  v-model.trim="valueItem.simpleTitle" class="w60" maxlength="1"></el-input></li>
                    <li>首页显示
                      <el-switch
                        v-model="valueItem.visible"
                        :active-value="1"
                        @change="actualSwitch(subItem.actualValue)"
                        :inactive-value="0">
                      </el-switch>
                    </li>
                    <li>
                      <el-button v-if="(subItem.actualValue.length-1) == index && !valueItem.default" size="mini" @click="delVacancy(subItem.actualValue,index)">删除</el-button>
                    </li>
                  </ul>
              <!-- </el-form-item> -->
              <!-- 添加空置期限 -->
              <el-button size="mini" class="ml20 mt10" icon="el-icon-plus" @click="addVacancy(subItem.actualValue)">添加设置</el-button>
            </div>
            <!-- type==7 这是多个对公账户编辑块 -->
            <companyAccount ref="accountForm" v-if="subItem.type==7" v-model="subItem.actualValue"></companyAccount>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>
  </div>
</template>
<script>
  import uploadFile from "../common/upload-file"
  import companyAccount from "./components/companyAccount"

  export default {
    components:{
      uploadFile,
      companyAccount,
      },
  	props: [],
    data() {
      return {
        houseData:[],
        updatePicItem:{},
        chargeViewType:[],//电费显示方式
        loading:false,
      }
    },
    created() {
      // 获取房源配置
      this.getHouseTypeConfig()
    },
    computed:{
      rentRemind(){
        let flatten = arr => [].concat(...arr.map(v=>v.values));
        let [rentMaxObj] = flatten(this.houseData).filter(item=>item.name=='出房合同付款日期默认提前')
        return  (rentMaxObj && rentMaxObj.actualValue) ? parseInt(rentMaxObj.actualValue) : ''
      }
    },
    methods: {
      // 获取房源配置
      getHouseTypeConfig(){
        this.loading = true
        this.$api.seeHouseConfigService.getHouseTypeConfig({syscode:this.$local.fetch('userInfo').syscode})
        .then(res => {
            if (res.code == 200 ) {
             let data = res.data
             data.forEach(item=>{
              // if(item.name =='杂费设置'){
              //    item.values.forEach(subItem=>{
              //      if(subItem.type==5){
              //        this.chargeViewType = (subItem.actualValue || '').split(',') || []
              //      }
              //    })
              // }
              if(item.name =='空置期限设置'){
                 item.values.forEach(subItem=>{
                   subItem.actualValue = JSON.parse(subItem.actualValue) || []
                 })
              }
             })
             this.houseData = res.data || []
            }
          })
          .finally(()=>{
            this.loading = false
          })
      },
      // 首页是否显示切换
      actualSwitch(actualValue){
        let visNum = 0
        actualValue.forEach(item=>{
          if(item.visible==1){
            visNum++
            if(visNum>2){
              this.$message.warning('首页最多只能显示两条')
              item.visible = 0
              return
            }
          }
        })
      },
      // 添加空置期
      addVacancy(actualValue){
        if(actualValue.length == 5){
          this.$message.warning('最多只能添加5条')
          return
        }
        let startDate = ''
        if(actualValue.length){
          // 添加前最后一行数据
          let endItem = actualValue[actualValue.length-1]
          // 如果添加数据则把添加前的最后一行数据的结束天数更改为开始时间+1天
          endItem.endDate = Number(endItem.startDate)+1
          // 新增的空置期开始天数取上一次数据的结束天数并+1]
          startDate = Number(endItem.endDate)+1
        }
        actualValue.push({
          default:0, //是否默认
          title:'', //标题
          simpleTitle:'', //简称
          startDate:startDate, //开始天数
          endDate:'不限', //结束天数
          visible:0, //首页是否显示
        })
      },
      // 删除空置期
      delVacancy(actualValue,index){
        actualValue.splice(index,1)
        if(actualValue.length ==index){
          actualValue[actualValue.length-1].endDate = '不限'
        }
      },
      /**
       * 修改空置天数小于天数
       * val:当前操作值
       * index:下标
       * 列表数据
      */
      actualEndDateChange(val,index,data){
        if(val<=data[index].startDate){
          this.$message.warning('此空置小于天数必须>'+data[index].startDate+'')
          data[index].endDate = parseInt(data[index].startDate)+1
          return
        }
        data[index+1].startDate = (Number(val) || 0)+1
      },
      // 图片保存
      async saveHandle(){
        // 定义保存的参数
        let params = {list:[]}
        // 拷贝数据,防止更改数据类型导致错误
        let assignData = JSON.parse(JSON.stringify(this.houseData))

        let isRequired = false
        // 把所有设置添加到list里
        assignData.forEach((item)=>{
          item.values.forEach((subItem)=>{
            // 如果type==5 电费抄表显示配置
            if(subItem.type==5){
              subItem.actualValue = this.chargeViewType
              subItem.actualValue = subItem.actualValue.join(',')
            }
            else if(subItem.type==6){
              // 检查空置期必填项
              for(item of subItem.actualValue){
                if(!item.title){
                  this.$message.warning('空置期设置标题不能为空')
                  isRequired = true
                  break
                }
                if(!item.endDate){
                  this.$message.warning('空置期设置<天数不能为空')
                  isRequired = true
                  break
                }
                if(!item.simpleTitle){
                  this.$message.warning('空置期设置简写名称不能为空')
                  isRequired = true
                  break
                }
              }
              subItem.actualValue = JSON.stringify(subItem.actualValue)
            }
            params.list.push(subItem)
          })
        })

        // 对公账户校验
        if(this.$refs.accountForm&&this.$refs.accountForm.length){
          for(let i in this.$refs.accountForm){
            try {
              await this.$refs.accountForm[i].$refs.form.validate()
            } catch (error) {
              isRequired = true;
              this.$message.warning('请检查公司收款渠道填写信息')
            }
          }
        }
        // 如果空置期必填的数值没有填写不能保存
        if(isRequired){
          return
        }
        // 开始保存数据
        this.loading = true
        this.$api.seeHouseConfigService.updateHouseTypeConfig(params)
          .then(res => {
              // console.log('保存成功');
          })
          .finally(()=>{
            this.loading = false
          })
      },
      // 恢复默认
      recoverHouseDefault(){
        this.$confirm('是否要恢复默认设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.loading = true
          this.$api.seeHouseConfigService.recoverHouseDefault({syscode:this.$local.fetch('userInfo').syscode})
          .then(res => {
              if (res.code == 200 ) {
									this.getHouseTypeConfig()
              }
            })
          .finally(()=>{
            this.loading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      // 上传图片
      uploadPicClick(item){
        this.updatePicItem = item
      },
      uploadPic(item){
        this.updatePicItem.actualValue = item.url
      },
    }
  }
  ;
</script>
<style scoped style="scss">
</style>
<style style="scss">
.state-form-label .el-form-item__content{margin-left: 20px !important;}
.state-form-box{ font-size:0}
.state-form-box li{display: inline-block; font-size:14px; margin-top:5px; margin-left:20px;}
</style>






