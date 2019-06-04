<!--私有组件：
/**
* 辅助管理-公共设置-学校
* @/components/asistant/businessSetting/common 组件存放位置
* @author web-王晓冬
* @date 2019年3月5日
**/
-->
<template>
  <div v-if="authorityButtons.includes('asystem_assist_bizsetting_1002')" class="d-content"  style="padding:0">
    <div class="d-flex" style="overflow:auto" >
      <!-- 学校分类 -->
      <div style="width:240px" class="p10">
        <h3 style="border-bottom:1px solid #efefef; padding-bottom:5px;" class="mb10">
          <el-row>
            <el-col :span="18" class="f16">
              城市列表
            </el-col>
             <!-- <el-col :span="6">
               <el-button type="primary" size="mini" > 同步 </el-button>
            </el-col> -->
          </el-row>
        </h3>
          <el-tree
            style="height:calc(100vh - 245px)"
            class="d-auto-y mt10"
            :load="loadCityData"
            accordion
            node-key="code"
            highlight-current
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="cityDataHandle"
            lazy
            :props="{label: 'name',isLeaf: 'leaf'}"
            ref="cityDataTree">
          </el-tree>
      </div>

      <!-- 右侧table列表 -->
      <div class="d-cell ml20" style="overflow-x:auto;">
        <div class="demo-input-suffix mt10">
          <el-form ref="queryForm" size="medium" :inline="true"  :model="queryForm" label-width="80px">
            <el-form-item label="学校名称:" class="mb10">
              <el-input v-model.trim="queryForm.schoolName" size="medium" placeholder="请输入名称搜索"  class="w220"></el-input>
            </el-form-item>
            <el-form-item label="学校类型:" class="mb10">
              <d-select v-model="queryForm.schoolTypeCode" dicCode="FM_SCHOOL_TYPE" placeholder="请选择学校类型"  class="w220"></d-select>
            </el-form-item>
            <el-button  type="primary" size="medium" icon="el-icon-search" class="ml10" @click="businessQuery">查询</el-button>
            <el-button type="button" size="medium" @click="queryFormReset">重置</el-button>
          </el-form>
          <el-button icon="el-icon-plus"  @click="addOrEditHandle('add','')" size="medium">新增学校</el-button>
          <el-button type="danger" plain icon="el-icon-delete" @click="delSchool" size="medium" v-show="businessIds.length">批量删除</el-button>
        </div>

        <d-table
          api="seeHouseConfigService.getSchool"
          :params="queryForm"
          @selection-change ="schoolSelectionChange"
          ref="schoolTable"
          style="height: calc(100vh - 277px)">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="学校名称"
            width="180"
            prop="schoolName">
          </el-table-column>
          <el-table-column label="学校类型" width="180">
              <template slot-scope="scope">
                <p>{{ scope.row.schoolTypeCode | dictionary('FM_SCHOOL_TYPE')}}</p>
              </template>
          </el-table-column>
          <el-table-column
            label="所在城市"
            width="180"
            prop="schoolLocation">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="addOrEditHandle('edit', scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delSchool(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </d-table>
      </div>
      <!-- 学校添加和编辑 -->
        <el-dialog
          title="学校添加和编辑"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="550px" >
            <el-form v-loading="loading" class="pt10" size="small" :inline="true" ref="addOrEditForm" :model="addOrEditForm" label-width="100px">
              <el-form-item label="所在城市:" prop="city">
                <!--<el-input class="w110" v-model="provinceActive" :disabled="true" placeholder="选择省"></el-input>-->
                <!--<el-input class="w110"  v-model="cityActive" :disabled="true" placeholder="选择市"></el-input>-->
                <el-input class="w110" v-model="addOrEditForm.areaName" :disabled="true" placeholder="选择区"></el-input>
              </el-form-item>
              <el-form-item label="学校名称:" prop="schoolName" 
                :rules="[
                  {required:true,message: '学校名称必填',}
                ]">
                <el-input :maxlength="25" placeholder="请输入学校名称" class="w320" v-model.trim="addOrEditForm.schoolName"></el-input>
              </el-form-item>
              <el-form-item label="学校类型" prop="schoolTypeCode" :rules="[
                {required:true,message: '请选择学校类型',}
              ]">
                <d-select v-model="addOrEditForm.schoolTypeCode" placeholder="请选择学校类型" dicCode="FM_SCHOOL_TYPE"></d-select>
              </el-form-item>
            </el-form>
          <span slot="footer">
            <div class="ac">
            <el-button size="small"  @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" v-if="authorityButtons.includes('asystem_assist_bizsetting_1003')" type="primary" @click="saveHandle">保 存</el-button>
          </div>
        </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  name: "school",
  components: {},
  props: [],
  data() {
    return {
      defaultExpandedKeys: [], //城市列表默认选中
      loadCityNum: 0, //tree懒加载次数
      businessIds: [], //学校表格选中的数据

      dialogVisible: false, //新增编辑弹出框
      dilaogWidth: "", //弹出框宽度
      provinceData: [], //省
      dialogTitle: "", //弹出框名称
      loading: false, //loading动画
      // 查询表单
      queryForm: {
        schoolName: "",
        schoolTypeCode:"",
        page: 1,
        limit: 15
      },
      // addOrEdit框内容
      provinceActive: '',
      addOrEditForm: {
        areaId: "", // 区域di
        schoolName: "", // 学校名称
        schoolTypeCode: "" //学校类型
      }
    };
  },
  created() {
    // 初始拉取左侧学校项
  },
  watch: {},
  computed: {

  },
  methods: {
    // 重置
    queryFormReset() {
      this.queryForm.schoolName = "";
      this.queryForm.schoolTypeCode = "";
      this.$refs.schoolTable.reload(1)
    },
    // 右侧表格查询
    businessQuery() {
      this.$refs.schoolTable.reload(1)
    },
    
    // 懒加载省树列表
    loadCityData(node, resolve) {
      this.defaultExpandedKeys = [];
      this.loadCityNum++;
      if (node.level == 0) {
        //首次加载 加载省内容
        // 获取省列表
        this.$api.seeHouseConfigService.getProvinces()
          .then(res => {
            this.loading = false; // 关闭loading
            if (res.code == 200) {
              // tree树数据
              resolve(res.data);
              this.defaultExpandedKeys.push(res.data[0].code);
              // 多级联动数据遍历
              this.provinceData = res.data || [];
              // 获取当前城市
              this.provinceActive=this.provinceData[0].name
              // console.log(this.provinceActive)
            }
          })
          .finally(res => {
            this.loading = false; // 关闭loading
          });

        return;
      }
      // 获取市区列表
      this.getSubAreaList(
        { id: node.data.id, type: node.data.type },node,resolve
      );
    },
    // 树列表事件
    cityDataHandle(node) {
      if (node.type == 0) {
        this.provinceActive = node.name
        this.addOrEditForm.areaName = ''
      }else if (node.type == 1) {
        this.addOrEditForm.areaName = ''
      }
      else if (node.type == 2) {
        this.queryForm.areaId = node.id;
        console.log(!!this.queryForm.areaId)
        this.addOrEditForm.areaName = node.name;
        this.addOrEditForm.areaId = node.id;
        this.$refs.schoolTable.reload(1)
      }
    },
    // 学校表格批量选中事件
    schoolSelectionChange(val) {
      this.businessIds = val;
    },
    // 学校表格删除方法
    delSchool(index, data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let ids = [];
          if (data == undefined) {
            this.businessIds.forEach(item => {
              ids.push(item.id);
            });
          } else {
            ids = [data.id];
          }
          this.$api.seeHouseConfigService.delSchool({ ids: ids })
            .then(res => {
              if (res.code == 200) {
                this.$refs.schoolTable.reload(1)
              }
            });
        })
        .catch(() => {});
    },
    // 获取市区
    getSubAreaList: function(params, node, resolve) {
      this.$api.seeHouseConfigService.getArea(params).then(res => {
        this.loading = false; // 关闭loading
        if (res.code == 200) {
          if (node.level == 1 && this.loadCityNum <= 3) {
            this.defaultExpandedKeys.push(res.data[0].code);
          }
          if (node.level == 2) {
            res.data.forEach(item => {
              item.leaf = true;
            });
            // 获取学校第一个数据
            this.queryForm.areaId = res.data[0].id;
            this.addOrEditForm.areaId = res.data[0].id;
            this.addOrEditForm.areaName = res.data[0].name;
            // 默认选中第一个省市区
            this.$nextTick(function() {
              this.$refs.cityDataTree.setCurrentKey(res.data[0].code);
            });
          }
          return resolve(res.data);
        } else {
          resolve();
        }
      });
    },
    // 新增或编辑学校
    addOrEditHandle(type, row) {
      this.dialogVisible = true;
      // 新增
      if (type == "add") {
        this.addOrEditForm.id = "";
        this.$nextTick(function() {
          this.$refs.addOrEditForm.resetFields()
        })
      } 
      // 编辑
      else {
        this.addOrEditForm.id = row.id;
        this.addOrEditForm.schoolName = row.schoolName || "";
        this.addOrEditForm.areaName = row.areaName || "";
        this.addOrEditForm.schoolTypeCode = row.schoolTypeCode || "";
      }
    },

    // 保存数据学校
    saveHandle() {
      if(this.loading){
        return
      }
      this.loading = true
      this.$api.seeHouseConfigService.updateSchool(this.addOrEditForm)
        .then(res => {
          if (res.code == 200) {
            this.dialogVisible = false;
            this.$refs.schoolTable.reload(1)
          }
        })
        .finally(()=>{
          this.loading = false
        })
    },
  }
};
</script>
<style>
</style>


