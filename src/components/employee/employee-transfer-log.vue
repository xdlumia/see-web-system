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
            <el-tabs v-model="activeName">
                <el-tab-pane label="责任盘" name="responser">
                  <el-table :data="responserList" border size="mini" height="320px">
                      <el-table-column prop="communityName" min-width="120" align="left" label="楼盘名称" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column min-width="120" align="left" label="栋座名称" show-overflow-tooltip>
                          <template slot-scope="scope"><span> {{ formatBuilding(scope.row.buildings)}} </span></template>
                      </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="房管家" name="manager">
                  <el-table :data="managerList" border size="mini" height="320px">
                      <el-table-column prop="communityName" align="left" label="楼盘名称" show-overflow-tooltip>
                      </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="收房人" name="collcet">
                  <el-table :data="collcetList" border size="mini" height="320px">
                      <el-table-column prop="communityName" align="left" label="楼盘名称" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="houseCode" align="left" label="房源编号" show-overflow-tooltip>
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
      responserList:[], //责任盘列表
      managerList:[], //房源管家列表
      collcetList:[], //收房人列表
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
        this.getTransferDetail(row.id)
    },
    // 格式化栋座
    formatBuilding(builds){
      return builds.map(item => item.buildingName).join(',')
    },
    // 返回调动记录
    backTransferLog(){
        this.isTransfer = 'log'
    },
    // 根据人员记录id查询人员交接详情
    getTransferDetail(id){
      this.$api.bizSystemService.getTransferDetail(id)
      .then(res=>{
        let data = res.data || {}
        this.responserList = JSON.parse(data.responseDetail || '{}').info || []
        this.managerList = JSON.parse(data.houseDetail || '{}').communityEntityList || []
        this.collcetList = JSON.parse(data.collectHouseDetail || '[]')
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
