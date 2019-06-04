<!--私有组件：产品数据新增
/**
* 产品数据新增
* @/views/asistant/businessSetting/product/α/product-add.vue组件存放位置
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
      <el-form :model="productForm" size="small" ref="productForm" label-width="100px">
        <div class="d-auto-y pr20">
          <el-form-item
            prop="productName"
            label="产品名称"
            :rules="{required:true,message:'请输入产品名称'}">
            <el-input class="w240" v-model.trim="productForm.productName" placeholder="请输入产品名称" maxlength=32></el-input>
          </el-form-item>
          <el-form-item
            prop="isEnable"
            label="是否启用">
            <el-switch
              v-model="productForm.isEnable"
              active-color="#409EFF"
              inactive-color="#c0c0c0"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </div>
      </el-form>
    </form-card>
    <!-- footer区域 -->
    <div class="mt10 ac">
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
      productForm: {
            productName: '', //产品名称
            isEnable: '', // 是否启用,
            isHomepage: '', // 首页是否显示
            id:''
          }
    };
  },
  computed: {
  },
  created() {
    this.initProduct()
  },
  mounted() {},
  watch: {
  },
  methods: {
    initProduct(){
      let rowData = this.dialogInfo.data || ''
      if(rowData){
        for(let key in this.productForm){
          this.productForm[key] = this.dialogInfo.data[key]
        }
      }else{
        for(let key in this.productForm){
          this.productForm[key] = ''
        }
      }
    },
    // 保存
    submitForm() {
      this.$refs.productForm.validate(valid=>{
        if (valid) {
          this.loading = true
          let api = 'saveProduct'
          if(this.dialogInfo.data){
            api = 'updateProduct'
          }
          this.$api.seeHouseConfigService[api](this.productForm)
          .then(res=>{
            this.dialogInfo.visible = false
            // 刷新数据
            this.$emit('submit','success')
          })
          .finally(()=>{
            this.loading = false
          })
        } else {
          return false;
        }
      })
    },
  }
};
</script>

<style lang="scss">
</style>
