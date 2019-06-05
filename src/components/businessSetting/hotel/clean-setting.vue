<!--私有组件：打扫配置
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
            <el-button v-if="authorityButtons.includes('asystem_assist_hotel_1020')" type="button" icon="el-icon-plus" class="el-button--primary" @click="addOrEditHandle" size="medium">新增</el-button>
          </el-form-item>
        </el-form>
        <d-table
          api="seeHotelService.roomsweepconfigPageList"
          ref="tagsTable"
          :params="tableForm"
          style="height:calc(100% - 200px)">
          <el-table-column
            label="名称"
            width="180"
            prop="sweepName">
          </el-table-column>
          <el-table-column
            label="时间间隔"
            width="180"
            prop="sweepFrequency">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="authorityButtons.includes('asystem_assist_hotel_1021')"
                @click="addOrEditHandle(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="authorityButtons.includes('asystem_assist_hotel_1022')"
                @click="delTag(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </d-table>
        <el-dialog
          title="新增/编辑配套"
          :close-on-click-modal="false"
          :visible.sync="dicDialogVisible"
          width="550px">
          <el-form v-loading="dialogLoading" class="pt10" size="small" :model="addOrEditForm"
          ref="addOrEditForm"
          label-width="100px" >
            <el-form-item label="名称:" prop="sweepName" :rules="[
                      { required: true, message: '请输入名称', trigger: 'blur' }
                    ]">
              <el-input :maxlength="25" class="w320" v-model.trim="addOrEditForm.sweepName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="频率:" prop="sweepFrequency" :rules="[
                      { required: true, message: '请选择时间间隔', trigger: 'change' }
                    ]">
              <el-select v-model="addOrEditForm.sweepFrequency" placeholder="请选择" class="w320">
                <el-option
                  v-for="item in 30"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
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
        sweepName: '', // 名称
        sweepFrequency: ''// 时间间隔
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
        sweepName: '', // 名称
        sweepFrequency: '' // 时间间隔
      },
      navData: [] // 所有权限码
    }
  },
  created () {
  },
  methods: {
    resetTagTable () {
      this.tableForm.sweepName = ''
      this.tableForm.sweepFrequency = ''
      // 刷新列表
      this.$refs.tagsTable.reload()
    },
    // 新增或编辑标签
    addOrEditHandle (index, row) {
      this.dicDialogVisible = true
      if (row) {
        this.dongType = 'handel'
        this.addOrEditForm.id = row.id
        this.addOrEditForm.sweepName = row.sweepName
        this.addOrEditForm.sweepFrequency = row.sweepFrequency
      } else {
        this.dongType = 'add'
        this.addOrEditForm.id = ''
        this.addOrEditForm.sweepName = ''
        this.addOrEditForm.sweepFrequency = ''
      }
    },
    // 保存
    savetag () {
      this.$refs['addOrEditForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          if (this.dongType === 'add') {
            this.$api.seeHotelService.roomsweepconfigSave(this.addOrEditForm)
              .then(res => {
                this.dicDialogVisible = false
                this.$refs.tagsTable.reload()
              })
              .finally(() => {
                this.dialogLoading = false
              })
          } else {
            this.$api.seeHotelService.roomsweepconfigUpdate(this.addOrEditForm)
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
          this.$api.seeHotelService.roomsweepconfigDelete({id: row.id})
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
