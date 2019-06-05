<!--私有组件：点单设置
/**
* 辅助管理-业务设置-私有组件：酒店
* @author web-徐贺
* @date 2019年3月21日
**/
-->
<template>
  <el-container class="d-content main-content" v-loading="loading">
    <el-main>
        <!-- 标签搜索 -->
        <el-form ref="tableForm" :inline="true" :model="tableForm" label-width="80px">
          <el-form-item label="">
            <span class="el-form-item__label">编号:</span>
            <el-input v-model.trim="tableForm.serviceCode" size="medium" placeholder="请输入编号搜索" class="w240"></el-input>
            <span class="el-form-item__label">名称:</span>
            <el-input v-model.trim="tableForm.serviceName" size="medium" placeholder="请输入名称搜索" class="w240"></el-input>
            <el-button  type="primary" size="medium" @click="$refs.tagsTable.reload()" icon="el-icon-search">查询</el-button>
            <el-button type="button" @click="resetTagTable" size="medium">重置</el-button>
            <el-button v-if="authorityButtons.includes('asystem_assist_hotel_1002')" type="button" icon="el-icon-plus" class="el-button--primary" @click="addOrEditHandle" size="medium">新增</el-button>
          </el-form-item>
        </el-form>
        <d-table
          api="seeHotelService.serviceconfigPageList"
          ref="tagsTable"
          :params="tableForm"
          style="height:calc(100% - 200px)">
          <el-table-column
            label="点单编号"
            width="180"
            prop="serviceCode">
          </el-table-column>
          <el-table-column
            label="点单名称"
            width="180"
            prop="serviceName">
          </el-table-column>
          <el-table-column
            label="点单价格"
            width="180"
            prop="servicePrice">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="authorityButtons.includes('asystem_assist_hotel_1003')"
                @click="addOrEditHandle(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="authorityButtons.includes('asystem_assist_hotel_1004')"
                @click="delTag(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </d-table>
        <el-dialog
          title="新增/编辑点单"
          :close-on-click-modal="false"
          :visible.sync="dicDialogVisible"
          width="550px">
          <el-form v-loading="dialogLoading" class="pt10" size="small" :model="addOrEditForm"
          ref="addOrEditForm"
          label-width="100px" >
            <el-form-item label="点单编号:" prop="serviceCode" :rules="[
                      { required: true, message: '请输入点单编号', trigger: 'blur' }
                    ]">
              <el-input :maxlength="25" class="w320" v-model.trim="addOrEditForm.serviceCode" placeholder="请输入点单编号"></el-input>
            </el-form-item>
            <el-form-item label="点单名称:" prop="serviceName" :rules="[
                      { required: true, message: '请输入点单名称', trigger: 'blur' }
                    ]">
              <el-input :maxlength="25" class="w320" v-model.trim="addOrEditForm.serviceName" placeholder="请输入点单名称"></el-input>
            </el-form-item>
            <el-form-item label="点单价格:" prop="servicePrice" :rules="[
                      { required: true, message: '请输入点单价格', trigger: 'blur' },
                      { type:'price', message: '', trigger: 'blur' }
                    ]">
              <el-input :maxlength="25" class="w320" v-model.trim="addOrEditForm.servicePrice" placeholder="请输入点单价格"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <div class="ac">
            <el-button size="small" @click="dicDialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="savetag">保 存</el-button>
          </div>
        </span>
        </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      tableForm: {
        page: 1,
        limit: 20,
        serviceCode: '', // 点单编号
        serviceName: ''// 点单名称
      },
      dialogVisible: false, // 新增编辑弹出框
      dialogTitle: '', // 弹出框名称
      loading: false, // loading动画
      dongType: '', // 新增还是编辑
      dialogLoading: false, // 新增或编辑弹出框
      dicDialogVisible: false,
      // addOrEdit框内容
      addOrEditForm: {
        id: '',
        serviceCode: '', // 点单编号
        serviceName: '', // 点单名称
        servicePrice: '' // 点单价格
      },
      navData: [] // 所有权限码
    }
  },
  created () {
  },
  methods: {
    resetTagTable () {
      this.tableForm.serviceCode = ''
      this.tableForm.serviceName = ''
      // 刷新列表
      this.$refs.tagsTable.reload()
    },
    // 新增或编辑标签
    addOrEditHandle (index, row) {
      this.dicDialogVisible = true
      if (row) {
        this.dongType = 'handel'
        this.addOrEditForm.id = row.id
        this.addOrEditForm.serviceCode = row.serviceCode
        this.addOrEditForm.serviceName = row.serviceName
        this.addOrEditForm.servicePrice = row.servicePrice
      } else {
        this.dongType = 'add'
        this.addOrEditForm.id = ''
        this.addOrEditForm.serviceCode = ''
        this.addOrEditForm.serviceName = ''
        this.addOrEditForm.servicePrice = ''
      }
    },
    // 保存
    savetag () {
      this.$refs['addOrEditForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          if (this.dongType === 'add') {
            this.$api.seeHotelService.serviceconfigSave(this.addOrEditForm)
              .then(res => {
                this.dicDialogVisible = false
                this.$refs.tagsTable.reload()
              })
              .finally(() => {
                this.dialogLoading = false
              })
          } else {
            this.$api.seeHotelService.serviceconfigUpdate(this.addOrEditForm)
              .then(res => {
                this.dicDialogVisible = false
                this.$refs.tagsTable.reload()
              })
              .finally(() => {
                this.dialogLoading = false
              })
          }
        } else {
          return false
        }
      })
    },
    delTag (index, row) {
      this.$confirm('是否删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.loading = true
          this.$api.seeHotelService.serviceconfigDelete({id: row.id})
            .then((res) => {
              // 刷新数据
              this.$refs.tagsTable.reload()
            })
            .finally(() => {
              this.loading = false
            })
        })
    }
  }
}
</script>
<style scoped>
</style>
