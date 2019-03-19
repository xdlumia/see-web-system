<template>
  <div v-loading="loading">
      <!-- 内容   -->
      <el-row>
        <el-col :span="12">
          <span>{{this.dialogMeta.data.userName}}</span>
          <span class="ml10">{{this.dialogMeta.data.deptName}}</span>
        </el-col>
        <el-col :span="12" class="ar">
          <el-radio-group @change="getLoginStats()" v-model="queryFrom.queryType">
            <el-radio label="WEEK">周</el-radio>
            <el-radio label="MONTH">月</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <ECharts class="plan-order wfull"  :options="orderEchartOption"></ECharts>
  </div>
</template>


<script>
import ECharts from 'vue-echarts' 
import 'echarts/lib/chart/line' //line图
import 'echarts/lib/chart/bar' //bar图
import 'echarts/lib/component/tooltip' //提示
import 'echarts/lib/component/legend'  //类型
import 'echarts/lib/component/dataZoom'//滚动条
export default {
  components:{
   ECharts,
  },
  props:['dialogMeta'],
  data(){
    return{
      loading:false,
      queryFrom:{
        userId:this.dialogMeta.data.userId,
        queryType:'WEEK',
      },
      // echart配置
      orderEchartOption:{},
      }
  },

  created(){
    this.getLoginStats()
  },
  watch:{
  },
  methods:{
    getLoginStats(){
      this.loading = true
      this.$api.systemService.getLoginStats(this.queryFrom)
      .then(res => {
        let data = res.data || []
        let optionsData = {
          xDate:[], // 时间
          logNum:[], // 登录天数/日
          onlineDuration:[], //登录时长/分钟
        }
        data.forEach(item => {
          optionsData.xDate.push(item.timeQuantum)
          optionsData.logNum.push(item.logNum)
          optionsData.onlineDuration.push(item.onlineDuration)
        })
        // dataZoom开始日期取第一个日期
        // dataZoom结束日期 如果数据大于等于7条取第七条数据. 否则取最后一条数据
        optionsData.startValue = optionsData.xDate[0]
        optionsData.endValue = this.queryFrom.queryType == 'WEEK' && optionsData.xDate.length >=7? optionsData.xDate[6]:optionsData.xDate[optionsData.xDate.length-1]
        optionsData.endValue = this.queryFrom.queryType == 'MONTH' && optionsData.xDate.length >=30? optionsData.xDate[29]:optionsData.xDate[optionsData.xDate.length-1]
        // 重载数据
        this.reloadOptions(optionsData)
      })
      .finally(()=>{
        this.loading = false
      })
    },
    reloadOptions(optionsData){
     this.orderEchartOption = {
          // 类型颜色
          color: ['#53c975','#409EFF'],

          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross'
              }
          },
          grid: {
              left: '5%',
              right: '5%',
              bottom: '70px',
              top:'10%',
          },
          legend: {
              data:['登录天数','登录时长',]
          },
          dataZoom: {
              show: true,
              realtime: false,
              startValue:optionsData.startValue ,
              endValue: optionsData.endValue,
          },
          xAxis: [
              {
                  type: 'category',
                  axisTick: {
                      alignWithLabel: true
                  },
                  data: optionsData.xDate
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '天数/日',
                  // min: 0,
                  // max: 250,
                  // position: 'left',
              },
              {
                  type: 'value',
                  name: '时长/分钟',
                  // min: 0,
                  // max: 500,
                  // position: 'right',

              },
          ],
          series: [
              {
                  name:'登录天数',
                  type:'bar',
                  barGap: 0,
                  barWidth: '15px',
                  data:optionsData.logNum
              },
              {
                  name:'登录时长',
                  type:'line',
                  yAxisIndex:1,
                  data:optionsData.onlineDuration
              },
          ]
      }
    }
  },
}
</script>
<style scope>
</style>

