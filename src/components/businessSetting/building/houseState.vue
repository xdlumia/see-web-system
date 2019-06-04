
<!--私有组件：房间状态
/**
* 辅助管理-公共-房间状态
* @/components/asistant/businessSetting 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div v-if="buttonsCode.includes('asystem_assist_bizsetting_1007')" class="d-content">
    <div class="d-flex" style="overflow:auto">
      <!-- 右侧table列表 -->
      <div class="d-cell ml20" style="overflow-x:auto;">
        <!-- 房间状态添加和编辑 -->
        <div class="">
          <div class="demo-input-suffix">
            <el-form ref="queryForm" :inline="true" size="small" :model="queryForm" label-width="80px">
              <el-form-item label="房间状态:">
                <el-input v-model.trim="queryForm.name" size="medium" placeholder="请输入名称搜索" class="w240"></el-input>
              </el-form-item>
              <el-button type="primary" @click="handleSearch" icon="el-icon-search" size="medium">查询</el-button>
              <el-button type="button" @click="handleReset" size="medium">重置</el-button>
              <!-- <el-button type="button" icon="el-icon-plus" @click="addEditHandle('add')" size="medium">新增</el-button> -->
            </el-form>
          </div>
        </div>
        <el-table :data="houseTableData" size="medium" v-loading="tableLoading" style="width: 100%">
          <el-table-column label="房间状态" width="220" prop="zoomType">
            <template slot-scope="scope">
              <!-- <el-input v-if="scope.row.edit &&!scope.row.isBuiltIn" v-model="scope.row.zoomType" class="w120" placeholder="请输入房间状态" size="mini"></el-input>  -->
              <span>{{scope.row.zoomType}}</span>
            </template>

          </el-table-column>
          <el-table-column label="跟进频率" width="220">
            <template slot-scope="scope">
              <el-input-number v-if="scope.row.edit" v-model="scope.row.followFrequency" :min='1' :max='999' controls-position="right" class="w100" size="mini"></el-input-number>
              <span v-else class="d-text-blue mr5">{{scope.row.followFrequency}}</span>
              天跟进一次
            </template>
          </el-table-column>
          <el-table-column label="显示颜色" width="180">
            <template slot-scope="scope">
              <div class="color-show" :style="{background:scope.row.color}"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.edit && buttonsCode.includes('asystem_assist_bizsetting_1008')" size="mini" type="primary" @click="saveHandle(scope.$index, scope.row)">保存
              </el-button>
              <el-button v-else size="mini" @click="addEditHandle(scope.$index, scope.row)">编辑
              </el-button>
              <!-- <el-button
                 v-if="!scope.row.isBuiltIn"
                size="mini"
                type="danger"
                @click="delHandle(scope.$index, scope.row)">删除
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="queryForm.limit" layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </div>
      <!-- 房间状态添加和编辑 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "business-tag",
  props: [],
  data() {
    return {
      buttonsCode:this.$local.fetch("authorityBtn").asystem_assist_bizsetting || [],
      houseTableData: [],
      tableLoading: "",
      dialogVisible: false, //新增编辑弹出框
      dilaogWidth: "", //弹出框宽度
      isShowEle: true,
      dialogTitle: "", //弹出框名称
      total: 0, //总数
      currentPage: 1, //当前页面

      saveEnabal: true, // 截流 防止多次保存

      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ],
      // 弹出框输入框验证
      rules: {
        content: [
          {
            required: true,
            message: "请输入房间状态名字,不能超过 25 个字符",
            trigger: "blur"
          },
          { min: 1, max: 25, message: "不能超过25个字符" }
        ]
      },
      // 查询表单
      queryForm: {
        name: "",
        page: 1,
        limit: 15
      }
    };
  },
  created() {
    // 初始拉取左侧房间状态项
    this.getHouseData(this.queryForm);
  },
  methods: {
    // 重置搜索
    handleReset() {
      this.queryForm.name = "";
      this.getHouseData(this.queryForm);
    },
    // 查询
    handleSearch() {
      this.queryForm.page = 1;
      this.getHouseData(this.queryForm);
    },
    // 分页条查询
    handleCurrentChange(val) {
      this.queryForm.page = val
      this.getHouseData(this.queryForm);
    },
    // 获取右侧列表数据
    getHouseData(params) {
      this.tableLoading = true;
      this.$api.seeHouseConfigService
        .getHouseConfig(params)
        .then(res => {
          this.tableLoading = false;
          if (res.code == 200) {
            this.houseTableData = res.data || [];
            this.total = res.count;
            this.currentPage = res.curr;
          } else {
            // this.$message({
            //   type: "error",
            //   message: res.msg
            // });
          }
        })
        .catch(res => {
          this.tableLoading = false;
          this.$message({
            type: "error",
            message: "出现异常"
          });
        });
    },
    // 编辑数据
    addEditHandle(index, item) {
      if (index == "add") {
        // 新增一条空数据
        this.houseTableData.splice(0, 0, {
          edit: "true",
          zoomType: "",
          followFrequency: "",
          color: ""
        });
      } else {
        // 点击点击弹出编辑框
        item.edit = true;
        this.houseTableData.splice(index, 1, item);
      }
    },
    // 保存数据
    saveHandle(index, item) {
      if (item.followFrequency == "" || item.followFrequency == null) {
        this.$message.error({
          message: "跟进频率不能为空"
        });
        return;
      }
      this.$api.seeHouseConfigService.editHouseConfig(item).then(res => {
        this.saveEnabal = true;
        if (res.code == 200) {
          item.edit = false;
          this.houseTableData.splice(index, 1, item);
        }
      });
    }
  }
};
</script>
<style scoped="">
.color-show {
  width: 28px;
  height: 28px;
  border: 1px solid #999;
  border-radius: 3px;
}
.el-color-picker__trigger {
  width: 30px;
  height: 30px;
}
</style>

