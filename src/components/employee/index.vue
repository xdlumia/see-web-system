<!--员工列表
/**
* 员工列表
* @/components/employee/ 员工列表
* @author web-王晓冬
* @date 2019年1月2日
**/
-->
<template>
  <div class="d-content main-content">
    <div class="mb10">
      <el-input v-if="authorityButtons.includes('sys_employee_1004')" size="medium" @keyup.native.13="$refs.employeeTable.reload()" v-model="queryForm.condition" placeholder="请输入姓名/电话/员工编号查询" class="w240"></el-input>
      <tree-select 
      v-if="authorityButtons.includes('sys_employee_1004')" size="medium" 
      v-model="queryForm.deptIdList"
      multiple
      collapse-tags
      defaultExpandAll
      :props="{label:'deptName'}"
      api="bizSystemService.getDeptList"
      :params="{ type: 0 }"
      placeholder="请选择部门"
      style="width:360px"></tree-select>
      <el-select
      v-model="queryForm.roleIdList"
      multiple
      size="medium"
      collapse-tags
      placeholder="请选择角色">
      <el-option-group
      v-for="(group,index) of roleLists"
      :key="index"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
      </el-option>
    </el-option-group>

    </el-select>

      <el-button v-if="authorityButtons.includes('sys_employee_1004')" size="medium" type="primary" @click="$refs.employeeTable.reload(1)" icon="el-icon-search">查询</el-button>
      <!-- <el-button v-if="authorityButtons.includes('sys_employee_1001')" size="medium" icon="el-icon-plus" @click="editOrAddHandle('add')">新增用户</el-button> -->
      <auth-button code='sys_employee_1001' size="medium" icon="el-icon-plus"  
          ref="roleAuthBtn"
          :noAuthIcon="true"
          :auth-pic="$store.state.systemSettings&&$store.state.systemSettings.authSettingPic"
          auth-link="/member"
          @authClick="editOrAddHandle('add')"
      >新增用户</auth-button>
      <span class="d-inline ml5 d-text-gray" v-if="isInMarket&&$refs.employeeTable">员工上限{{totalEmployeeCount||0}}/{{getSourceMaxNum('sys_employee_1001')||'∞'}}</span>
      <div class="fr mr10" v-if="authorityButtons.includes('sys_employee_1011')">
      	<span class="d-text-gray">开放注册</span>
      	<el-switch
				  @change="openRegistration"
				  v-model="allowRegister"
				>
				</el-switch>
      </div>
    </div>
    <!-- 表格数据 -->
    <d-table v-loading="isTransfering" api="bizSystemService.getEmployeeList" :params="queryForm" ref="employeeTable"  style="height:calc(100% - 40px)">
      <el-table-column type="index" align="center" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="employeeName" align="center" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="nickName" align="center" label="昵称" width="120">
      </el-table-column>
      <el-table-column prop="avatarUrl" align="center" label="头像" width="120">
        <template slot-scope="{row}">
           <img style="width: 40px; height: 40px" :src="row.avatarUrl" v-if="row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="email" align="center" label="邮箱" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="phone" min-width="120" align="center" label="电话">
      </el-table-column>
      <el-table-column prop="deptName" min-width="120" align="center" label="所属部门" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="syscode == 'asystem' && scope.row.ransferFlag==1" class="d-text-blue d-pointer" @click="viewTransferLog(scope.row)"> {{scope.row.deptName}} </span>
          <span v-else> {{scope.row.deptName}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="positionName" show-overflow-tooltip min-width="120" align="center" label="职位名称">
      </el-table-column>
      <el-table-column prop="roleNames" align="center" label="角色" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userAccount" align="center" label="用户帐号" width="140">
      </el-table-column>
      <el-table-column prop="employeeNo" align="center" label="员工编号" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" align="center" label="修改时间" width="150">
        <template slot-scope="scope">
          {{scope.row.createTime | timeToStr('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" label="状态" width="80">
        <template slot-scope="scope">
          {{scope.row.lockStatus=="0"?"启用":"禁用"}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" width="120" align="center" label="备注" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" align="left" label="操作" width="580">
        <template slot-scope="scope">
          <el-button size="mini" v-if="authorityButtons.includes('sys_employee_1009')" type="info" :disabled="scope.row.userId?true:false" plain @click="editOrAddHandle('sync',scope.row)">同步用户</el-button>

          <el-button v-if="authorityButtons.includes('sys_employee_1007')" size="mini" type="warning" plain @click="employeeHandle('employeeAuth',scope.row)">授权</el-button>
          <!-- sourceFrom:   数据来源(0 A系统用户默认方式 1 同步房脉动) -->
          <el-button v-if="authorityButtons.includes('sys_employee_1002') && scope.row.sourceFrom!=1" size="mini" type="primary" plain @click="editOrAddHandle('edit',scope.row)">修改</el-button>
          <!-- 人员调动功能仅α使用 -->
          <el-button v-if="authorityButtons.includes('sys_employee_1010') && scope.row.userId" size="mini" type="primary" plain @click="employeeTransfer(scope.row)">人员调动</el-button>
          <el-button v-if="authorityButtons.includes('sys_employee_1003') && scope.row.sourceFrom!=1" size="mini" type="danger" @click="delHandle(scope.$index, scope.row)">删除</el-button>
          <el-button v-if="authorityButtons.includes('sys_employee_1008') && scope.row.sourceFrom!=1" size="mini" type="info" plain @click="editPassWord('password',scope.row)">修改密码</el-button>

          <!--增加 锁定用户、解锁用户功能-->
          <el-button v-if="authorityButtons.includes('sys_employee_1005') && scope.row.lockStatus==0 && scope.row.sourceFrom!=1" size="mini" type="warning" plain @click="lockUser('lock',scope.row)" title="锁定用户">锁定</el-button>
          <el-button v-if="authorityButtons.includes('sys_employee_1006') && scope.row.lockStatus==1 && scope.row.sourceFrom!=1" size="mini" type="warning" plain @click="unLockUser('unlock',scope.row)" title="解锁用户">解锁</el-button>
          <!--end -->

        </template>
      </el-table-column>
    </d-table>

    <el-dialog :title="dialogMeta.title" :visible.sync="dialogMeta.visible" :width="dialogMeta.width" top="20px">
      <components :is="dialogMeta.component" :dialogMeta="dialogMeta" v-if="dialogMeta.visible" @submit="tableReload"></components>
    </el-dialog>
    <!-- 新增 / 编辑 / 授权 / 同步弹出框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="dialogWidth">
      <div v-loading="loading">
          <!-- 新增 / 编辑 -->
          <el-form label-width="80px" :model="dialogForm" ref="dialogForm" size="small">
            <div v-if="dialogType=='add' || dialogType=='edit'" >
                <el-form-item label="姓名" 
                prop="employeeName" 
                :rules="[{required: true, message: '请输入姓名'},{min: 1, max: 25, message: '不能超过25个字符' }]">
                  <el-input v-model="dialogForm.employeeName" placeholder="请输入姓名" :maxlength="25" class="w200"></el-input>
                </el-form-item>

                <el-form-item label="昵称" prop="nickName" >
                  <el-input v-model="dialogForm.nickName" placeholder="请输入昵称" :maxlength="25" class="w200"></el-input>
                </el-form-item>

                <el-form-item label="员工编号" prop="employeeNo" 
                :rules="[{required: true, message: '请输入员工编号'},{min: 1, max: 25, message: '不能超过25个字符' }]">
                  <el-input v-model.trim="dialogForm.employeeNo" placeholder="请输入员工编号" maxlength="25" class="w200"></el-input>
                </el-form-item>

                <el-form-item label="职位名称" prop="positionName">
                  <el-input v-model.trim="dialogForm.positionName" placeholder="请输入职位名称" :maxlength="25" class="w200"></el-input>
                </el-form-item>

                <el-form-item 
                label="电话"
                prop="phone" 
                :rules="[{ required: true, message: '手机号不能为空' },{ min: 11, max: 11, message: '请输入11位手机号' }]">
                  <el-input v-model="dialogForm.phone" placeholder="请输入电话" class="w200" :disabled="!!dialogForm.userAccount" :maxlength="11" :minlength="11"></el-input>
                </el-form-item>

                <el-form-item label="Email" prop="email" :rules="{ type: 'email', message: '请输入正确的邮箱地址' }">
                  <el-input v-model="dialogForm.email" placeholder="请输入email" class="w200"></el-input>
                </el-form-item>

                <!-- <el-form-item label="状态">
                    <el-radio-group v-model="dialogForm.lockStatus">
                      <el-radio label="0">启用</el-radio>
                      <el-radio label="1">禁用</el-radio>
                    </el-radio-group>
                  </el-form-item> -->

                <el-form-item label="所属部门" prop="deptName" :rules="{ required:true, message: '请输入所属部门' }">
                  <el-input v-model="dialogForm.deptName" placeholder="请选择上级部门" class="w200" disabled></el-input>
                  <!-- 是新增，或者是编辑未同步的员工， 需要选择按钮 -->
                  <el-button @click="selHandle()" v-show="chooseIsShow">选择</el-button>
                </el-form-item>
                
                <el-form-item label="备注" prop="remark">
                  <el-input :maxlength='140' type="textarea" v-model="dialogForm.remark" class="w200" placeholder="请输入备注"></el-input>
                </el-form-item>

                <el-form-item label="头像" prop="avatarUrl">
                  <upload-file :limit="{size:'5M',type:['png','jpg','gif','bmp']}" @addPictureUrl="setAvatar">
                    <img style="width: 80px; height: 80px" :src="dialogForm.avatarUrl" v-if="dialogForm.avatarUrl" />
                    <el-button size="mini" icon="el-icon-upload2" v-else>上传图片</el-button>
                  </upload-file>
                </el-form-item>
            </div>
          </el-form>
          <!-- 同步密码 -->
          <div v-if="dialogType=='sync'">
            <span>密码:</span>
            <el-input v-model="syncForm.pwd" size="small" :disabled=rowData.registerPassword placeholder="请输入密码" :type="asyncType" class="w200">
              <i @click="viewPassward" slot="suffix" class="el-input__icon el-icon-view" title="显示密码" :class="{'d-text-blue': asyncType == 'text' ,'d-text-blue':asyncType == 'password'}"></i>
            </el-input>
          </div>
      </div>
      

      <span slot="footer" class="dialog-footer">
        <div class="ac">
          <el-button type="primary" @click="saveHandle('dialogForm')" size="small">确 定</el-button>
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        </div>
      </span>
    </el-dialog>

    <!-- 树部门弹出框 -->
    <el-dialog title="选择部门" :visible.sync="dialogVisibleTree" width="300px" top="20px">
        <el-tree class="d-treeBox" :data="deptTreeData" default-expand-all :props="{children: 'children',label: 'deptName'}" @node-click="handleNodeClick"></el-tree>
    </el-dialog>

    <!--修改密码弹出框-->
    <el-dialog v-loading="loading" title="修改密码" :visible.sync="dialogVisiblePassword" :width="dialogWidth">
      <el-form ref="passwordform" :model="passwordform" label-width="80px" size="small">
        <el-form-item label="新密码">
          <el-input v-model="passwordform.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input v-model="passwordform.confirmNewPassword" placeholder="请确认新密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="small" type="primary" @click="updateSaveHandle('passwordform')">确定</el-button>
          <el-button size="small" @click="dialogVisiblePassword =false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--锁定用户-->
    <el-dialog v-loading="loading"  title="锁定用户" :visible.sync="dialogVisbleLock" :width="dialogWidth">
      <el-form ref="lockform" :model="lockform" label-width="80px">
        <el-form-item label="锁定原因">
          <el-input type="textarea" placeholder="请输入锁定原因" :rows="2" v-model="lockform.lockReason"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="small" type="primary" @click="lockUserFunc('lockform')">确定</el-button>
          <el-button size="small" @click="dialogVisbleLock =false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
let employeeSingle  = window.g.employeeSingle
import { Base64 } from 'js-base64'; //base 64加密
import employeeAuth from "./employee-auth"; //授权  
import employeeTransfer from "./employee-transfer"; //人员调动
import employeeTransferLog from "./employee-transfer-log"; //人员调动记录
import uploadFile from './../common/upload-file';
export default {
  components: {
    employeeAuth,
    employeeTransfer,
    employeeTransferLog,
    uploadFile
  },
  data () {
    return {
      single: employeeSingle, //用来判断员工授权是单选还是多选
      syscode:this.$local.fetch('userInfo').syscode, //系统code
      roleLists:[], //所有角色列表
      currentRow:{}, //当前行数据
      // dialog弹出框信息
      loading:false,
      dialogMeta:{
        title:'', //弹出框标题
        visible:false,//是否显示
        component:'',//组件
        data:'',// 当前行数据
      },
      rowData:{},
      dialogTitle: '', // 弹出框title
      dialogType: '', // dialog类型
      dialogWidth: '420px',
      dialogVisible: false, // 新增编辑弹出框
      dialogVisibleTree: false, // 树菜单
      
      dialogVisiblePassword: false, // 对应修改密码弹出框是否显示
      dialogVisbleLock: false, // 初始化默认关闭锁定用户的弹出框
      
      rolesData: [], // 角色数据
      rolePage: 1,
      // 部门树数据
      deptTreeData: [],
      // 查询表单
      queryForm: {
        condition: '',
        page:1,
        limit:15,
        deptIdList:[],
        roleIdList:[],
      },
      queryRoleParams: {
        limit:999,
        page:1,
        name: '',
        state: '',
        companyCode:this.$local.fetch('userInfo').companyCode, //公司编码  自定义角色不传此参数
        subsysCode:this.$local.fetch('userInfo').syscode, //子系统编码 自定义角色不传此参数
      },
      // 弹出框同步内容
      syncForm: {
        name: '',
        id: '',
        pwd: '',
        status: '',
        deptId: '',
        phone: '',
        email: '',
        companyId: '',
        companyCode: '',
        sysCode:''
      },

      // 新增orEdit框内容
      dialogForm: {
        employeeNo: '', //员工编号
        employeeName: '', //员工名称
        id: '', //主键id
        positionName: '', //职位名称
        lockStatus: '0', //是否锁定
        phone: '', //手机号
        email: '',//邮箱
        deptId: '', //部门id
        deptName: '', //部门名称
        userAccount:'', //用户帐号
        remark:'',
        avatarUrl:'',
        nickName:'',
      },

      asyncType: 'password', // 默认type是密码

      passwordform: {
        // 密码修改表单初始化
        id: '',
        newPassword: '',
        confirmNewPassword: ''
      },
			chooseIsShow:true,//选择部门按钮是否显示
			allowRegister:false,
      // 锁定用户初始化表单
      lockform: {
        id: '', // 用户id
        lockReason: '' // 锁定原因
      },
      totalEmployeeCount:0,// 员工总数
      isTransfering:false,
    }
  },
  computed:{
    isInMarket(){
      return this.isMarket?true:false
    }
  },
  created () {
    this.queryOpenRegistration()
    Promise.all([this.getDefaultRoleList(), this.getRoleList(),]).then((res) => {
      this.roleLists = [
        {label:'默认角色',options:res[0]},
        {label:'自定义角色',options:res[1]}
        ]
      // this.roleLists = [...res[0],...res[1]]
    })
    if(this.isMarket){
        this.$store.dispatch('systemSettings/getAuthSettingPic')
        this.getEmployeeTotalCount();
    }
  },
  methods: {
    setAvatar({url}){
      this.dialogForm.avatarUrl=url;
    },
    // 员工操作
    employeeHandle(component,row){
      let title = {
        employeeAuth:{title:'授权-当前用户' + row.employeeName,width:'720px'}
      }
      this.dialogMeta.visible = true
      this.dialogMeta.data = row
      this.dialogMeta.width = title[component].width
      this.dialogMeta.title = title[component].title
      this.dialogMeta.component = component
    },
    // 修改密码编辑事件
    editPassWord (type, data) {
      this.dialogType = type
      this.dialogVisiblePassword = true
      this.dialogWidth = '350px'
      this.passwordform.id = data.id;
      // 修改页面初始化清空数据
      (this.passwordform.newPassword = '');
      (this.passwordform.confirmNewPassword = '')
    },
    // 人员调动
    employeeTransfer(item){
      this.dialogType = 'transfer'
      this.dialogVisibleTree = true
      this.currentRow = item
      this.fnLoadDept() // 加载部门数据
    },
    // 查看调动记录
    viewTransferLog(row){
      if(!row.userId){
        this.$message({
          type: 'error',
          showClose: true,
          message: '此用户暂时没有交接记录！'
        })
        return
      }
      this.dialogMeta.visible = true
      this.dialogMeta.data = row
      this.dialogMeta.width = "720px"
      this.dialogMeta.title = "人员调动记录"
      this.dialogMeta.component = 'employeeTransferLog'
    },
    // 锁定
    lockUser (type, data) {
      // 判断是否同步
      if (!data.userId) {
        this.dialogVisbleLock = false
        this.$message({
          type: 'error',
          showClose: true,
          message: '这个用户还未同步，不能锁定！'
        })
        return
      }

      this.dialogVisbleLock = true
      this.lockform.id = data.id 
      // 清空锁定原因
      this.lockform.lockReason = ''
    },
    //开放注册更改
    openRegistration(){
    	this.loading=true
    	this.$api.bizSystemService.openRegistration({'key': 'allowRegister','value':this.allowRegister})
      .then(res => {
//        this.$refs.employeeTable.reload()
      })
      .finally(()=>{
        this.loading = false
      })
    },
    //查询开放注册
    queryOpenRegistration(){
    	this.$api.bizSystemService.queryOpenRegistration()
      .then(res => {
      	this.allowRegister = res.data
      })
      .finally(()=>{
      })
    },
    unLockUser (type, data) {
      // 判断是否同步
      if (!data.userId) {
        this.$message({
          type: 'error',
          message: '这个用户还未同步！'
        })
        return
      }
      // 直接交互
      this.$confirm('确定解锁?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.loading = true
        this.$api.bizSystemService.unlockuser({id: data.id})
          .then(res => {
            if (res.code == 200) {
              // 刷新表格列表
              this.$refs.employeeTable.reload()
            }
          })
          .finally(()=>{
            this.loading = false
          })
      }).catch(() => {});
    },

    // 锁定用户
    lockUserFunc (formName) {
      // 定义锁定原因的变量
      let lockReason = ''
      //* * 增加锁定用户交互方法
      lockReason = this.lockform.lockReason
      this.$api.bizSystemService.lockuser({lockReason: lockReason, id: this.lockform.id})
        .then(res => {
          if (res.code == 200) {
            this.dialogVisbleLock = false // 关闭锁定的用户弹出框
            // 刷新表格列表
            this.$refs.employeeTable.reload()
          }
        })
    },
    async getEmployeeTotalCount(){
      let {count} = await this.$api.bizSystemService.getEmployeeList({
        page:1,
        limit:1
      })
      this.totalEmployeeCount = count;
      return this.totalEmployeeCount;
    },
    // 编辑和新增用户
    async editOrAddHandle (type, data) {
      if(type=='add'){
        if(this.isMarket){
          let totalNum = this.getSourceMaxNum('sys_employee_1001')
          if(typeof totalNum=="number"&&totalNum!==0){
            await this.getEmployeeTotalCount();
            if((totalNum>0&&(this.totalEmployeeCount||0)/totalNum>=1)||!totalNum){
              return this.$refs.roleAuthBtn.showAuthDialog()
            }
          }
        }
      }
      this.rowData = data
      this.dialogVisible = true
      this.dialogType = type
      if (type == 'add') {
        this.dialogWidth = '420px';
        this.dialogTitle = '新增用户'
        this.chooseIsShow = true
        // 清空form表单
        this.$nextTick(()=>{
          this.$refs.dialogForm.resetFields()
          this.dialogForm.deptName = ''
          this.dialogForm.userAccount = ''
        })
      } else if (type == 'edit') {
      	//未同步的员工不会有userId，这个时候，可以编辑部门
      	if(data.userId){
      		this.chooseIsShow = false
      	}else{
      		this.chooseIsShow = true
      	}
        this.dialogTitle = '编辑：' + data.employeeName
        this.dialogWidth = '390px'
        this.$api.bizSystemService.getEmployeeInfo(data.id).then(res=>{
          let resData = res.data || {}
          for(let key in this.dialogForm){
            this.dialogForm[key] = resData[key]
          }
        })
      } else if (type == 'sync') {
        if(!data.deptName){
          this.$message({
            type:'warning',
            message:'请先在修改里增加所属部门',
            showClose:true,
          }),
          this.dialogVisible = false
        }
        let registerPassword = ''
        // 获取注册密码解密后的数据
        try{
          registerPassword = data.registerPassword?Base64.decode(data.registerPassword):''
        }
        catch(err){
          registerPassword = ''
        }
        this.dialogTitle = '同步：' + data.employeeName
        this.dialogWidth = '350px'
        this.syncForm.pwd = registerPassword
        this.syncForm.name = data.employeeName;
        this.syncForm.id = data.id
        this.syncForm.status = data.lockStatus
        this.syncForm.deptId = data.deptId
        this.syncForm.phone = data.phone
        this.syncForm.email = data.email
        this.syncForm.companyId = data.companyId
        this.syncForm.companyCode = data.companyCode
        this.syncForm.sysCode = this.$local.fetch('userInfo').syscode
      }
    },
    // 重新加载列表数据
    tableReload(){
      this.$refs.employeeTable.reload()
    },
    // 查看密码
    viewPassward () {
      if (this.asyncType == 'password') {
        this.asyncType = 'text'
      } else {
        this.asyncType = 'password'
      }
    },
    // 删除部门
    delHandle (node, data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$api.bizSystemService.delEmployee({ ids: data.id }).then(res => {
            if (res.code == 200) {
              // 重新加载表格数据
              this.$refs.employeeTable.reload()
            }
          })
        })
        .catch(() => {})
    },
    // 选择部门
    selHandle () {
      // this.dialogType = 'add'
      this.dialogVisibleTree = true
      this.fnLoadDept() // 加载部门数据
    },
    // 点击树节点回掉
    async handleNodeClick (data) {
      this.dialogVisibleTree = false // 关闭弹出框
      // 如果当前是人员调动部门选择
      if(this.dialogType == 'transfer'){
        if(this.syscode!='asystem'){
          await this.$confirm(`是否确定将${this.currentRow.employeeName}调动至${data.deptName}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
          this.isTransfering = true
          this.$api.bizSystemService.saveTransfer({
            ransferDeptId: data.id, // 转部门id
            userId: this.currentRow.userId, // 当前用户id
          })
          .then(res => {
            if (res.code == 200) {
              this.tableReload();
            }
          })
          .finally(()=>{
            this.isTransfering = false
          })
          return
        }
        this.dialogMeta.visible = true
        this.dialogMeta.dept = data
        this.dialogMeta.width = "720px"
        this.dialogMeta.title = "人员调动交接"
        this.dialogMeta.data = this.currentRow
        this.dialogMeta.component = 'employeeTransfer'
      } else{
        this.dialogForm.deptId = data.id
        this.dialogForm.deptName = data.deptName
      }
      
    },
    // 请求部门数据方法
    fnLoadDept () {
      let deptId = this.$local.fetch('userInfo').deptId
      this.$api.bizSystemService.getChildrenDept({id: deptId})
        .then(res => {
          if (res.code == 200) {
            this.deptTreeData = res.data || []
          }
        })
    },
    // 保存修改密码
    updateSaveHandle () {
      if (this.passwordform.newPassword != this.passwordform.confirmNewPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      this.$api.bizSystemService.updatePassword(this.passwordform)
        .then(res => {
          if (res.code == 200) {
            this.dialogVisiblePassword = false
          }
        })
    },
    
    getDefaultRoleList(){
      if(!this.authorityButtons.includes('sys_role_1007')){
        return
      }
      return this.$api.resourceService.getDefaultRoleList(this.queryRoleParams)
      .then(res=>{
        return res.data || []
      })
    },
    getRoleList(){
      if(!this.authorityButtons.includes('sys_role_1008')){
        return
      }
      return this.$api.bizSystemService.getRoleList(this.queryRoleParams)
      .then(res=>{
          return res.data || []
      })
    },
    // 保存表单数据
    saveHandle (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          // rules 表单验证是否通过
          let requestMeth = ''
          delete this.dialogForm.userAccount
          let paramsForm = this.dialogForm
          
          // 新增保存
          if (this.dialogType == 'add') {
            paramsForm = this.dialogForm
            requestMeth = this.$api.bizSystemService.addEmployee(paramsForm)
            requestMeth.then(res => {
            if(res.data == 'recover'){
              this.$confirm(res.msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              })
              .then(() => {
                this.loading = true
                this.$api.bizSystemService.employeeRecover({ phone: paramsForm.phone })
                  .then(res => {
                      // 重新加载表格数据
                      this.$refs.employeeTable.reload()
                      this.dialogVisible = false
                  })
                  .finally(()=>{
                    this.loading = false
                  })
              })
              .catch(() => {})
            }else {
              // 重新加载表格数据
              this.$refs.employeeTable.reload()
              // 关闭弹出框
              this.dialogVisible = false
              this.getEmployeeTotalCount();
              // 已经存在的数据 是否要恢复
            }
          })
          // 编辑保存
          } else if (this.dialogType == 'edit') {
            paramsForm = this.dialogForm
            requestMeth = this.$api.bizSystemService.updateEmployee(paramsForm)
          // 同步保存
          } else if (this.dialogType == 'sync') {
            paramsForm = this.syncForm
            requestMeth = this.$api.bizSystemService.syncEmployee(paramsForm)
          }
          requestMeth.then(res => {
            if (res.code == 200) {
              // 重新加载表格数据
              this.$refs.employeeTable.reload()
              // 关闭弹出框
              this.dialogVisible = false
              // 已经存在的数据 是否要恢复
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
.d-treeBox{height: calc(100vh - 125px); overflow-y: auto;}
</style>
