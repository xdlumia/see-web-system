<!--私有组件：产品数据设置
/**
* 产品数据新增
* @/views/asistant/businessSetting/product/α/product-set.vue组件存放位置
* @author web-王晓冬
* @date 2019年3月12日
* dialogMeta.visible   - 弹出框是否显示  默认为false
* dialogMeta.title        - 弹出框名title  默认-
**/
-->

<template>
  <div v-loading="loading">
    <!--  body区域 -->
    <form-card>
        <el-row>
            <el-col :span="8">产品数量：<el-input-number v-model="setForm.productNum" size="mini" :min="0" :max="10"></el-input-number> </el-col>
            <el-col :span="8">首页统计数量：<el-input-number v-model="setForm.homepageCountNum" size="mini" :min="0" :max="10"></el-input-number> </el-col>
        </el-row>
    </form-card>
    <!-- footer区域 -->
    <div slot="footer" class="mt10 ac">
        <el-button size="small" @click="dialogInfo.visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["dialogInfo"],
  data() {
    return {
      loading: false,
      //此表单数据别的地方会批量产生数据 所以数据用的是数组.但此表单只是一组数据
      setForm: {
            homepageCountNum: '',
            id: '',
            productNum: '',
        }
    };
  },
  computed: {
  },
  created() {
      this.queryProductSet()
  },
  mounted() {},
  watch: {
  },
  methods: {
    // 查询产品设置
    queryProductSet(){
        this.loading = true
        this.$api.seeHouseConfigService.queryProductSet()
        .then(res=>{
            let data = res.data || {}
            for(let key in this.setForm){
                this.setForm[key] = data[key]
            }
        })
        .finally(()=>{
            this.loading = false
        })
    },

    submitForm() {
        this.loading = true
        this.$api.seeHouseConfigService.updateProductSet(this.setForm)
        .then(res=>{
            this.dialogInfo.visible = false
            // 刷新数据
            this.$emit('submit','success')
        })
        .finally(()=>{
            this.loading = false
        })
    },
  }
};
</script>

<style lang="scss">
</style>
