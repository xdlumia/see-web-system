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
  <div>
    <div class="d-hidden bb pb10">
      <div class="fl">
        <span style="margin-left:12px;">模板选择</span>
        <el-select
          v-model="modalSelected"
          @change="modalSelChange"
          value-key="id"
          placeholder="请选择"
          size="small">
          <el-option
            v-for="(item,index) of modalOptions"
            :key="index"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <!-- <div class="fr">
      <el-checkbox v-model="fieldAuthCheck" @change="dataFieldHandle('fieldAuthCheck')">字段权限</el-checkbox>
      <el-checkbox v-model="dataAuthCheck" @change="dataFieldHandle('dataAuthCheck')">数据权限</el-checkbox>
      </div>-->
    </div>
    <el-form
      ref="rmDataAuthForm"
      :model="rmDataAuthForm"
      label-width="80px"
      size="small"
      class="bl br"
    >
      <el-form-item label="字段权限" class="bb">
        <el-checkbox-group v-model="colSetting">
          <el-checkbox
            v-for="(item,index) of authFieldList"
            :key="index"
            :label="item.fieldCode"
            v-if="item.isShowControl"
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
            :key="index"
          >{{item.fieldName}}</el-checkbox>
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
              :min="1"
            ></el-input-number>
          </div>
          <div class="d-hidden mb10" v-else-if="item.condType==2">
            <el-input class="fl w240" placeholder="请输入内容" v-model="item.fieldValue"></el-input>
          </div>
          <div class="d-hidden mb10" v-else-if="item.condType==0">
            <el-radio-group v-model="item.deptCondType" class="fl mr15" style="margin-top:9px;">
              <el-radio :label="1" name="type">本部门（包含下级部门）</el-radio>
              <el-radio :label="2" name="type">本部门（不含下级部门）</el-radio>
              <el-radio :label="3" name="type">本公司</el-radio>
              <el-radio :label="4" name="type" v-if="dialogMeta.roleSource == 'custom'">自定义部门</el-radio>
            </el-radio-group>
            <el-button size="mini" @click="deptSel(item)" v-show="item.deptCondType==4">选择</el-button>
            <span v-show="item.deptCondType==4">
              <el-tag
                class="mr5"
                size="medium"
                v-for="(item,index) of item.fieldDisplayValue || []"
                :key="index"
              >{{item.name}}</el-tag>
            </span>
          </div>
          <div class="d-hidden mb10" v-else-if="item.condType==3">
            <el-radio-group v-model="item.empCondType" class="fl mr15" style="margin-top:9px;">
              <el-radio :label="0" name="type">本人</el-radio>
              <el-radio :label="1" name="type" v-if="dialogMeta.roleSource == 'custom'">指定人</el-radio>
            </el-radio-group>
            <employees-chosen v-show="item.empCondType==1" v-model="userArr">
              <el-button size="mini" class="ba d-text-blue ml10 d-pointer">选择</el-button>
            </employees-chosen>
            <el-tag
              size="medium"
              class="mr5"
              :closable="false"
              @close="delUserArr(item)"
              v-for="(item,index) of userArr"
              :key="index"
            >{{item.employeeName}}</el-tag>
          </div>
          <div class="d-hidden mb10" v-else-if="item.condType==4">
            <tree-select 
            size="medium"
            node-key="key"
            multiple
            defaultExpandAll
            v-model="courseKeys"
            :data="courseTreeData"
            :props="{label:'value',children:'subCategoryList'}"
            ></tree-select>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="ac">
      <el-button @click="dialogMeta.visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="saveHandle" size="small" v-if="dialogMeta.roleSource == 'custom'">确 定</el-button>
    </div>

    <!-- 树部门弹出框 -->
    <el-dialog
      title="选择部门"
      :visible.sync="dialogVisibleTree"
      width="300px"
      top="20px"
      append-to-body
    >
      <div class="deptTreeBox" style="height:calc(100vh - 150px); overflow-y:auto">
        <el-tree
          :data="deptData"
          show-checkbox
          node-key="id"
          :check-strictly="true"
          :default-checked-keys="deptTreeCheck"
          default-expand-all
          :expand-on-click-node="false"
          :props="{ children: 'children', label: 'deptName', }"
          ref="deptData"
        ></el-tree>
      </div>
      <div class="ac">
        <el-button type="primary" @click="saveDept()" size="small">确 定</el-button>
        <el-button @click="dialogVisibleTree = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["dialogMeta"],
  components: {},
  data() {
    return {
      loading: true, // loading动画
      courseKeys:[], // 自定义课程选中的数组
      userArr: [],
      // 数据授权
      dialogVisibleTree: false, // 选择部门弹出框
      deptTreeCheck: [], // 数据权限部门数选择
      DEPTSELITEM: {}, // 选择部门的时候保存的数据
      courseTreeData:[], //课程数据
      deptData: [], // 部门数据
      //  数据源模板
      modalOptions: [],
      // 当前选中模板
      modalSelected: "",
      // 字段权限列表
      authFieldList: [],
      // 头设置
      colSetting: [],
      // 行设置
      rowSettingList: [],
      // 数据权限设置表单
      rmDataAuthForm: {
        code: "", // 数据源编码(程序里用）
        colSetting: [],
        id: "",
        pageDatasourceId: "", // 数据源id
        pageDatasourceName: "", // 数据源名称
        roleId: this.dialogMeta.data.id, // 角色id
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
    };
  },
  created() {
    // 执行请求部门树数据方法
    this.fnLoadDeptTree();
    // 加载树数据
    this.getCategoryTree();
    // 初始化数据
    this.initRoleDataAuth();
  },
  methods: {
    // 请求部门树数据方法
    fnLoadDeptTree: function() {
      let params = { type: 0 };
      this.$api.bizSystemService.getDeptList(params).then(res => {
        if (res.code == 200) {
          this.deptData = res.data || [];
        }
      });
    },
    // 请求部门树数据方法
    getCategoryTree() {
      this.$api.seeTrainingService.getCategoryTree().then(res => {
        if (res.code == 200) {
          this.courseTreeData = res.data || [];
        }
      });
    },

    // 选择部门
    deptSel: function(item) {
      // let deptIds = item.fieldValue || []
      this.deptTreeCheck = [];
      // console.log(this.deptTreeCheck)

      this.DEPTSELITEM = item;
      this.dialogVisibleTree = true;
    },
    saveDept() {
      let deptArr = this.$refs.deptData.getCheckedNodes();
      this.DEPTSELITEM.fieldDisplayValue = deptArr.map(item => {
        item.name = item.deptName;
        return item;
      });
      this.DEPTSELITEM.fieldValue = this.DEPTSELITEM.fieldDisplayValue.map(item => {return item.id}).join(",");
      this.dialogVisibleTree = false;
    },
    delUserArr(item) {
      this.userArr.splice(this.userArr.indexOf(item), 1);
    },
    // 初始化数据
    initRoleDataAuth() {
      // 清空form
      this.colSetting = [];
      this.rowSettingList = [];
      for (var key in this.rmDataAuthForm) {
        if (key == "colSetting" || key == "rowSettingList") {
          this.rmDataAuthForm[key] = [];
        } else {
          this.rmDataAuthForm[key] = "";
        }
      }
      this.userArr = [];
      //  获取数据源模板
      this.$api.resourceService.getDataSourceList({ companyCode: this.dialogMeta.data.companyCode })
        .then(res => {
          if (res.code == 200) {
            // 数据源模板列表
            let data = res.data || [];
            this.modalOptions = data;
            // 选中第一个模板
            this.modalSelected = data[0] || "";
            this.rmDataAuthForm.code = data[0].code || "";
            this.rmDataAuthForm.pageDatasourceId = data[0].id || "";
            this.rmDataAuthForm.pageDatasourceName = data[0].name || "";
            // 根据id获取数据源列表
            this.getAuthFieldList({ dataSourceId: data[0].id });
            // 根据id获取数据源详情
            this.getInfoRmDataAuth({
              dataSourceId: data[0].id,
              roleId: this.dialogMeta.data.id
            });
          }
        });
    },
    // 数据权限 选择模板
    modalSelChange(item) {
      // 清空form
      this.colSetting = [];
      this.rowSettingList = [];
      for (var key in this.rmDataAuthForm) {
        if (key == "colSetting" || key == "rowSettingList") {
          this.rmDataAuthForm[key] = [];
        } else {
          this.rmDataAuthForm[key] = "";
        }
      }
      this.rmDataAuthForm.code = item.code || "";
      this.rmDataAuthForm.pageDatasourceId = item.id || "";
      this.rmDataAuthForm.pageDatasourceName = item.name || "";
      this.rmDataAuthForm.roleId = this.dialogMeta.data.id;
      // 根据id获取数据源列表
      this.getAuthFieldList({ dataSourceId: item.id });
      // 根据id获取数据源详情
      this.getInfoRmDataAuth({
        dataSourceId: item.id,
        roleId: this.dialogMeta.data.id
      });
    },
    // 获取字段权限列表
    colSettingChange(val) {
      this.rmDataAuthForm.colSetting = [];
      this.authFieldList.forEach(item => {
        if (item.isShowControl) {
          this.rmDataAuthForm.colSetting.push({
            fieldCode: item.fieldCode,
            fieldName: item.fieldName,
            type: 0
          });
        }
      });
      this.colSetting.forEach(val => {
        for (let item of this.rmDataAuthForm.colSetting) {
          if (item.fieldCode == val) {
            item.type = 1;
            break;
          }
        }
      });
    },
    // 获取数据权限列表
    rowSettingListChange() {
      this.rmDataAuthForm.rowSettingList = [];
      //通过多选的code 获取对应的数据
      let rsList = this.authFieldList.filter(item => {
        return this.rowSettingList.includes(item.fieldCode);
      });
      // 把选中的数据添加到form表单对应的字段里
      rsList.forEach(item => {
        let condType = "";
        if (item.fieldType == 2) {
          // 2=日期
          condType = 1;
        } else if (item.fieldType == 6) {
          // 6=部门
          condType = 0;
        } else if (item.fieldType == 7) {
          // 7=指定人
          condType = 3;
        } else if (item.fieldType == 8) {
          // 8=课程分类
          condType = 4;
        } else {
          // 其他 字符串
          condType = 2;
        }
        this.rmDataAuthForm.rowSettingList.push({
          condType: condType,
          dataauthId: item.datasourceId,
          // dateCondType:item.dateCondType||'',
          // deptCondType:item.deptCondType||'',
          fieldCode: item.fieldCode,
          fieldName: item.fieldName,
          fieldValue: item.fieldValue || condType==4?[]:'',
          id: item.id,
          specifyDays: item.specifyDays
        });
      });
    },
    // 保存表单数据
    saveHandle(formName) {
      // 保存数据权限
      this.rmDataAuthForm.rowSettingList.forEach(item => {
        if (item.condType == 3) {
          item.fieldValue = this.userArr.map(item => {return item.userId}).join(",");
        }
        else if (item.condType == 4) {
          item.fieldValue = this.courseKeys.join(",");
        }
      });
			this.rmDataAuthForm.roleId = this.dialogMeta.data.id
      this.loading = true;
      this.$api.bizSystemService.saveRmDataAuth(this.rmDataAuthForm)
        .then(res => {
          // 重新加载表格数据
          this.$emit("submit", "success");
          // 关闭弹出框
          this.dialogMeta.visible = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //  获取权限数据源详情
    getInfoRmDataAuth(params) {
      let api = this.$api.resourceService.getDefaultRoleInfo(params)
      if(this.dialogMeta.roleSource == 'custom'){
        api = this.$api.bizSystemService.getInfoRmDataAuth(params)
      }
      api.then(res => {
        if (res.code == 200) {
          // 回写表单
          if (res.data != null) {
            this.rmDataAuthForm = res.data;
          }
          // 回写数据选中
          this.colSetting = [];
          let colList = this.rmDataAuthForm.colSetting || [];
          colList.forEach(item => {
            if (item.type == 1) {
              this.colSetting.push(item.fieldCode);
            }
          });
          // 回写字段选中
          this.rowSettingList = [];
          let rowList = this.rmDataAuthForm.rowSettingList || [];
          rowList.forEach(item => {
            this.rowSettingList.push(item.fieldCode);
            // 回写指定人员
            if (item.condType == 3) {
              if (item.fieldDisplayValue == null) {
                item.fieldDisplayValue = [];
              }
              this.userArr = item.fieldDisplayValue.map(item => {
                item.employeeName = item.name;
                item.id = item.empId;
                item.userId = item.userId;
                delete item.name;
                delete item.empId;
                return item;
              });
            }
            // 回写课程分类
            else if(item.condType == 4){
                this.courseKeys = (item.fieldValue || '').split(',').map(n=>Number(n))
            }
          });
        }
      });
    },
    //  获取权限数据源的字段列表
    getAuthFieldList(params) {
      this.$api.resourceService.getAuthFieldList(params).then(res => {
        if (res.code == 200) {
          this.authFieldList = res.data || [];
        }
      });
    }
  }
};
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
