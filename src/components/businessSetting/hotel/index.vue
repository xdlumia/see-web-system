<!--私有组件：客户
/**
* 辅助管理-公共设置-私有组件：酒店
* @/components/asistant/asistant 组件存放位置
* @author web-徐贺
* @date 2019年3月21日
**/
-->
<template>
  <div>
    <el-tabs v-model="componentActive" type="card">
      <el-tab-pane v-for="(item,index) of components" v-if='authorityButtons.includes(item.code)'  :key="index" :label="item.label" :name="item.components"></el-tab-pane>
    </el-tabs>
    <components :is="componentActive"></components>
  </div>
</template>

<script>
import orderSetting from './order-setting' // 点单设置
import wardSetting from './ward-setting' // 查房设置
import matchingSetting from './matching-setting' // 配套设置
import channelSetting from './channel-setting' // 渠道商设置
import timeSetting from './time-setting' // 时间配置
import cleanSetting from './clean-setting' // 打扫配置
export default {
  components: {
    orderSetting,
    wardSetting,
    matchingSetting,
    channelSetting,
    timeSetting,
    cleanSetting
  },
  data () {
    return {
      components: [
        {label: '点单设置', components: 'orderSetting', code: 'asystem_assist_hotel_1001'},
        {label: '查房设置', components: 'wardSetting', code: 'asystem_assist_hotel_1005'},
        {label: '配套设置', components: 'matchingSetting', code: 'asystem_assist_hotel_1009'},
        {label: '渠道商设置', components: 'channelSetting', code: 'asystem_assist_hotel_1013'},
        {label: '时间配置', components: 'timeSetting', code: 'asystem_assist_hotel_1017'},
        {label: '打扫配置', components: 'cleanSetting', code: 'asystem_assist_hotel_1019'}
      ],
      // 组件
      componentActive: 'orderSetting'
    }
  },

  created () {
  },
  methods: {
  }
}

</script>
<style scoped lang="scss">

</style>
