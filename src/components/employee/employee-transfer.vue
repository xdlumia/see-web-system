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
      <el-form label-width="110px" ref="dialogForm" :model="transferForm" class="pr20 mt10" size="small">
        <div v-show="!responserTotal && !managerTotal">没有任何操作</div>
        <article v-if="responserTotal">
            <h3 class="f14">责任盘 <span class="d-text-blue ml10">{{responserTotal}}</span></h3>
            <div style="height:40px">
                <el-radio v-model="transferForm.responseType" label="0">指定人员</el-radio>
                <employees-chosen v-if="transferForm.responseType==0" v-model="selResponse" :multiple="false">
                    <el-input size="mini" v-model="transferForm.responseName" class="d-inline w120" placeholder="请选择人员">分配管家</el-input>
                </employees-chosen>
                <el-radio v-model="transferForm.responseType" label="1">取消责任盘</el-radio>
                <el-radio v-model="transferForm.responseType" label="2">不交接</el-radio>
            </div>
        </article>
        <article v-if="managerTotal">
            <h3 class="f14">房源管家 <span class="d-text-blue ml10">{{responserTotal}}</span></h3>
            <div style="height:40px">
                <el-radio v-model="transferForm.houseType" label="0">指定人员</el-radio>
                <employees-chosen v-if="transferForm.houseType==0" v-model="selHousePerson" :multiple="false">
                    <el-input size="mini" v-model="transferForm.houseName" class="d-inline w120" placeholder="请选择人员">分配管家</el-input>
                </employees-chosen>
                <el-radio v-model="transferForm.houseType" label="1">取消责任盘</el-radio>
                <el-radio v-model="transferForm.houseType" label="2">不交接</el-radio>
            </div>
        </article>
      </el-form>
    <div class="ac mt5">
      <el-button size="small" @click="dialogMeta.visible = false">取 消</el-button>
      <el-button type="primary" size="small" v-if="responserTotal || managerTotal" @click="saveTransfer">保 存</el-button>
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
      // 授权弹出内容
      transferForm: {
        ransferDeptId: '', // 转部门id
        responseType: '', // 责任盘交接类型
        responseName: '', // 责任盘交接员工名称
        responsePersonId: '', // 责任盘交接人员id
        houseType: '', //房源管家交接类型
        housePersonId: '', // 房源管家交接人员id
        houseName: '', // 房源管家交接人员名称
        userId: '' // 当前用户id
      },
    }
  },
  created () {
    if(this.dialogMeta.data.userId){
      this.getBuildingInfoByResponserId()      
      this.getCommunityManagerTotal()
      this.transferForm.userId = this.dialogMeta.data.userId
      this.transferForm.ransferDeptId = this.dialogMeta.deptId
    }
  },
  computed:{
    // 责任盘人员选择
    selResponse:{
      get (user) {
          return user
      },
      set (user) {
          this.transferForm.responsePersonId = user.userId
          this.transferForm.responseName = user.employeeName
      }
    },
    // 楼盘管家人员选择
    selHousePerson:{
      get (user) {
          return user
      },
      set (user) {
          this.transferForm.housePersonId = user.userId
          this.transferForm.houseName = user.employeeName
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
    
    // 保存人员调动
    saveTransfer () {
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
  }
}
</script>
<style scoped>
</style>
