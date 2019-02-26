<template>
  <div class="d-content main-content">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" label-position="top" size="small">
      <el-row>
        <el-col :span="11" :offset="1">
          <el-form-item label="任务类型" prop="stepTypeCode"
                        :rules="{required: true, message: '请选择任务类型', trigger: 'blur'}">
            <d-select v-model="ruleForm.stepTypeCode" valueKey="code" lable="code"
                      :disabled="disabled"
                      :isObj="true"
                      @change="isShowAddPanel = false"
                      dicCode='ZX_SGRW_LX'></d-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="人员选择" prop="stepTypeCode"
                        :rules="{required: true, message: '请选择任务类型', trigger: 'change'}">
            <employees-select v-model="ruleForm.stepTypeCode"
                              :is-obj="false"
                              :multiple="true"
                              @onSelect="(item) => {this.item=item}"
                      :disabled="disabled"></employees-select>
            {{item}}
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-select v-model="ruleForm.user" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="11" :offset="1">
          <employees-chosen v-model="ruleForm.employeesChosen" filterable placeholder="请选择" :isEdit="false">
            <el-button type="text" class="el-icon-plus ba d-text-blue ml10 d-pointer" >111</el-button>
          </employees-chosen>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>

  /* eslint-disable eqeqeq */
  export default {
    data() {
      return {
        disabled: false,
        ruleForm: {
          stepTypeCode: [4, 90],
          user: '',
          employeesChosen: [{id:1, userId: 1, employeeName: 'xxxxx'}]
        },
        item: {},
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      };
    },
    created() {

    },
    methods: {
    },
    watch:{
    }
  };
</script>
<style lang="scss">
</style>
