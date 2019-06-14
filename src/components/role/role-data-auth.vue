<!--私有组件：数据权限
/**
* 默认角色管理
* @system 组件存放位置
* @desc 默认角色管理页面
* @author web-王晓冬
* @date 2019年1月3日
**/
-->
<template>
  <div >
    <el-form v-loading="loading" :model="addForm" ref="addForm" size="small" style="height:calc(100vh - 150px)" class="d-auto-y">
      <div class="d-fieldset p10 mb10" v-for="(item,index) of  templateAuthList" :key="index">
        <!-- 模板名称 -->
        <h4 class="mb5">{{item.name || '-'}}</h4>
        <!-- 字段权限 -->
        <el-form-item label="字段权限" class="bt">
          <el-checkbox-group v-model="addForm.rmDataauthList[index].cols">
            <el-checkbox
              v-for="(filedItem,i) of item.datasourceFieldList"
              :key="i"
              v-if="filedItem.isShowControl"
              :label="filedItem.fieldCode"
              @change="colSettingChange(index)"
              name="type"
            >{{filedItem.fieldName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="数据权限" class="bt">
          <!-- 数据权限 字段列表 -->
          <el-checkbox-group v-model="addForm.rmDataauthList[index].rows">
            <el-checkbox
              v-for="(dataItem,dataIndex) of item.datasourceFieldList"
              :label="dataItem.fieldCode"
              @change="rowSettingListChange(index)"
              :key="dataIndex"
            >{{dataItem.fieldName}}</el-checkbox>
          </el-checkbox-group>
          <!-- 根据数据权限字段 选择值 -->
          <div v-for="(rowItem,rowIndex) of addForm.rmDataauthList[index].rowSettingList" :key="rowIndex">
            <div class="label-left">{{rowItem.fieldName}}:</div>
            <!-- 如果是日期类型 -->
            <div class="d-hidden mb10" v-if="rowItem.condType==1">
              <el-radio-group v-model="rowItem.dateCondType" class="fl" style="margin-top:8px;">
                <el-radio :label="0" name="type">本日</el-radio>
                <el-radio :label="1" name="type">近一周</el-radio>
                <el-radio :label="2" name="type">近一月</el-radio>
                <el-radio :label="4" name="type">自定义近多少天</el-radio>
              </el-radio-group>
               <!-- 自定义天数 -->
              <el-input-number
                v-show="rowItem.dateCondType ==4"
                class="fl ml20"
                placeholder="近多少天"
                v-model="rowItem.specifyDays"
                size="mini"
                controls-position="right"
                :min="1"
              ></el-input-number>
            </div>
            <!-- 如果是其他字符串类型 -->
            <div class="d-hidden mb10" v-else-if="rowItem.condType==2">
              <el-input class="fl w240" placeholder="请输入内容" v-model="item.fieldValue"></el-input>
            </div>
            <!-- 部门类型 -->
            <div class="d-hidden mb10" v-else-if="rowItem.condType==0">
              <el-radio-group v-model="rowItem.deptCondType" class="fl mr15" style="margin-top:9px;">
                <el-radio :label="1" name="type">本部门（包含下级部门）</el-radio>
                <el-radio :label="2" name="type">本部门（不含下级部门）</el-radio>
                <el-radio :label="3" name="type">本公司</el-radio>
                <el-radio :label="4" name="type" v-if="dialogMeta.roleSource == 'custom'">自定义部门</el-radio>
              </el-radio-group>
              <tree-select
                v-if="rowItem.deptCondType == 4"
                size="small"
                multiple
                collapse-tags
                defaultExpandAll 
                style="width:300px"
                v-model="addForm.rmDataauthList[index].rowSettingList[rowIndex].fieldValue"
                :data="deptData"
                :props="{label:'deptName'}"
              ></tree-select>
            </div>
            <!-- 指定人类型 -->
            <div class="d-hidden mb10" v-else-if="rowItem.condType==3">
              <el-radio-group v-model="rowItem.empCondType" class="fl mr15" style="margin-top:9px;">
                <el-radio :label="0" name="type">本人</el-radio>
                <el-radio :label="1" name="type" v-if="dialogMeta.roleSource == 'custom'">指定人</el-radio>
              </el-radio-group>
              <employees-chosen v-show="rowItem.empCondType==1" v-model="addForm.rmDataauthList[index].rowSettingList[rowIndex].fieldValue">
                <el-button size="mini" class="ba d-text-blue ml10 d-pointer">选择</el-button>
              </employees-chosen>
              <el-tag
                v-show="rowItem.empCondType==1"
                size="medium"
                class="mr5"
                :closable="false"
                @close="addForm.rmDataauthList[index].rowSettingList[rowIndex].fieldValue.splice(1,userIndex)"
                v-for="(item,userIndex) of addForm.rmDataauthList[index].rowSettingList[rowIndex].fieldValue"
                :key="userIndex"
              >{{item.employeeName}}</el-tag>
            </div>
            <!-- 课程分类类型 -->
            <div class="d-hidden mb10" v-else-if="rowItem.condType==4">
              <!-- 通过v-if 需要用到课程的时候才会请求接口 -->
              <tree-select
                size="medium"
                node-key="key"
                multiple
                defaultExpandAll
                v-model="addForm.rmDataauthList[index].rowSettingList[rowIndex].fieldValue"
                api="seeTrainingService.getCategoryTree"
                :params="{ type: 0 }"
                :props="{label:'value',children:'subCategoryList'}"
              ></tree-select>
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
    
    <div class="ac">
      <el-button @click="dialogMeta.visible = false" size="small">取 消</el-button>
      <el-button
        type="primary"
        @click="saveHandle"
        size="small"
        v-if="dialogMeta.roleSource == 'custom'"
      >确 定</el-button>
    </div>

  </div>
</template>
<script>
export default {
  props: ['dialogMeta'],
  components: {},
  data () {
    return {
      loading: false, // loading动画
      templateAuthList: [], // 模板权限列表
      deptData: [], // 部门数据
      addForm: {
        rmDataauthList: [
          // {
          //   code: '', // 数据源编码(程序里用）",
          //   // 列权限
          //   cols:[],//临时存checkobx选中的项
          //   colSetting: [
          //     {
          //       fieldCode: '', // "字段编码",
          //       fieldName: '', // "字段显示值",
          //       type: '' // (0不显示1显示）"
          //     }
          //   ],
          //   id: '', // 0,
          //   pageDatasourceId: '', // "数据源id",
          //   pageDatasourceName: '', // "数据源名称",
          //   roleId: '', // "角色id",
          //   rows:[],//临时存checkobx选中的项
          //   // 数据行权限
          //   rowSettingList: [
          //     {
          //       condType: '', // "条件类型(0部门条件,1日期条件,2字段条件,3人员条件）",
          //       dataauthId: '', // "数据权限id",
          //       dateCondType: '', // "日期条件(0当日1近1周2近1月3本年4指定天数（从今天往前推的天数)",
          //       deptCondType: '', // "部门条件类型(1本部门-包含下级部门2本部门-不含下级部门3本公司4指定部门)",
          //       empCondType: '', // "人员条件类型(0本人1指定人)",
          //       fieldCode: '', // "条件字段code",
          //       fieldDisplayValue: [
          //         {
          //           additionalProp1: {},
          //           additionalProp2: {},
          //           additionalProp3: {}
          //         }
          //       ],
          //       fieldName: '', // "条件字段名",
          //       fieldValue: '', // "字段条件值，多个逗号分隔;指定部门的值也在这里",
          //       id: '', // 0,
          //       specifyDays: '' // "指定天数"
          //     }
          //   ]
          // }
        ]
      }
    }
  },
  created () {
    // 根据系统编码获取数据源列表及其字段信息
    this.dataauthPageDataSourceListAndFieldsBySyscode()
    // 执行请求部门树数据方法
    this.fnLoadDeptTree()
  },
  methods: {
    // 根据系统编码获取数据源列表及其字段信息
    dataauthPageDataSourceListAndFieldsBySyscode () {
      this.loading = true
      let params = { syscode: this.$local.fetch('userInfo').syscode }
      this.$api.resourceService.dataauthPageDataSourceListAndFieldsBySyscode(params)
        .then(res => {
          let data = res.data || []
          data.forEach(item => {
            this.addForm.rmDataauthList.push({
              code: item.code, // 数据源编码(程序里用）",
              // 列权限
              cols: [], // 临时存checkobx选中的项
              colSetting: [
                // {
                //   fieldCode: '', // "字段编码",
                //   fieldName: '', // "字段显示值",
                //   type: '' // (0不显示1显示）"
                // }
              ],
              id: '', // 0,查询详情的遍历此id
              pageDatasourceId: item.id, // "数据源id",
              pageDatasourceName: item.name, // "数据源名称",
              roleId: this.dialogMeta.data.id, // "角色id",
              rows: [], // 临时存checkobx选中的项
              // 数据行权限
              rowSettingList: [
                // {
                //   condType: '', // "条件类型(0部门条件,1日期条件,2字段条件,3人员条件）",
                //   dataauthId: '', // "数据权限id",
                //   dateCondType: '', // "日期条件(0当日1近1周2近1月3本年4指定天数（从今天往前推的天数)",
                //   deptCondType: '', // "部门条件类型(1本部门-包含下级部门2本部门-不含下级部门3本公司4指定部门)",
                //   empCondType: '', // "人员条件类型(0本人1指定人)",
                //   fieldCode: '', // "条件字段code",
                //   fieldDisplayValue: [
                //     {
                //       additionalProp1: {},
                //       additionalProp2: {},
                //       additionalProp3: {}
                //     }
                //   ],
                //   fieldName: '', // "条件字段名",
                //   fieldValue: '', // "字段条件值，多个逗号分隔;指定部门的值也在这里",
                //   id: '', // 0,
                //   specifyDays: '' // "指定天数"
                // }
              ]
            })
          })
          // 最后 给列表赋值
          this.templateAuthList = data
          this.getInfoRmDataAuth({roleId: this.dialogMeta.data.id})
        })
    },

    // 请求部门树数据方法
    fnLoadDeptTree: function () {
      let params = { type: 0 }
      this.$api.bizSystemService.getDeptList(params)
        .then(res => {
            this.deptData = res.data || []
        })
    },

    // 字段权限操作 根据checkbox选中的的code获取
    colSettingChange (index) {
      this.addForm.rmDataauthList[index].colSetting = []
      // 获取选中的fieldCode
      let cols = this.addForm.rmDataauthList[index].cols
      this.templateAuthList[index].datasourceFieldList.forEach(item => {
        this.addForm.rmDataauthList[index].colSetting.push({
            fieldCode: item.fieldCode,
            fieldName: item.fieldName,
            // 根据选中fieldCode判断 如果选中:type=1,没选中:type=0
            type: cols.includes(item.fieldCode)?1:0
          })
      })
    },
    // 获取数据权限列表
    rowSettingListChange (index) {
      // 切换选中之前选中的数据
      let rowSetList = this.addForm.rmDataauthList[index].rowSettingList

      this.addForm.rmDataauthList[index].rowSettingList = []
      // 获取数据权限选中的fieldCode
      let rows = this.addForm.rmDataauthList[index].rows
      // 通过多选的code 获取对应的数据
      let rsList = this.templateAuthList[index].datasourceFieldList.filter(item => {
        return rows.includes(item.fieldCode)
      })
      // 把选中的数据添加到form表单对应的字段里
      rsList.forEach((item, rsIndex) => {
        let condType = ''
        if (item.fieldType == 2) {
          // 2=日期
          condType = 1
        } else if (item.fieldType == 6) {
          // 6=部门
          condType = 0
        } else if (item.fieldType == 7) {
          // 7=指定人
          condType = 3
        } else if (item.fieldType == 8) {
          // 8=课程分类
          condType = 4
        } else {
          // 其他 字符串
          condType = 2
        }
        this.addForm.rmDataauthList[index].rowSettingList.push({
          condType: condType,
          dataauthId: item.datasourceId,
          // dateCondType:item.dateCondType||'',
          // deptCondType:item.deptCondType||'',
          fieldCode: item.fieldCode,
          fieldName: item.fieldName,
          fieldValue: item.fieldValue || condType == 4 || condType == 0 || condType == 3 ? [] : '',
          id: item.id,
          specifyDays: item.specifyDays
        })
        // 回写上次选中的数据
        for (let i = 0; i < rowSetList.length; i++) {
          if (item.fieldCode == rowSetList[i].fieldCode) {
            this.addForm.rmDataauthList[index].rowSettingList[rsIndex] = rowSetList[i]
            // 获取上次已经选过的数据后跳出
            break
          }
        }
      })
    },
    // 保存表单数据
    saveHandle (formName) {
      //要对addForm数据类型进行区分更改.所以深拷贝参数
      let params  = JSON.parse(JSON.stringify(this.addForm))
      params.rmDataauthList.forEach(item => {
        item.rowSettingList.forEach(subItem=>{
          if(subItem.condType == 0){
            // condType ==0 是部门类型
            if(subItem.deptCondType == 4){
              // deptCondType ==4 是自定义部门fieldValue数组类型转换成字符串
              subItem.fieldValue = subItem.fieldValue.join(',')
            }else{
              // 如果不是自定义部门清空fieldValue
              subItem.fieldValue = ''
            }
          }else if(subItem.condType == 4){
            // condType ==4 是课程分类 fieldValue数组类型转换成字符串
            subItem.fieldValue = subItem.fieldValue.join(',')
          }else if(subItem.condType == 3){
            // 如果是指定人fieldValue数组类型转换成字符串
            subItem.fieldValue = subItem.fieldValue.map(item => {return item.userId}).join(",");
          }
        })
      })
      this.loading = true
      this.$api.bizSystemService.rmdataauthBatchSave(params)
        .then(res => {
          // 重新加载表格数据
          this.$emit('submit', 'success')
          // 关闭弹出框
          this.dialogMeta.visible = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    //  获取权限数据源详情
    getInfoRmDataAuth (params) {
      this.loading = true
      // api = resourceService默认角色查询详情
      let api = this.$api.resourceService.rmdataauthDataInfo(params)
      if (this.dialogMeta.roleSource == 'custom') {
        api = this.$api.bizSystemService.rmdataauthDataInfo(params)
      }
      api.then(res => {
          let data = res.data || []
          /*
          *定义一个对象 马上code名称查询 回写模板数据列表
          *{code:{}}
          */
          let authDataInfo = {}
          data.forEach(item=>{
            authDataInfo[item.code] = item
          })
          this.addForm.rmDataauthList.forEach(item => {
            // 根据code码判断当前是否有回显
            if(authDataInfo[item.code]){
              // 根据code 获取当前数据回写详情
              let dataInfo = authDataInfo[item.code]
              item.id = dataInfo.id
              item.colSetting = dataInfo.colSetting  || []
              // 处理一下行数据里值的类型
              dataInfo.rowSettingList.forEach(rowItem=>{
                if ((rowItem.condType == 0 &&rowItem.deptCondType == 4)|| rowItem.condType == 4) {
                  // 回写指定部门// condType ==0 是部门类型 deptCondType = 4 是自定义部门  condType == 4回写课程分类
                  rowItem.fieldValue = rowItem.fieldValue?rowItem.fieldValue.split(','):[]
                  rowItem.fieldValue = rowItem.fieldValue.map(n => Number(n))
                }
                // 回写部门指定人
                else if (rowItem.condType == 3) {
                  rowItem.fieldValue = (rowItem.fieldDisplayValue || []).map(empItem => {
                    let userArr = {}
                    userArr.employeeName = empItem.name
                    userArr.id = empItem.empId
                    userArr.userId = empItem.userId
                    return userArr
                  })
                }
              })
              // 处理完行数据 遍历进去
              item.rowSettingList = dataInfo.rowSettingList  || []
            }
          })
      })
      .finally(() => {
          this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.label-left {
  float: left;
  width: 70px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
</style>
