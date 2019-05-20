<!--员工列表
/**
* 员工列表
* @/components/employee/ 员工调整
* @author web-王晓冬
* @date 2019年1月2日
**/
-->
<template>
  <!-- 授权内容 -->
  <div v-loading="loading">
      <el-form ref="transferForm" :model="transferForm" class="pr20 mt10" size="small">
        人员"{{dialogMeta.data.employeeName}}",从"{{dialogMeta.data.deptName}}"调动到"{{dialogMeta.dept.deptName}}"
        <div v-show="!responserTotal && !managerTotal">没有任何操作</div>
        <article v-if="responserTotal">
            <h3 class="f14">责任盘 <span class="d-text-blue ml10">{{responserTotal}}</span></h3>
            <el-form-item prop="responseObj.responseType" :rules="{required:true,message:'请选择类型'}">
                <el-radio v-model="transferForm.responseObj.responseType" label="0">指定人员</el-radio>
                <employees-chosen v-if="transferForm.responseObj.responseType==0" v-model="selResponse" :multiple="false">
                    <el-input size="mini" v-model="transferForm.responseObj.name" class="d-inline w120" placeholder="请选择人员">分配管家</el-input>
                </employees-chosen>
                <el-radio v-model="transferForm.responseObj.responseType" label="1">取消责任盘</el-radio>
                <el-radio v-model="transferForm.responseObj.responseType" label="2">不交接</el-radio>
            </el-form-item>
        </article>
        <article v-if="managerTotal">
            <h3 class="f14">房源管家 <span class="d-text-blue ml10">{{managerTotal}}</span></h3>
            <el-form-item prop="houhouseObj.houseTypeeType" :rules="{required:true,message:'请选择类型'}">
                <el-radio v-model="transferForm.houseObj.houseType" label="0">指定人员</el-radio>
                <employees-chosen v-if="transferForm.houseObj.houseType==0" v-model="selHousePerson" :multiple="false">
                    <el-input size="mini" v-model="transferForm.houseObj.name" class="d-inline w120" placeholder="请选择人员">分配管家</el-input>
                </employees-chosen>
                <el-radio v-model="transferForm.houseObj.houseType" label="1">取消房源管家</el-radio>
                <el-radio v-model="transferForm.houseObj.houseType" label="2">不交接</el-radio>
            </el-form-item>
        </article>
        <article v-if="collectTotal">
            <h3 class="f14">收房人 <span class="d-text-blue ml10">{{collectTotal}}</span></h3>
            <el-form-item prop="collectObj.collentHouseType" :rules="{required:true,message:'请选择类型'}">
                <el-radio v-model="transferForm.collectObj.collentHouseType" label="0">指定人员</el-radio>
                <employees-chosen v-if="transferForm.collectObj.collentHouseType==0" v-model="selCollectPerson" :multiple="false">
                    <el-input size="mini" v-model="transferForm.collectObj.name" class="d-inline w120" placeholder="请选择人员">分配管家</el-input>
                </employees-chosen>
                <el-radio v-model="transferForm.collectObj.collentHouseType" label="2">不交接</el-radio>
            </el-form-item>
        </article>
        <!-- 
        <article v-if="collectTotal">
            <h3 class="f14">收房人 <span class="d-text-blue ml10">{{managerTotal}}</span></h3>
            <el-form-item prop="houseType" :rules="{required:true,message:'请选择类型'}">
                <el-radio v-model="transferForm.houseType" label="0">指定人员</el-radio>
                <employees-chosen v-if="transferForm.houseType==0" v-model="selHousePerson" :multiple="false">
                    <el-input size="mini" v-model="transferForm.houseName" class="d-inline w120" placeholder="请选择人员">分配管家</el-input>
                </employees-chosen>
                <el-radio v-model="transferForm.houseType" label="2">不交接</el-radio>
            </el-form-item>
        </article>-->
      </el-form>
    <div class="ac mt5">
      <el-button size="small" @click="dialogMeta.visible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="saveTransfer">确 定</el-button>
    </div>
  </div>
</template>
<script>
let employeeSingle  = window.g.employeeSingle           
export default {
  props: ["dialogMeta"],
  data () {
    return {
      loading:false,
      single: employeeSingle, //用来判断员工授权是单选还是多选
      authorityBtn: this.$local.fetch('authorityBtn').sys_employee || [], // 权限码
      responserTotal:'', //责任盘总数
      managerTotal:'', //房源管家总数
      collectTotal:'', //收房人总数
      // 授权弹出内容
      transferForm: {
        ransferDeptId: '', // 转部门id
        // responseType: '', // 责任盘交接类型
        // responseName: '', // 责任盘交接员工名称
        // responsePersonId: '', // 责任盘交接人员id
        // houseType: '', //房源管家交接类型
        // housePersonId: '', // 房源管家交接人员id
        // houseName: '', // 房源管家交接人员名称
        userId: '', // 当前用户id
        // 收房人
        collectObj: {
          collectHousePersonId: '',
          collentHouseType: ''
        },
        // 房源管家
        houseObj: {
          housePersonId: '',
          houseType: ''
        },
        // 责任盘交接
        responseObj: {
          responsePersonId: '',
          responseType: ''
        },
      },
    }
  },
  created () {
    if(this.dialogMeta.data.userId){
      this.getBuildingInfoByResponserId()      
      this.getCommunityManagerTotal()
      this.queryCollectHouseByUserId()
      this.transferForm.userId = this.dialogMeta.data.userId
      this.transferForm.ransferDeptId = this.dialogMeta.dept.id
    }
  },
  computed:{
    // 责任盘人员选择
    selResponse:{
      get (user) {
          return user.userId
      },
      set (user) {
          this.transferForm.responseObj.responsePersonId = user.userId
          this.transferForm.responseObj.name = user.employeeName
      }
    },
    // 楼盘管家人员选择
    selHousePerson:{
      get (user) {
          return user.userId
      },
      set (user) {
          this.transferForm.houseObj.housePersonId = user.userId
          this.transferForm.houseObj.name = user.employeeName
      }
    },
    // 收房人人员选择
    selCollectPerson:{
      get (user) {
          return user.userId
      },
      set (user) {
          this.transferForm.collectObj.collectHousePersonId = user.userId
          this.transferForm.collectObj.name = user.employeeName
      }
    },
  },
  methods: {
    // 获取某责任人负责的栋座信息 责任盘
    getBuildingInfoByResponserId(){
      this.$api.seeBaseHouseService.getBuildingInfoByResponserId(this.dialogMeta.data.userId)
      .then(res=>{
        this.responserTotal = res.data.num || ''
      })
    },
    // 根据员工id,查询员工负责的楼盘数 房源管理
    getCommunityManagerTotal(){
      this.$api.seeTenementService.getCommunityManagerTotal({userId:this.dialogMeta.data.userId})
      .then(res=>{
        this.managerTotal = res.data.totalCount || ''
      })
    },
    // 查询收房人
    queryCollectHouseByUserId(){
      this.$api.seeTenementService.queryCollectHouseByUserId({userId:this.dialogMeta.data.userId})
      .then(res=>{
        let data = res.data || []
        this.collectTotal = data.length
      })
    },
    
    // 保存人员调动
    saveTransfer () {
      this.$refs.transferForm.validate((valid) => {
          if (valid) {
            if(this.transferForm.responseObj.responseType === '0' && !this.transferForm.responseObj.responsePersonId){
               this.$message.error('请选择指定责任人')
               return
            }
            if(this.transferForm.houseObj.houseType === '0' && !this.transferForm.houseObj.housePersonId){
               this.$message.error('请选择指定人员')
               return
            }
            if(this.transferForm.collectObj.collentHouseType === '0' && !this.transferForm.collectObj.collectHousePersonId){
               this.$message.error('请选择收房人员')
               return
            }
            this.loading = true
            this.$api.bizSystemService.saveTransfer(this.transferForm)
            .then(res => {
              if (res.code == 200) {
                // 重新加载表格数据
                this.$emit('submit','success')
                // 关闭弹出框
                this.dialogMeta.visible = false
              }
            })
            .finally(()=>{
              this.loading = false
            })
          }
      })
      
    }
  }
}
</script>
<style scoped>
</style>
