/*
 * @Author: web.王晓冬
 * @Date: 2019-06-19 14:41:20
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-09-06 09:47:36
 * @Description: file content
 */
<!--员工列表
/**
* 员工列表
* @/components/employee/ 员工列表
* @author web-王晓冬
* @date 2019年1月2日
**/
-->
<template>
  <!-- 授权内容 -->
  <div class="role-main" v-loading="loading">
    <div v-if="authorityButtons.includes('sys_role_1007')">
      <p>默认角色</p>
      <div class="role-list">
        <el-row :gutter="10">
          <div v-if="!defaultRolesData.length" class="f12 ac" style="color:#999">暂无数据</div>
          <component size="mini" :is="single ? 'el-radio-group' : 'el-checkbox-group'"
              v-model="defaultRoleList">
              <el-col class="d-elip" :title="item.roleName" :span="6" v-for="(item,index) of defaultRolesData"  :key="index">
                <component
                :title="item.roleName"
                :is="single ? 'el-radio' : 'el-checkbox'" 
                :label="item.id">
                  {{item.roleName}}
                </component>
              </el-col>
          </component>
        </el-row>
      </div>
    </div>
    <div v-if="authorityButtons.includes('sys_role_1008')">
      <p>自定义角色</p>
      <div class="role-list">
        <el-row :gutter="10">
          <div v-if="!customRolesData.length" class="f12 ac" style="color:#999">暂无数据</div>
          <component size="mini" :is="single ? 'el-radio-group' : 'el-checkbox-group'"
              v-model="customRoleList">
              <el-col class="d-elip" :title="item.roleName" :span="6" v-for="(item,index) of customRolesData"  :key="index">
                <component
                :title="item.roleName"
                :is="single ? 'el-radio' : 'el-checkbox'" 
                :label="item.id">
                  {{item.roleName}}
                </component>
              </el-col>
          </component>
        </el-row>
      </div>
    </div>
    <div class="ac mt5">
      <el-button size="small" @click="dialogMeta.visible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="saveAuth">保 存</el-button>
    </div>
  </div>
</template>
<script>
let employeeSingle  = window.g.employeeSingle           
export default {
  props: ["dialogMeta"],
  data () {
    return {
      single: employeeSingle, //用来判断员工授权是单选还是多选
      // dialog弹出框信息
      loading:false,
      defaultRolesData: [], // 默认角色数据
      customRolesData: [], // 自定义角色数据
      defaultRoleList:[], //当前选中的数据
      customRoleList:[], //当前选中的数据
      // 授权弹出内容
      authForm: {
        userId: this.dialogMeta.data.id,
        userRoleList: [
          // {
          //   roleFlag: "角色标识（0 自定义  1 默认角色）",
          //   roleId: "角色id"
          // }
        ]
      },
    }
  },
  created () {
    this.getCustomRole() //获取自定义角色
    this.getDefaultRoleList() // 获取默认角色
    this.initSelectRole()
  },
  methods: {
    initSelectRole(){
      this.$api.bizSystemService.getEmployeeInfo(this.dialogMeta.data.id)
      .then(res => {
          if (res.code == 200) {
            let data = res.data || {}
            let roles = data.roleList || {}
            roles.forEach(item => {
              // 如果授权是单选
              if(this.single){
                if(item.roleFlag == 1){
                  this.defaultRoleList = item.id
                }else{
                  this.customRoleList = item.id
                }
                return
              }
              // 如果是多选
              else{
                if(item.roleFlag == 1){
                  this.defaultRoleList.push(item.id)
                }else{
                  this.customRoleList.push(item.id)
                }
              }
            })
          }
        })
    },
    // 获取自定义角色
    // 获取自定义角色
    getCustomRole () {
      if(!this.authorityButtons.includes('sys_role_1008')){
        return
      }
      this.loading = true
      let userInfo = this.$local.fetch('userInfo')
      let params = {
        limit: 999,
        page: 1,
        state: 0,
        subsysCode:userInfo.syscode, //子系统编码 自定义角色不传此参数
      }
      this.$api.bizSystemService.getRoleList(params)
      .then(res => {
          this.customRolesData  = res.data || []
          
      }).finally(()=>{
        this.loading = false
      })
    },
    // 获取默认角色
    getDefaultRoleList () {
      if(!this.authorityButtons.includes('sys_role_1007')){
        return
      }
      this.loading = true
      let userInfo = this.$local.fetch('userInfo')
      let params = {
        limit:999,
        page:1,
        companyCode:userInfo.companyCode, //公司编码  自定义角色不传此参数
        subsysCode:userInfo.syscode, //子系统编码 自定义角色不传此参数
      }
      this.$api.resourceService.getDefaultRoleList(params)
      .then(res => {
          this.defaultRolesData  = res.data || []
      }).finally(()=>{
        this.loading = false
      })
    },
    // 保存表单数据
    saveAuth (formName) {
      let defaultList = this.defaultRoleList.map(roleId=>{
        return {roleFlag:1,roleId:roleId}
      })
      let customList = this.customRoleList.map(roleId=>{
        return {roleFlag:0,roleId:roleId}
      })
      // 合并选中的默认角色和自定义角色
      this.authForm.userRoleList = defaultList.concat(customList)
      this.loading = true
      this.authForm.subsysCode = this.$local.fetch('userInfo').syscode
      this.$api.bizSystemService.authEmployee(this.authForm)
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
.role-list {
  border: 1px solid #efefef;
  padding: 10px;
  border-radius: 3px;
  max-height: 120px;
  overflow-y: auto;
}
.role-list label{display: block; line-height: 20px;}
</style>
