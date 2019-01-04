<!--私有组件：角色新增 or 编辑
/**
* 默认角色管理
* @system 组件存放位置
* @desc 默认角色管理页面
* @author web-王晓冬
* @date 2019年1月3日
**/
-->
<template>
  <div v-loading="loading">
    <el-form label-width="80px" :model="addForm" ref="addForm" size="small">
      <el-form-item
        label="名称"
        class="mb10"
        prop="name"
        :rules="[
            { required: true, message: '请输入名称,不能超过 25 个字符',},
            { min: 1, max: 25, message: '不能超过25个字符' }]">
        <el-input v-model.trim="addForm.name" placeholder="请输入角色名称" :maxlength="25" class="w240"></el-input>
      </el-form-item>

      <el-form-item label="状态" class="mb10">
        <el-radio-group v-model="addForm.state">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="角色类型"
        class="mb10"
        prop="roleTypeId"
        :rules="{ required: true, message: '请选择角色类型' }">
        <el-select v-model="addForm.roleTypeId">
          <el-option
            v-for="(item,index) of roleTypeData"
            :key="index"
            :label="item.typeName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色描述" class="mb10">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          placeholder="请输入内容"
          v-model="addForm.description"
          class="w240"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="ac">
      <el-button @click="dialogMeta.visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="saveRole('addForm')" size="small">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["dialogMeta"],
  data() {
    return {
      loading: false, // loading动画
      // 新增orEdit框内容
      addForm: {
        name: "",
        id: "",
        state: 0,
        description: "",
        roleTypeId: ""
      },
      roleTypeData: [] //角色类型数据
    };
  },
  created() {
    this.initRole()
    this.getRoleTypeData();
  },
  methods: {
    initRole(){
      if(this.dialogMeta.type == 'add'){
          // 清空form表单
          this.$nextTick(()=>{
            this.$refs.addForm.resetFields()
            this.addForm.id = ''
            this.addForm.state = 0
          })
        }else{
          let data = this.dialogMeta.data
          this.addForm.name = data.roleName
          this.addForm.id = data.id
          this.addForm.state = data.isDelete
          this.addForm.roleTypeId=data.roleTypeId || ''
          this.addForm.description = data.remark
        }
    },
    // 获取角色类型列表
    getRoleTypeData() {
      this.loading = true;
      this.$api.bizSystemService
        .getRoleType()
        .then(res => {
          if (res.code == 200) {
            this.roleTypeData = res.data || [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 保存表单数据
    saveRole(formName) {
      // 部门新增修改保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let api = "addRole";
          if (this.dialogMeta.type == "edit") {
            api = "updateRole";
          }
          this.loading = true
          this.$api.bizSystemService[api](this.addForm)
          .then(res => {
            if (res.code == 200) {
              // 重新加载表格数据
              this.$emit("submit", "success");
              // 关闭弹出框
              this.dialogMeta.visible = false;
            }
          })
          .finally(() => {
            this.loading = false;
          });
        } else {
          console.error('保存失败');
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
</style>
