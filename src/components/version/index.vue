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
    <ul class="version-content" v-loading="loading">
      <div v-show="!versionList.length">暂无更新内容</div>
      <view-pic>
        <li v-for="(item,index) of versionList" :key="index">
          <div class="content">
            <h3>{{item.title}} <time>{{item.updatedDate | timeToStr('YYYY-MM-DD H:mm:ss')}}</time></h3>
            <div class="details" v-html="item.details || '-'"></div>
          </div>
        </li>
      </view-pic>
    </ul>
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
      // 查询表单
      queryForm: {
        limit:999,
        page:1,
        platformCode: this.$local.fetch('userInfo').syscode,
      },
    }
  },
  created () {
    this.getVersionList()
  },
  methods: {
      // 获取表格数据
      getVersionList() {
        this.loading = true
        axios.get(baseURL.systemService + '/versionupdating/list',{params: this.queryForm})
        .then(res => {
          this.versionList = res.data || []
        })
        .finally(()=>{
          this.loading = false
        })
      },
    }
}
</script>
<style scoped lang="scss">
.version-content{
    margin-top:10px; color: #333;
    .content{ flex:1}
    .handle{ flex:1; max-width:120px;}
    }
  .version-content li{ display: flex; border-bottom: 1px solid #efefef; padding-bottom: 10px; padding-left:20px;}
  .version-content li:not(:first-child){ margin-top:20px}
  .version-content .details{ font-size: 14px;}
  .version-content .details img{display: inline-block;  margin-right:2px; width:240px;}
  .version-content h3 {font-size: 16px; margin-bottom:15px;}
  .version-content h3 time {font-size: 13px; color:#666; margin-left:30px;}
</style>
