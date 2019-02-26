<template>
  <el-container class="d-content main-content" v-loading="loading">
      <!-- 字典分类 -->
      <el-aside width="240px">
        <h3 style="border-bottom:1px solid #efefef; padding-bottom:5px;">字典管理</h3>
        <el-input v-model.trim="searchText"  style="cursor: pointer;" placeholder="请输入字典名称" size="small" class="mt10">
        </el-input>
        <ul class="diction-list mt10" style="height:calc(100% - 83px);overflow-y: auto">
          <li v-show="!dictionData.length">没有数据</li>
          <li v-for="(item,index) of dictionData" :class="{active:activeIndex==index}" @click="getDetailList(item,index)" :key="index">{{item.name}}</li>
        </ul>
      </el-aside>
      <!-- 右侧table列表 -->
      <el-main style="padding: 0 10px">
        <div class="mb10 pb10 bb">
          <span>数据项管理 : {{activeName}} - {{queryForm.dicCode}}</span>
        </div>
        <el-form ref="queryForm" :inline="true" :model="queryForm"  size="medium" label-width="100px">
          <el-form-item label="数据项名称:" prop="content">
            <el-input v-model.trim="queryForm.content" size="medium" placeholder="请输入名称搜索" class="w240"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="state">
            <el-select v-model="queryForm.state" size="medium" placeholder="启用/禁用">
              <el-option label="请选择状态" value=""></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button
            type="primary"
            @click="$refs.table.reload(1)"
            icon="el-icon-search"
            class="ml10">查询
            </el-button>
            <el-button type="button" @click="resetForm">重置</el-button>
            <el-button v-if="authorityBtn.includes('asystem_assist_dict_1001')" @click="addOrEditDic()" icon="el-icon-plus">新增</el-button>
          </el-form-item>
        </el-form>
        <d-table
          v-if="queryForm.dicCode"
          ref="table"
          size="mini"
          api="seeDictionaryService.getDictionaryValueList"
          :params="queryForm"
          style="height:calc(100% - 100px)">
          <el-table-column
            label="数据项名称"
            width="180"
            prop="content">
          </el-table-column>
          <el-table-column
            label="编码"
            width="240"
            prop="code">
          </el-table-column>
          <!--<el-table-column
            label="状态"
            width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isEnable"
                align="right"
                active-text="开"
                :active-value="1"
                inactive-text="关"
                :inactive-value="0"
                @change="changeStatus(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>-->
          <el-table-column
            label="显示颜色"
            width="180">
            <template slot-scope="scope">
                <el-color-picker
                  size="small"
                  :disabled="scope.row.isBuiltIn==1"
                  v-model="scope.row.updateColor"
                  :show-alpha="false"
                  :predefine="predefineColors"
                  color-format="hex"
                  @change="changeColor(scope.row)">
                </el-color-picker>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                v-if="authorityBtn.includes('asystem_assist_dict_1001')"
                @click="recoverHandle(scope.$index, scope.row)">恢复默认色
              </el-button> -->
              <el-button
                size="mini"
                :disabled="scope.row.isBuiltIn == 1"
                v-if="authorityBtn.includes('asystem_assist_dict_1002')"
                @click="addOrEditDic(scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="authorityBtn.includes('asystem_assist_dict_1003')"
                @click="delDic(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </d-table>
      </el-main>
      <!-- 字典添加和编辑 -->
      <el-dialog
        title="字典添加和编辑"
        :close-on-click-modal="false"
        :visible.sync="dicDialogVisible"
        width="550px" >
        <el-form class="pt10" size="small"
            v-loading="addLoading"
            ref="addOrEditForm"
            :model="addOrEditForm"
            label-width="100px">
          <el-form-item
          label="数据项名称:"
          prop="content" :rules="[{required:true,message:'请输入数据项名称'},{ min: 1, max: 7, message: '不能超过7个字符' }]">
            <el-input :maxlength="8" class="w320" placeholder="请输入数据项" v-model.trim="addOrEditForm.content"></el-input>
          </el-form-item>
          <!-- <el-form-item label="状态:">
              <el-switch
                active-text="开"
                :active-value="1"
                inactive-text="关"
                :inactive-value="0"
                v-model="addOrEditForm.isEnable">
              </el-switch>
          </el-form-item> -->
          <el-form-item label="颜色">
            <template slot-scope="scope">
              <div class="block">
                <span class="demonstration"></span>
                <el-color-picker
                :predefine="predefineColors"
                v-model="addOrEditForm.updateColor"
                color-format="hex"
                :show-alpha="false"></el-color-picker>
              </div>
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="ac">
          <el-button size="small" @click="dicDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveDic">保 存</el-button>
        </div>
      </el-dialog>
  </el-container>
</template>

<script>
import dictionary from 'see-web-basic/dist/utils/dictionary'

export default {
  name: "business-tag",
  data() {
    return {
      activeIndex:0,
      searchText: "",
      loading: false, //字典管理loading
      addLoading:false, //数据项弹出框loading
      activeName: "", // 当前选中项的名字
      dicData: [],
      dicDialogVisible: false,
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0",
      ],
      // 查询表单
      queryForm: {
        limit:15,
        page:1,
        content: "",
        state: "",
        isEnable:"",
        dicCode:"",
        updateColor:""
      },
      // addOrEdit框内容
      addOrEditForm: {
        code: "", //"字典值id（新增时没有，修改时必传）",
        content: "", //字典内容
        isEnable: 1,
        dicCode: "", //字典code
        updateColor: "" //修改颜色
      },
      authorityBtn: this.$local.fetch("authorityBtn").asystem_assist_dict || [], //当前页面的权限码
    };
  },
  computed: {
    dictionData: function() {
      return this.dicData.filter(item => {
        return item.name.indexOf(this.searchText) !== -1;
      });
    }
  },
  created() {
    // 初始拉取左侧字典项
    this.getDicData();
  },
  methods: {
    // 重置
    resetForm() {
      this.queryForm.content = "";
      this.queryForm.state = "";
      // 刷新数据
      this.$refs.table.reload(1)
    },
    // 恢复默认色
    recoverHandle(){

    },
    // 新增或编辑字典
    addOrEditDic(row) {
      this.dicDialogVisible = true;
      //如果row有值是编辑
      if (row) {
        // 回写弹出框编辑的值
        for(let key in this.addOrEditForm){
          this.addOrEditForm[key] = row[key]
        }
      }else{
        // 回写弹出框编辑的值
        this.$nextTick(()=>{
          this.$refs.addOrEditForm.resetFields();
          this.addOrEditForm.isEnable = 1
          this.addOrEditForm.code = ''
          this.addOrEditForm.content = ''
        })
      }
    },
    // 字典数量改变
    handleChange() {

    },
    // 保存数据字典
    saveDic() {
      this.$refs["addOrEditForm"].validate(valid => {
        if (valid) {
          this.addLoading = true
          this.$api.seeDictionaryService.editDictionary(this.addOrEditForm)
            .then(res => {
              if (res.code == 200) {
                // 关闭弹框
                this.dicDialogVisible = false;
                this.$refs.table.reload(1)

                // 字典表有改动时，刷新下缓存
                dictionary.refreshCache(this.addOrEditForm.dicCode)
              }
            })
            .finally(res => {
              this.addLoading = false;
            });
        }
      });
    },
    // 保存方法
    saveDictionary(params){
      this.$api.seeDictionaryService.editDictionary(params)
    },
    // 获取字典项详情
    getDetailList(data,index) {
      this.activeIndex = index
      this.activeName = data.name;
      this.addOrEditForm.dicCode = data.code;
      this.queryForm.dicCode = data.code;
      // 刷新数据
      this.$nextTick(()=>{
        this.$refs.table.reload(1)
      })
    },
    // 改变颜色
    changeColor(data) {
      for(let key in this.addOrEditForm){
        this.addOrEditForm[key] = data[key]
      }
      // 保存更改
      this.saveDictionary(this.addOrEditForm)
    },
    // 更改开关调用修改接口
    changeStatus(data) {
      for(let key in this.addOrEditForm){
        this.addOrEditForm[key] = data[key]
      }
      // 保存更改
      this.saveDictionary(this.addOrEditForm)
    },
    // 请求dicData数据
    getDicData: function() {
      this.loading = true;
      this.$api.seeDictionaryService.getDictionaryList()
        .then(res => {
          if (res.code == 200) {
            this.dicData = res.data || []; //加载数据
            this.activeName = this.dicData[0].name;
            this.queryForm.dicCode = this.dicData[0].code || " ";
            this.addOrEditForm.dicCode = this.dicData[0].code || " ";
            // 加载字典表格数据
            this.$nextTick(()=>{
              this.$refs.table.reload(1)
            })
          }
        })
        .finally(() => {
          this.loading = false; // 关闭loading
        });
    },
    // 右侧数据字典删除方法
    delDic(index, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center:true
        }).then(() => {
          this.$api.seeDictionaryService.delDictionary(data.code)
          .then(res => {
            if (res.code == 200) {
              this.$refs.table.reload()

              // 字典表有改动时，刷新下缓存
              dictionary.refreshCache(this.addOrEditForm.dicCode)
            }
          })
        }).catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.diction-list li {
  height: 38px;
  line-height: 38px;
  border-top: 1px solid #ebeef5;
  text-align: center;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
}
.diction-list li:hover{cursor: pointer; color: #409EFF}
.diction-list li.active{ background: #ecf5ff}
</style>

