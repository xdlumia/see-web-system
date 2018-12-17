<!--私有组件：抄录账单列表
/**
* 角色管理
* @system 组件存放位置
* @desc 角色管理页面
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
    <div class="d-content main-content">
      <el-form :model="queryForm" size="medium" @submit.native.prevent>
        <el-form-item inline class="d-inline mr30 mb10" >
          <el-input  v-if="authorityBtn.includes('sys_role_1004')" @keyup.native.13="queryHandle" v-model.trim="queryForm.name" placeholder="请输入角色名称" class="w200"></el-input>
          <div  v-if="authorityBtn.includes('sys_role_1004')" class="d-inline mt0">
              <el-select v-model="queryForm.state" slot="prepend" placeholder="请选择" size="medium">
                <el-option label="请选择" value=""></el-option>
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
          </div>
          <el-button v-if="authorityBtn.includes('sys_role_1004')" type="primary" @click="queryHandle()" icon="el-icon-search">查询</el-button>
          <el-button v-if="authorityBtn.includes('sys_role_1001')" size="medium" icon="el-icon-plus" @click="editOrAddHandle('add')"  >新增角色</el-button>
        </el-form-item>
      </el-form>
    <!-- 表格数据 -->
    <el-table
      height="calc(100% - 70px)"
      :data="tableDate"
      border
      v-loading="loading"
      size="small"
      style="width: 100%">
      <el-table-column
        align="center"
        label="序号"
        width="50">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="roleName"
        align="center"
        label="名称"
        width="160">
      </el-table-column>
      <el-table-column
        prop="roleTypeName"
        align="center"
        label="角色类型"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isDelete=="0"?"启用":"禁用"}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        width="280"
        align="center"
        label="角色描述">
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="操作"
        width="360">
        <template slot-scope="scope">
          <el-button v-if="authorityBtn.includes('sys_role_1005')" size="mini" type="warning" plain @click="editOrAddHandle('fnAuth',scope.row)">功能授权</el-button>
          <el-button v-if="authorityBtn.includes('sys_role_1006')" size="mini" type="warning" plain @click="editOrAddHandle('dataAuth',scope.row)">数据授权</el-button>
          <el-button v-if="authorityBtn.includes('sys_role_1002')" size="mini" type="primary" plain @click="editOrAddHandle('edit',scope.row)"  >修改</el-button>
          <el-button v-if="authorityBtn.includes('sys_role_1003')" size="mini" type="danger" @click="delHandle(scope.$index, scope.row)"  >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template>
      <el-pagination
        @current-change="currChangeHandle"
        :current-page.sync="tableCurr"
        :page-size="tableLimit"
        layout="total, prev, pager, next"
        :total="tableCount">
      </el-pagination>
    </template>

      <!-- 新增编辑弹出框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :width="dilaogWidth">
        <div v-show="dialogType=='edit' || dialogType=='add'">
          <el-form label-width="80px" :model="addOrEditForm" :rules="rules" ref="addOrEditForm" size="small">
            <el-form-item label="名称" class="mb10" prop="name">
              <el-input v-model.trim="addOrEditForm.name" placeholder="请输入角色名称" :maxlength="25" class="w240"></el-input>
            </el-form-item>

            <el-form-item label="状态" class="mb10">
              <el-radio-group v-model="addOrEditForm.state">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色类型" class="mb10" prop="roleTypeId">
              <el-select v-model="addOrEditForm.roleTypeId">
                <el-option v-for="(item,index) of roleTypeData" :key="index" :label="item.typeName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色描述" class="mb10">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="addOrEditForm.description"
                class="w240">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="dialogType=='fnAuth'" class="d-treeBox">
             <el-tree
             ref="tree"
             :data="treeData"
             show-checkbox
             node-key="id"
             v-loading="loading"
             :default-expanded-keys="treeexpanded"
             :default-checked-keys="treeexpanded"
             :props="{label: 'name'}">
             </el-tree>
        </div>
        <div v-show="dialogType=='dataAuth'">
          <div class="d-hidden bb pb10">
            <div class="fl">
              <span style="margin-left:12px;">模板选择</span>
              <el-select v-model="modalSelected" @change="modalSelChange" value-key="id" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) of modalOptions"
                    :key="index"
                    :label="item.name"
                    :value="item">
                  </el-option>
              </el-select>
            </div>
            <!-- <div class="fr">
                <el-checkbox v-model="fieldAuthCheck" @change="dataFieldHandle('fieldAuthCheck')">字段权限</el-checkbox>
                <el-checkbox v-model="dataAuthCheck" @change="dataFieldHandle('dataAuthCheck')">数据权限</el-checkbox>
            </div> -->
          </div>
          <el-form ref="rmDataAuthForm" :model="rmDataAuthForm" label-width="80px" size="small" class="bl br">
            <el-form-item label="字段权限" class="bb">
              <el-checkbox-group v-model="colSetting">
                <el-checkbox
                v-for="(item,index) of authFieldList"
                :key="index"
                :label="item.fieldCode"
                v-if="
                item.isShowControl"
                @change="colSettingChange"
                name="type"
                >{{item.fieldName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="数据权限" class="bb">
              <el-checkbox-group v-model="rowSettingList">
                <el-checkbox
                v-for="(item,index) of authFieldList"
                :label="item.fieldCode"
                @change="rowSettingListChange"
                :key="index" >{{item.fieldName}}</el-checkbox>
              </el-checkbox-group>
              <div v-for="(item,index) of rmDataAuthForm.rowSettingList" :key="index">
                <div class="label-left">{{item.fieldName}}:</div>
                <div class="d-hidden mb10" v-if="item.condType==1">
                  <el-radio-group v-model="item.dateCondType" class="fl" style="margin-top:8px;">
                    <el-radio :label="0" name="type">本日</el-radio>
                    <el-radio :label="1" name="type">近一周</el-radio>
                    <el-radio :label="2" name="type">近一月</el-radio>
                    <el-radio :label="4" name="type">自定义近多少天</el-radio>
                  </el-radio-group>
                  <el-input-number
                  v-show="item.dateCondType ==4"
                  class="fl ml20"
                  placeholder="近多少天"
                  v-model="item.specifyDays"
                  size="mini"
                  controls-position="right"
                  :min="1"></el-input-number>
                </div>
                <div class="d-hidden mb10" v-else-if="item.condType==2">
                  <el-input class="fl w240" placeholder="请输入内容" v-model="item.fieldValue"></el-input>
                </div>
                <div class="d-hidden mb10" v-else-if="item.condType==0">
                  <el-radio-group v-model="item.deptCondType" class="fl mr15" style="margin-top:9px;">
                    <el-radio :label="1" name="type">本部门（包含下级部门）</el-radio>
                    <el-radio :label="2" name="type">本部门（不含下级部门）</el-radio>
                    <el-radio :label="3" name="type">本公司</el-radio>
                    <el-radio :label="4" name="type">自定义部门</el-radio>
                  </el-radio-group>
                  <el-button size="mini"  @click="deptSel(item)" v-show="item.deptCondType==4">选择</el-button>
                  <span v-show="item.deptCondType==4">
                    <el-tag class="mr5" size="medium" v-for="(item,index) of item.fieldDisplayValue || []" :key="index">{{item.name}}</el-tag>
                  </span>
                </div>
                <div class="d-hidden mb10" v-else-if="item.condType==3">
                  <el-radio-group v-model="item.empCondType" class="fl mr15" style="margin-top:9px;">
                    <el-radio :label="0" name="type">本人</el-radio>
                    <el-radio :label="1" name="type">指定人</el-radio>
                  </el-radio-group>
                  <employees-chosen v-show="item.empCondType==1" v-model="userArr">
                         <el-button size="mini" class="ba d-text-blue ml10 d-pointer" >选择</el-button>
                  </employees-chosen>
                  <el-tag size="medium" class="mr5" :closable="false" @close="delUserArr(item)" v-for="(item,index) of userArr" :key="index">{{item.employeeName}}</el-tag>
                </div>

              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <div class="ac">
            <el-button type="primary" @click="saveHandle('addOrEditForm')" size="small">确 定</el-button>
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          </div>
        </span>
      </el-dialog>
      <!-- 树部门弹出框 -->
      <el-dialog
        title="选择部门"
        :visible.sync="dialogVisibleTree"
        width="300px">
        <div class="deptTreeBox">
            <el-tree
            :data="deptData"
            show-checkbox
            node-key="id"
            :check-strictly="true"
            :default-checked-keys="deptTreeCheck"
            default-expand-all
            :expand-on-click-node="false"
            :props="{ children: 'children', label: 'deptName', }"
            ref="deptData"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <div class="ac">
            <el-button type="primary" @click="saveDept()" size="small">确 定</el-button>
            <el-button @click="dialogVisibleTree = false" size="small">取 消</el-button>
          </div>
        </span>
      </el-dialog>
</div>
</template>
<script>
/* eslint-disable eqeqeq */
export default {
  components: {
  },
  data () {
    return {
      authorityBtn: this.$local.fetch('authorityBtn').sys_role || [], // 权限码
      dialogVisible: false, // 新增编辑弹出框
      dilaogWidth: '', // 弹出框宽度
      isShowEle: true,
      dialogTitle: '', // 弹出框名称
      dialogType: '', // dialog类型

      loading: true, // loading动画
      tableDate: [], // 表格数据
      tableCurr: 1,
      tableCount: 0,
      tableLimit: 15,
      saveEnabal: true, // 截流 防止多次保存
      roleTypeData:[],
      treeData: [], // 树菜单数据
      treeexpanded: [],
      // 弹出框输入框验证
      rules: {
        name: [
          { required: true, message: '请输入名称,不能超过 25 个字符', trigger: 'blur' },
          { min: 1, max: 25, message: '不能超过25个字符' }
        ],
        roleTypeId:{required:true,message:'请选择角色类型'}
      },

      // 查询表单
      queryForm: {
        name: '',
        state: ''
      },

      // 新增orEdit框内容
      addOrEditForm: {
        name: '',
        id: '',
        state: '',
        description: '',
        roleTypeId:''
      },
      userArr: [],
      // 功能授权弹出内容
      authForm: {
        roleId: '',
        resourceId: []
      },
      // 数据授权
      dialogVisibleTree: false, // 选择部门弹出框
      deptTreeCheck: [], // 数据权限部门数选择
      DEPTSELITEM: {}, // 选择部门的时候保存的数据
      deptData: [], // 部门数据
      //  数据源模板
      modalOptions: [],
      // 当前选中模板
      modalSelected: '',
      // 字段权限列表
      authFieldList: [],
      // 头设置
      colSetting: [],
      // 行设置
      rowSettingList: [],
      // 数据权限设置表单
      rmDataAuthForm: {
        code: '', // 数据源编码(程序里用）
        colSetting: [],
        id: '',
        pageDatasourceId: '', // 数据源id
        pageDatasourceName: '', // 数据源名称
        roleId: '', // 角色id
        rowSettingList: [
          // {
          //   condType: '', //条件类型(0部门人员条件,1日期条件,2字段条件）,
          //   dataauthId: '', //数据权限id,
          //   dateCondType: '', //日期条件(0当日1本周2本月3本年4指定天数（从今天往前推的天数),
          //   deptCondType: '', //部门人员条件类型(0本人1本部门-包含下级部门2本部门-不含下级部门3本公司),
          //   fieldCode: '', //条件字段code,
          //   fieldName: '', //条件字段名,
          //   fieldValue: '', //字段条件值，多个逗号分隔,
          //   id: '', //0,
          //   specifyDays: '', //指定天数
          // }
        ] // 有多个时是and的关系
      }

      // authorityBtn:[], //按钮数组
      // searchBtn:false, // 是否出现新增按钮
      // addBtn:false, // 是否出现新增按钮
      // editBtn:false,  // 是否出现编辑按钮
      // deleteBtn:false,  // 是否出现删除按钮
    }
  },
  created () {
    // 初始化表格数据
    this.fnTableData({page: 1, limit: 15})
    this.getRoleTypeData() //获取角色列表数据
    // 执行请求部门树数据方法
    this.fnLoadDeptTree()
  },
  methods: {

    // 表格查询
    queryHandle: function () {
      let params = {
        page: 1,
        limit: 15,
        name: this.queryForm.name,
        state: this.queryForm.state
      }
      // 执行请求部门树数据方法
      this.fnTableData(params)
    },
    // 获取角色类型列表
    getRoleTypeData(){
      this.$api.bizSystemService.getRoleType()
      .then(res=>{
        if(res.code==200){
          this.roleTypeData = res.data || []
        }
      })
    },
    // 请求表格数据
    fnTableData: function (params) {
      this.loading = true
      this.$api.bizSystemService.getRoleList(params).then(res => {
        if (res.code == 200) {
          this.tableDate = res.data || []// 加载数据
          this.tableCount = res.count
          this.tableLimit = res.limit
          this.tableCurr = res.curr
        }
      }).finally(() => {
        this.loading = false // 关闭loading
      })
    },
    // 点击树节点回掉
    // handleNodeClick(data){
    //    this.dialogVisibleTree=false; //关闭弹出框
    //    this.dilogForm.parentId = data.id
    //    this.parentName = data.deptName
    // },

    fnLoadDeptTree: function () {
      // 请求部门树数据方法
      let params = {type: 0}
      this.$api.bizSystemService.getDeptList(params).then(res => {
        if (res.code == 200) {
          this.deptData = res.data || []
        }
      })
    },
    // 请求树数据方法
    fnLoadTree: function (params) {
      this.loading = true
      this.$api.bizSystemService.getAuthRoleList(params).then(res => {
        if (res.code == 200) {
          let tData = res.data || []
          this.treeData = tData
          this.treeexpanded = this.getCheck(tData)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getCheck (data) {
      var checkData = []
      recursion(data)
      function recursion (data) {
        data.forEach(function (item) {
          if (item.children) {
            let subData = item.children
            recursion(subData)
          } else {
            if (item.checked) {
              checkData.push(item.id)
            }
          }
        })
      }
      return checkData
    },
    // 选择部门
    deptSel: function (item) {
      // let deptIds = item.fieldValue || []
      this.deptTreeCheck = []
      // console.log(this.deptTreeCheck)

      this.DEPTSELITEM = item
      this.dialogVisibleTree = true
    },
    saveDept () {
      let deptArr = this.$refs.deptData.getCheckedNodes()
      this.DEPTSELITEM.fieldDisplayValue = deptArr.map(item => {
        item.name = item.deptName
        return item
      })
      this.DEPTSELITEM.fieldValue = this.DEPTSELITEM.fieldDisplayValue.map(item => {
        return item.id
      }).join(',')
      this.dialogVisibleTree = false
    },
    delUserArr (item) {
      this.userArr.splice(this.userArr.indexOf(item), 1)
    },
    // 表格翻页
    currChangeHandle (page) {
      var params = {
        page: page,
        limit: 15,
        name: this.queryForm.name,
        state: this.queryForm.state
      }
      // // 执行请求部门树数据方法
      this.fnTableData(params)
    },
    // 编辑和新增用户
    editOrAddHandle (type, data) {
      this.dialogVisible = true
      this.dialogType = type
      if (type == 'add') {
        this.rules.name[0].required = true
        this.rules.roleTypeId.required=true
        this.dialogTitle = '新增角色'

        this.dilaogWidth = '420px'

        this.addOrEditForm.name = ''
        this.addOrEditForm.id = ''
        this.addOrEditForm.state = '0'
        this.addOrEditForm.description = ''
        this.addOrEditForm.roleTypeId = ''
      } else if (type == 'edit') {
        this.dialogTitle = '编辑：' + data.roleName
        this.dilaogWidth = '420px'

        this.addOrEditForm.name = data.roleName
        this.addOrEditForm.id = data.id
        this.addOrEditForm.state = data.isDelete + ''
        this.addOrEditForm.roleTypeId=data.roleTypeId || ''
        this.addOrEditForm.description = data.remark
      } else if (type == 'fnAuth') {
        // 功能权限
        this.rules.name[0].required = false
        this.rules.roleTypeId.required=false
        this.dialogTitle = '功能授权-当前角色:' + data.roleName
        this.dilaogWidth = '360px'

        this.authForm.roleId = data.id

        // 获取菜单树
        this.fnLoadTree({roleIds: data.id})
      } else if (type == 'dataAuth') {
        // 清空form
        this.colSetting = []
        this.rowSettingList = []
        for (var key in this.rmDataAuthForm) {
          if (key == 'colSetting' || key == 'rowSettingList') {
            this.rmDataAuthForm[key] = []
          } else {
            this.rmDataAuthForm[key] = ''
          }
        }
        this.userArr = []
        this.rules.name[0].required = false
        // 数据权限
        this.dialogTitle = '数据授权-当前角色:' + data.roleName
        this.dilaogWidth = '1220px'
        this.rmDataAuthForm.roleId = data.id // 获取角色id
        //  获取数据源模板
        this.$api.resourceService.getDataSourceList({companyCode: data.companyCode}).then(res => {
          if (res.code == 200) {
            // 数据源模板列表
            this.modalOptions = res.data || []
            // 选中第一个模板
            this.modalSelected = res.data[0] || ''
            this.rmDataAuthForm.code = res.data[0].code || ''
            this.rmDataAuthForm.pageDatasourceId = res.data[0].id || ''
            this.rmDataAuthForm.pageDatasourceName = res.data[0].name || ''
            // 根据id获取数据源列表
            this.getAuthFieldList({dataSourceId: res.data[0].id})
            // 根据id获取数据源详情
            this.getInfoRmDataAuth({dataSourceId: res.data[0].id, roleId: data.id})
          }
        })
      }
    },
    // 数据权限 选择模板
    modalSelChange (item) {
      let roleId = this.rmDataAuthForm.roleId
      // 清空form
      this.colSetting = []
      this.rowSettingList = []
      for (var key in this.rmDataAuthForm) {
        if (key == 'colSetting' || key == 'rowSettingList') {
          this.rmDataAuthForm[key] = []
        } else {
          this.rmDataAuthForm[key] = ''
        }
      }
      this.rmDataAuthForm.code = item.code || ''
      this.rmDataAuthForm.pageDatasourceId = item.id || ''
      this.rmDataAuthForm.pageDatasourceName = item.name || ''
      this.rmDataAuthForm.roleId = roleId
      // 根据id获取数据源列表
      this.getAuthFieldList({dataSourceId: item.id})
      // 根据id获取数据源详情
      this.getInfoRmDataAuth({dataSourceId: item.id, roleId: this.rmDataAuthForm.roleId})
    },
    // 获取字段权限列表
    colSettingChange (val) {
      this.rmDataAuthForm.colSetting = []
      this.authFieldList.forEach((item) => {
        if (item.isShowControl) {
          this.rmDataAuthForm.colSetting.push({
            fieldCode: item.fieldCode,
            fieldName: item.fieldName,
            type: 0
          })
        }
      })
      this.colSetting.forEach((val) => {
        for (let item of this.rmDataAuthForm.colSetting) {
          if (item.fieldCode == val) {
            item.type = 1
            break
          }
        }
      })
    },
    // 获取数据权限列表
    rowSettingListChange () {
      this.rmDataAuthForm.rowSettingList = []
      //通过多选的code 获取对应的数据
      let rsList = this.authFieldList.filter(item=>{
          return this.rowSettingList.includes(item.fieldCode)
      })  
      // 把选中的数据添加到form表单对应的字段里
      rsList.forEach(item=>{
          let condType = ''
            if (item.fieldType == 2) { // 2=日期
              condType = 1
            } else if (item.fieldType == 6) { // 6=部门
              condType = 0
            } else if (item.fieldType == 7) { // 7=指定人
              condType = 3
            } else {
              condType = 2
            }
            this.rmDataAuthForm.rowSettingList.push({
              condType: condType,
              dataauthId: item.datasourceId,
              // dateCondType:item.dateCondType||'',
              // deptCondType:item.deptCondType||'',
              fieldCode: item.fieldCode,
              fieldName: item.fieldName,
              fieldValue: item.fieldValue,
              id: item.id,
              specifyDays: item.specifyDays
            })
      })
    },
    // 删除部门
    delHandle (node, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$api.bizSystemService.delRole({id: data.id}).then(res => {
          if (res.code == 200) {
            // 执行请求部门树数据方法
            this.fnTableData({page: 1, limit: 15})
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 保存表单数据
    saveHandle (formName) {
      // 保存数据权限
      if (this.dialogType == 'dataAuth') {
        this.rmDataAuthForm.rowSettingList.forEach(item => {
          if (item.condType == 3) {
            item.fieldValue = this.userArr.map(item => {
              return item.userId
            }).join(',')
          }
        })
        this.$api.bizSystemService.saveRmDataAuth(this.rmDataAuthForm).then(res => {
          if (res.code == 200) {
            this.dialogVisible = false
          }
        })
        return
      }
      // 部门新增修改保存
      // 截流 防止多次保存
      this.$refs[formName].validate((valid) => {
        if (valid) { // rules 表单验证是否通过
          // if(!this.saveEnabal){
          //     return
          //   }
          //   this.saveEnabal = false
          let requestMeth = ''
          // let dataUrl = ''
          let paramsForm = this.addOrEditForm

          if (this.dialogType == 'add') {
            //  dataUrl='/rmrole/save'
            paramsForm = this.addOrEditForm
            requestMeth = this.$api.bizSystemService.addRole(paramsForm)
          } else if (this.dialogType == 'edit') {
            //  dataUrl='/rmrole/update'
            paramsForm = this.addOrEditForm
            requestMeth = this.$api.bizSystemService.updateRole(paramsForm)
          } else if (this.dialogType == 'fnAuth') {
            // dataUrl='/rmrole/updateRoleResource'
            let checks = this.$refs.tree.getCheckedKeys()
            let halfChecks = this.$refs.tree.getHalfCheckedKeys()
            let ids = checks.concat(halfChecks)
            this.authForm.resourceId = ids.join(',')
            paramsForm = this.authForm
            requestMeth = this.$api.bizSystemService.syncRole(paramsForm)
          }
          requestMeth.then(res => {
            if (res.code == 200) {
              // 执行请求部门树数据方法
              this.fnTableData({page: 1, limit: 15})
              // 关闭弹出框
              this.dialogVisible = false
              // 0.3秒以后可以重新保存 防止快速重复点击
              setTimeout(function () {
                this.saveEnabal = true
              }, 300)
            }
          })
        } else {
          return false
        }
      })
    },
    //  获取权限数据源详情
    getInfoRmDataAuth (params) {
      this.$api.bizSystemService.getInfoRmDataAuth(params).then(res => {
        if (res.code == 200) {
          // 回写表单
          if (res.data != null) {
            this.rmDataAuthForm = res.data
          }
          // 回写数据选中
          this.colSetting = []
          let colList = this.rmDataAuthForm.colSetting || []
          colList.forEach((item) => {
            if (item.type == 1) {
              this.colSetting.push(item.fieldCode)
            }
          })
          // 回写字段选中
          this.rowSettingList = []
          let rowList = this.rmDataAuthForm.rowSettingList || []
          rowList.forEach((item) => {
            this.rowSettingList.push(item.fieldCode)
            // 回写指定人员
            if (item.condType == 3) {
              if (item.fieldDisplayValue == null) {
                item.fieldDisplayValue = []
              }
              this.userArr = item.fieldDisplayValue.map(item => {
                item.employeeName = item.name
                item.id = item.empId
                item.userId = item.userId
                delete item.name
                delete item.empId
                return item
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    //  获取权限数据源的字段列表
    getAuthFieldList (params) {
      this.$api.resourceService.getAuthFieldList(params).then(res => {
        if (res.code == 200) {
          this.authFieldList = res.data || []
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    }

  }
}
</script>
<style scoped>
.label-left{ float: left; width: 70px;}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{margin-bottom: 5px;}
</style>
