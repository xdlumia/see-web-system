<!--私有组件：验收
/**
* 辅助管理-公共设置-商圈
* @/components/asistant/businessSetting/common 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div v-if="buttonsCode.includes('asystem_assist_bizsetting_1002')" class="d-content"  style="padding:0">
    <div class="d-flex" style="overflow:auto" >
      <!-- 商圈分类 -->
      <div style="width:240px" class="treeBox">
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
            <el-form-item label="商圈名称:"  class="mb10">
              <el-input v-model.trim="queryForm.name" size="medium" placeholder="请输入名称搜索"  class="w240"></el-input>
            </el-form-item>
            <el-button  type="primary" size="medium" icon="el-icon-search" class="ml10" @click="businessQuery">查询</el-button>
            <el-button type="button" size="medium" @click="queryFormReset">重置</el-button>
          </el-form>
          <el-button icon="el-icon-plus"  @click="addOrEditHandle('add','')" size="medium">新增商圈</el-button>
          <el-button type="danger" plain icon="el-icon-delete" @click="delBusiness" size="medium" v-show="businessIds.length">批量删除</el-button>
        </div>

        <el-table
          :data="businessTable"
          v-loading="businessTableLoading"
          @selection-change ="businessSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="商圈名称"
            width="180"
            prop="busName">
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
                @click="delBusiness(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

         <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="queryForm.limit"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
      <!-- 商圈添加和编辑 -->
        <el-dialog
          title="商圈添加和编辑"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="550px" >
          <span>
            <el-form class="pt10" size="small" :inline="true" :model="addOrEditForm" label-width="100px">
              <el-form-item label="所在城市:" prop="city" >
                <!--<el-input class="w110" v-model="provinceActive" :disabled="true" placeholder="选择省"></el-input>-->
                <!--<el-input class="w110"  v-model="cityActive" :disabled="true" placeholder="选择市"></el-input>-->
                <el-input class="w110"  v-model="addOrEditForm.areaName" :disabled="true" placeholder="选择区"></el-input>
              </el-form-item>
              <el-form-item label="商圈名称:" 
              prop="name" 
              :rules="[
                {required:true,message: '商圈名称必填',}
              ]">
                <el-input :maxlength="25" placeholder="请输入商圈名称" class="w320" v-model.trim="addOrEditForm.name"></el-input>
              </el-form-item>
              <el-form-item label="商圈坐标" :rules="[
                {required:true,message: '商圈坐标必填',}
              ]">
                <el-input class="w320" :disabled="true" placeholder="请标准坐标" v-model="this.addOrEditForm.cor">
                  <div @click="fLabelMap" slot="append" class="d-pointer">地图标注</div>
                </el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer">
            <div class="ac">
            <el-button size="small"  @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" v-if="buttonsCode.includes('asystem_assist_bizsetting_1003')" type="primary" @click="saveHandle">保 存</el-button>
          </div>
        </span>
        </el-dialog>
        <!-- <el-dialog
			    title="地图标注"
			    :visible.sync="mapVisible.mapDialogVisible"
			    width="800px"
			    center > -->
          <div class="popup-box" v-if="mapVisible.mapDialogVisible">
            <map-tagging v-if="mapVisible.mapDialogVisible" style="width:750px;" :qucoordinates="qucoordinates" :mapVisible="mapVisible" @getQucoordinates="getQucoordinates"></map-tagging>
          </div>
			    
			    
			  <!-- </el-dialog> -->
    </div>
  </div>
</template>

<script>
import mapTagging from "@/components/map-tagging"; // 页面中间客户详情

export default {
  name: "business-area",
  components: {
    mapTagging
  },
  props: [],
  data() {
    return {
      buttonsCode:this.$local.fetch("authorityBtn").asystem_assist_bizsetting || [],
      defaultExpandedKeys: [], //城市列表默认选中
      loadCityNum: 0, //tree懒加载次数

      // 商圈表格数据loading
      businessTableLoading: "",
      //商圈表格数据loading
      businessTable: [],
      total: 0, //总数
      currentPage: 1, //当前页面
      businessIds: "", //商圈表格选中的数据

      dialogVisible: false, //新增编辑弹出框
      dilaogWidth: "", //弹出框宽度
      provinceData: [], //省
      cityData: [], //市
      areaData: [], //区
      dialogTitle: "", //弹出框名称
      loading: true, //loading动画
      qucoordinates: "", //传给地图标注的经纬度
      saveEnabal: true, // 截流 防止多次保存
      mapVisible: {
        mapDialogVisible: false
      },
      // 查询表单
      queryForm: {
        name: "",
        areaId: "",
        page: 1,
        limit: 15
      },
      // addOrEdit框内容
      provinceActive: '',
      cityActive: "",
      addOrEditForm: {
        areaId: "",
        cor: '',
        name: "",
        id: ""
      }
    };
  },
  created() {
    // 初始拉取左侧商圈项
  },
  watch: {},
  computed: {

  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getQucoordinates(getQucoordinates) {
      //获取返回来的数据
      this.addOrEditForm.cor = JSON.stringify(getQucoordinates) || '';
    },
    // 重置
    queryFormReset() {
      this.queryForm.name = "";
      this.getBusiness(this.queryForm);
    },
    // 右侧表格查询
    businessQuery() {
      this.queryForm.page = 1;
      this.getBusiness(this.queryForm);
    },
    // 分页条查询
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.getBusiness(this.queryForm);
    },
 
    // cityDataChangequ(item) {
    //   //赋值给经纬度

    //   this.addOrEditForm.areaId = item.id;

    //   this.qucoordinates = item.coordinates;
    // },
    fLabelMap() {
      //点击地图标注，调取组件
      this.mapVisible.mapDialogVisible = true;
      // if (this.qucoordinates != "") {
      //   this.mapVisible.mapDialogVisible = true;
      // } else {
      //   this.$message.error({
      //     message: "请选择当前区域"
      //   });
      // }
    },
    // 保存数据商圈
    saveHandle() {
      if (this.addOrEditForm.cor.length == "") {
        this.$message.error({
          message: "请进行地图标注"
        });
        return false;
      }
      this.$api.seeHouseConfigService
        .editBusiness(this.addOrEditForm)
        .then(res => {
          if (res.code == 200) {
            this.dialogVisible = false;
            this.getBusiness(this.queryForm);
          }
        });
    },
    // 改变颜色
    changeColor(data) {
      let params = {
        code: data.code,
        content: data.content,
        state: data.state,
        isEnable: data.isEnable == true ? 1 : 0,
        updateColor: data.updateColor,
        dicCode: this.dicCode,
        defaultColor: data.defaultColor
      };
      this.editOrAddTagValueHandle(params);
    },

    // 更改开关调用修改接口
    changeStatus(data) {
      let params = {
        dicCode: this.dicCode,
        code: data.code,
        content: data.content,
        state: data.state,
        isEnable: data.isEnable == true ? 1 : 0,
        updateColor: data.updateColor
      };
      this.editOrAddTagValueHandle(params);
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
        this.cityActive = ''
        this.addOrEditForm.areaName = ''
      }else if (node.type == 1) {
        this.cityActive = node.name
        this.addOrEditForm.areaName = ''
      }
      else if (node.type == 2) {
        this.queryForm.page = 1;
        this.queryForm.areaId = node.id;
        this.addOrEditForm.areaName = node.name;
        this.addOrEditForm.areaId = node.id;
        this.getBusiness(this.queryForm);
      }
    },
    // 商圈表格批量选中事件
    businessSelectionChange(val) {
      this.businessIds = val;
    },
    // 商圈表格删除方法
    delBusiness(index, data) {
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
          this.$api.seeHouseConfigService
            .deleteBusiness({ ids: ids })
            .then(res => {
              if (res.code == 200) {
                this.queryForm.page = 1;
                this.businessQuery(this.queryForm);
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
            this.cityActive = res.data[0].name
          }
          if (node.level == 2) {
            res.data.forEach(item => {
              item.leaf = true;
            });
            // 获取商圈第一个数据
            this.queryForm.areaId = res.data[0].id;
            this.addOrEditForm.areaId = res.data[0].id;
            this.addOrEditForm.areaName = res.data[0].name;
            // console.log(res.data[0])
            this.qucoordinates = res.data[0].coordinates
            // 获取商圈数据方法
            this.getBusiness(this.queryForm);
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
    // 新增或编辑商圈
    addOrEditHandle(type, row) {
      if (type == "add") {
        this.addOrEditForm.id = "";
        this.addOrEditForm.cor = "";
        this.addOrEditForm.name = "";
      } else {
        this.addOrEditForm.id = row.id;
        this.$api.seeHouseConfigService
          .getBusinessDetail({ id: row.id })
          .then(res => {
            if (res.code == 200) {
              let data = res.data || {};
              this.addOrEditForm.name = data.busName || "";
              this.provinceActive = data.provinceName || "";
              this.cityActive = data.cityName || "";
              this.addOrEditForm.areaName = data.areaName || "";
              this.addOrEditForm.cor = data.coordinates || "";
              // this.addOrEditForm.areaId = data || "";
            }
          });
      }
      this.dialogVisible = true;
    },
    // 获取右侧商圈表格数据
    getBusiness(params) {
      this.businessTableLoading = true;
      this.$api.seeHouseConfigService
        .getBusiness(params)
        .then(res => {
          this.businessTableLoading = false;
          if (res.code == 200) {
            // 商圈表格
            this.businessTable = res.data || [];
            this.total = res.count; //总条数
            this.currentPage = res.curr; //当前页码
          } else {
          }
        })
        .finally(() => {
          this.businessTableLoading = false;
        });
    }
  }
};
</script>
<style>
.popup-box {
  background: #fff;
  position: absolute;
  height: 500px;
  padding: 10px;
  border-radius: 3px;
  width: 750px;
  z-index: 99999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.popup-box.acitve {
  display: block;
}
</style>


