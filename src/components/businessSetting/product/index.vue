<!--私有组件：客户
/**
* 辅助管理-公共设置-私有组件：客户
* @/components/asistant/customer 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div>
    <el-row class="bb pb5 mb5">
      <el-col :span="12">产品设置</el-col>
      <el-col :span="12" class="ar">
        <el-button size="mini" v-if="authorityButtons.includes('asystem_assist_bizsetting_1022')" type="primary" @click="setProduct">上线设置</el-button>
        <el-button size="mini" v-if="authorityButtons.includes('asystem_assist_bizsetting_1023')" type="primary" @click="addProduct">新增产品</el-button>
      </el-col>
    </el-row>
    <d-table 
      api="seeHouseConfigService.queryProduct"
      size="small"
      ref="productTable"
      style="height:calc(100vh - 160px)">
      <el-table-column prop="productName" min-width="120" align="center" label="产品名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column min-width="120" align="center" label="启用" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch
            @change="switchProduct(scope.row)"
            v-model="scope.row.isEnable"
            active-color="#409EFF"
            inactive-color="#c0c0c0"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center" label="首页统计" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch
            @change="switchHomeStats(scope.row)"
            v-model="scope.row.isHomepage"
            active-color="#409EFF"
            inactive-color="#c0c0c0"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="left" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateProduct(scope.row)" circle></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delProduct(scope.row)" circle></el-button>
        </template>
      </el-table-column>
    </d-table>

    <!-- 操作弹出框 -->
    <el-dialog
        :title="dialogInfo.title"
        :visible.sync="dialogInfo.visible"
        v-dialogDrag
        :close-on-click-modal="false"
        top="20px"
        width="600px">
        <!-- dialogInfo.component 切换组件
        dialogInfo prop数据
        @submit  刷新列表-->
        <component
            :is="dialogInfo.component"
            :dialogInfo="dialogInfo"
            v-if="dialogInfo.visible"
            @submit="$refs.productTable.reload(1)"
        ></component>
    </el-dialog>
  </div>
</template>

<script>
  import productAdd from "./product-add"; //新增产品设置
  import productSet from "./product-set"; //产品设置
  export default {
    components: {
      productAdd,
      productSet
    },
  	props: [],
    data() {
      return {
        productSetData:{},
        // dialog弹出框信息
        dialogInfo: {
            title: '', //弹出框标题
            visible: false,//是否显示
            component: '',//组件
            data: '',// 传递的json数据
        },
      }
    },

    created() {
    },
    methods: {
      // 新增产品数据
      addProduct () {
        this.dialogInfo = {
            title: '新增数据',
            visible: true,//是否显示
            component: 'productAdd',//新增产品组件
            data:'',
        }
      },
      // 更新产品数据
      updateProduct(row){
          this.dialogInfo = {
              title: '新增数据',
              visible: true,//是否显示
              component: 'productAdd',//新增产品组件
              data:row
          }
      },
      
      // 上线设置
      setProduct(){
          this.dialogInfo = {
              title: '上线设置',
              visible: true,//是否显示
              component: 'productSet',
              data:this.productSetData
          }
      },
      // 删除产品
      delProduct(row){
          this.$confirm('是否要删除此条数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$api.seeHouseConfigService.delProduct({id:row.id})
            .then(res => {
                this.$refs.productTable.reload(1)
              })
          }).catch(() => {});
      },
      /**
       * 是否启用 
       */
      switchProduct(row){
          let params ={
            productName: row.productName, //产品名称
            isEnable: row.isEnable, // 是否启用,
            isHomepage: row.isHomepage, // 首页是否显示
            id:row.id
          }
          this.$api.seeHouseConfigService.updateProduct(params)
          .then(res=>{
            // console.log('操作成功')
          })
          .finally(()=>{
            this.$refs.productTable.reload()
          })
      },
      /**
       * 是否首页统计
       */
      switchHomeStats(row){
        let params ={
            isHomepage: row.isHomepage, // 首页是否显示
            id:row.id
          }
          this.$api.seeHouseConfigService.updateProductHomepage(params)
          .then(res=>{
            // console.log('操作成功')
          })
          .finally(()=>{
            this.$refs.productTable.reload()
          })
      },
      
    }
  }
  ;
</script>
<style scoped lang="scss">

</style>






