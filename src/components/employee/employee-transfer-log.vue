<!--员工列表

/**
* 员工列表
* @/components/employee/ 员工调整
* @author web-王晓冬
* @date 2019年1月2日
**/
-->
<template>
   <div style="height:400px">
        <!-- 人员调动记录 -->
        <article v-if="isTransfer == 'log'" class="hfull">
            <d-table v-if="queryForm.userId" api="bizSystemService.getTransferLog" :params="queryForm" size="mini" class="hfull" :paging="false">
                <el-table-column prop="ransferRecord" width="160" align="center" label="调动记录" show-overflow-tooltip>
                </el-table-column>
                <el-table-column width="120" align="center" label="调动时间" show-overflow-tooltip>
                    <template slot-scope="scope"><span> {{scope.row.ransferTime | timeToStr}} </span></template>
                </el-table-column>
                <el-table-column align="center"  label="交接记录" show-overflow-tooltip>
                    <template slot-scope="scope"><span class="d-text-blue d-pointer" @click="viewLogDetail(scope.row)"> {{scope.row.handoverRecord}} </span></template>
                </el-table-column>
            </d-table>
        </article>
        <!-- 人员调动记录详情 -->
        <article v-if="isTransfer == 'detail'" class="hfull">
            <el-button size="mini" icon="el-icon-back" @click="backTransferLog">返回</el-button>
            <div v-if="!responserTotal && !managerTotal">暂无数据</div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="责任盘" name="responser" v-if="responserTotal">
                  <el-table :data="responserList" border size="mini" height="320px">
                      <el-table-column prop="communityName" min-width="120" align="left" label="楼盘名称" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column min-width="120" align="left" label="栋座名称" show-overflow-tooltip>
                          <template slot-scope="scope"><span> {{ formatBuilding(scope.row.buildings)}} </span></template>
                      </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="房管家" name="manager" v-if="managerTotal">
                  <el-table :data="managerList" border size="mini" height="320px">
                      <el-table-column prop="communityName" align="left" label="楼盘名称" show-overflow-tooltip>
                      </el-table-column>
                  </el-table>
                </el-tab-pane>
            </el-tabs>
        </article>
   </div>
</template>
<script>
let employeeSingle  = window.g.employeeSingle           
export default {
  props: ["dialogMeta"],
  data () {
    return {
      responserTotal:'', //责任盘总数
      responserList:'', //责任盘列表
      managerTotal:'', //房源管家总数
      managerList:'', //房源管家列表
      queryForm:{userId:this.dialogMeta.data.userId},
      isTransfer:'log',
      activeName:'responser',
    }
  },
  created () {
  },
  methods: {
    // 查看记录详情
    viewLogDetail(row){
        this.isTransfer = 'detail'
        if(row.responseUserId){
          this.getBuildingInfoByResponserId(row.responseUserId)
        }
        if(row.houseUserId){
          this.getCommunityManagerTotal(row.houseUserId)
        }
    },
    // 格式化栋座
    formatBuilding(builds){
      return builds.map(item => item.buildingName).join(',')
    },
    // 返回调动记录
    backTransferLog(){
        this.isTransfer = 'log'
    },
    // 获取某责任人负责的栋座信息 责任盘
    getBuildingInfoByResponserId(userId){
      this.$api.seeBaseHouseService.getBuildingInfoByResponserId(userId)
      .then(res=>{
        this.responserTotal = res.data.num || ''
        this.responserList = res.data.info || []
        // 如果责任盘没有数据 默认显示楼管家
        if(!this.responserTotal){
          this.activeName = 'manager'
        }
        
      })
    },
    // 根据员工id,查询员工负责的楼盘数 房源管理
    getCommunityManagerTotal(userId){
      this.$api.seeTenementService.getCommunityManagerTotal({userId:userId})
      .then(res=>{
        this.managerTotal = res.data.totalCount || ''
        this.managerList = res.data.communityEntityList || ''
        // 如果责任盘没有数据 默认显示楼管家
        if(!this.responserTotal){
          this.activeName = 'manager'
        }
      })
    },
  }
}
</script>
<style scoped>
.role-list {
  border: 1px solid #efefef;
  padding: 10px;
  border-radius: 3px;
  max-height: 120px;
  overflow-y: auto;
}
.role-list label{display: block; line-height: 20px;}
</style>
