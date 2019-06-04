<!--版本更新列表
/**
* 版本更新列表
* @/components/version/ 版本更新列表
* @author web-王晓冬
* @date 2019年1月25日
**/
-->
<template>
  <div class="d-content main-content">
    <div class="bb pb10 f12">版本更新记录</div>
    <el-scrollbar style="height:calc(100% - 60px)">
      <ul class="version-content" v-loading="loading">
        <div v-show="!versionList.length">暂无更新内容</div>
        <view-pic>
          <li v-for="(item,index) of versionList" :key="index">
            <div class="content">
              <h3>{{item.title}} <time>{{item.updatedDate | timeToStr('YYYY-MM-DD H:mm:ss')}}</time></h3>
              <div class="version-details" v-html="item.details || '-'"></div>
            </div>
          </li>
        </view-pic>
      </ul>
    </el-scrollbar>
    <el-pagination
      class="mt5"
      size="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryForm.page"
      :page-sizes="[15, 20, 30, 40]"
      :page-size="queryForm.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
let baseURL = window.g.ApiUrl
export default {
  components: {},
  data () {
    return {
      loading:false,
      // 版本列表数据
      versionList:[],
      count:0, //总数
      // 查询表单
      queryForm: {
        limit:20,
        page:1,
        platformCode: this.$local.fetch('userInfo').syscode,
      },
    }
  },
  created () {
    this.getVersionList(this.queryForm)
  },
  methods: {
      // 获取表格数据
      getVersionList(params) {
        this.loading = true
        axios.get(baseURL.systemService + '/versionupdating/list',{params: params})
        .then(res => {
          this.queryForm.page = res.curr
          this.count = res.count
          this.versionList = res.data || []
        })
        .finally(()=>{
          this.loading = false
        })
      },
      // 跳转
      handleSizeChange(page){
        this.queryForm.page = page
        this.getVersionList(this.queryForm)
      },
      // 分页
      handleCurrentChange(page){
        this.queryForm.page = page
        this.getVersionList(this.queryForm)
      },
    }
}
</script>
<style lang="scss">
.version-content{
    margin-top:10px; color: #333;
    .content{ flex:1}
    .handle{ flex:1; max-width:120px;}
    }
  .version-content li{ display: flex; border-bottom: 1px solid #efefef; padding-bottom: 10px; padding-left:20px;}
  .version-content li:not(:first-child){ margin-top:20px}
  .version-content .version-details{ font-size: 14px;}
  .version-content .version-details img{display: inline-block;  margin-right:2px; width:120px;}
  .version-content h3 {font-size: 16px; margin-bottom:15px;}
  .version-content h3 time {font-size: 13px; color:#666; margin-left:30px;}
</style>
