<template>
  <div>
      <!-- 内容   -->
      <ECharts class="plan-order wfull"  :options="orderEchartOption"></ECharts>
  </div>
</template>


<script>
// import ECharts from 'ECharts'
// import 'echarts/lib/chart/bar' //bar图
// import 'echarts/lib/component/tooltip' //提示
// import 'echarts/lib/component/legend'  //类型
// import 'echarts/lib/component/dataZoom'//滚动条
export default {
  components:{
   ECharts,
  },
  props:[],
  data(){
    return{
      planActive:'0',
      role:this.roleType,
      rankForm:{
        type:'week',
        date:[]
      },
      // echart配置
      orderEchartOption:{},
      rankDataList:[]
     }
  },

  created(){

  },
  watch:{
  },
  methods:{
    // 自定义日期
    dateConfirm(val){
      this.fnLoadRank({
          roleType:this.roleType,
          startTime:val[0],
          endTime:val[1]
        })
    },

    // 获取月度订单数量
    fnLoadOrder:function(){
      axios.get(staUrl+'/rank/monthOrderRank',{params:{roleType:this.roleType}})
       .then(res=>{
        let option={xData:[],plan:[],complete:[]}
        if(res.code==200){
          let data = res.data
          for(let item of data ){
            option.xData.push(item.date)
            option.plan.push(item.total)
            option.complete.push(item.completeTotal)
          }
        }
       this.fnOrderEchart(option)
       })
    },
    // 获取产品线数量
    fnLoadPro:function(){
      axios.get(staUrl+'/rank/productOrderRank',{params:{roleType:this.roleType}})
       .then(res=>{
        let option={xData:[],plan:[],complete:[]}
        if(res.code==200){
          let data = res.data
          for(let item of data ){
            option.xData.push(item.partName)
            option.plan.push(item.total)
            option.complete.push(item.completeTotal)
          }
          this.fnProEchart(option)
        }

       })
    },
    // 产量排名
    fnLoadRank:function(params){
      axios.get(staUrl+'/rank/yieldRank',{params:params})
       .then(res=>{
        if(res && res.code==200){
          this.rankDataList = res.data
        }else{
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
       })
    },
    fnOrderEchart:function(option){
       this.orderEchartOption={
            color: ['#409EFF','#53c975'],
            legend: {
                data:['plan','complete'],
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: '5%',
                top:'10%',
                containLabel: false
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            xAxis: {
              data: option.xData,
              splitLine: {
                  show: false,
              },
              axisLabel: {
                show:true,
              },
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
            },
            yAxis: {
              type: 'value',
              splitLine: {
                  show: true,
                  lineStyle: {
                      type: 'dashed',
                      color:'#eee'
                  }
              },
              axisLabel: {
                show:true,
              },
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
            },
            series: [{
                name: 'plan',
                type: 'bar',
                barGap: 0,
                barWidth: '15px',
                data: option.plan
            },
            {
                name: 'complete',
                type: 'bar',
                barGap: 0,
                barWidth: '15px',
                data: option.complete
            }]
        }
    },
    fnProEchart:function(option){
       this.orderEchartOption={
          color: ['#409EFF','#53c975'],
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 30
              },
          ],
          legend: {
              data:['plan','complete'],
          },
          grid: {
              left: '4%',
              right: '4%',
              bottom: '65px',
              top:'10%',
              containLabel: false
          },
          tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
              },
          },
          xAxis: {
            data: option.xData,
            splitLine: {
                show: false,
            },
            axisLabel: {
              show:true,
              fontSize:11,
              // interval:0 强制所有的名称都显示
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
          },
          yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color:'#eee'
                }
            },
            axisLabel: {
              show:true,
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
          },
          series: [{
              name: 'plan',
              type: 'bar',
              barGap: 0,
              barWidth: '10px',
              data: option.plan
          },
          {
              name: 'complete',
              type: 'bar',
              barGap: 0,
              barWidth: '10px',
              data: option.complete
          }]
      }
    },
  },
}
</script>
<style scope>
.plan-header{position: relative;}
.plan-search{position: absolute; right: 0;top:0;}
.plan-order{ height: 380px !important; }
.plan-top{max-width: 300px; min-width: 280px}
.plan-top h2{ font-size:18px; color: #333; }
.plan-top-item{margin-top: 20px;}
.plan-top-item i{ display: inline-block; width: 20px;height: 20px; background: #f0f2f6; text-align: center; line-height: 20px; vertical-align: middle; font-size:12px; margin-right: 20px; }
.plan-top-item:first-child i{ background: #f4523b;color:#fff; }
.plan-top-item:nth-of-type(2) i{ background: #ffe037;color:#fff; }
.plan-top-item:nth-of-type(3) i{ background: #999;color:#fff; }
</style>

