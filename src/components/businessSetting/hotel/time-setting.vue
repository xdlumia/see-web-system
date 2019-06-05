<!--私有组件：时间配置
/**
* 辅助管理-业务设置-私有组件：时间配置
* @author web-徐贺
* @date 2019年3月21日
**/
-->
<template>
  <div>
    <fieldset class="customer mb20" style="border: 1px solid #d3dce6;border-radius: 2px;">
      <legend>
        <i class="d-round12 d-circle d-bg-blue"></i> 酒店运营时间配置
      </legend>
      <el-form ref="timeForm" :model="timeForm" class size="small" label-width="160px">
        <el-row class="mt20">
          <el-col :span="8">
            <el-form-item
              label="最早入住时间"
              prop="earliestCheckInTime"
              :rules="[
                { required: true, message: '请选择最早入住时间', trigger: 'change' }
              ]"
            >
              <el-time-picker
                size="small"
                v-model="timeForm.earliestCheckInTime"
                value-format="timestamp"
                placeholder="请选择"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="最晚退房时间"
              prop="latestCheckOutTime"
              :rules="[
                { required: true, message: '请选择最晚退房时间', trigger: 'change' }
              ]"
            >
              <el-time-picker
                size="small"
                v-model="timeForm.latestCheckOutTime"
                value-format="timestamp"
                placeholder="请选择"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="置脏房时间"
              prop="changeDirtyTime"
              :rules="[
                { required: true, message: '请选择置脏房时间', trigger: 'change' }
              ]"
            >
              <el-time-picker
                size="small"
                v-model="timeForm.changeDirtyTime"
                value-format="timestamp"
                placeholder="请选择"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="默认保留时间"
              prop="retainTime"
              :rules="[
                { required: true, message: '请选择默认保留时间', trigger: 'change' }
              ]"
            >
              <el-time-picker
                size="small"
                v-model="timeForm.retainTime"
                value-format="timestamp"
                placeholder="请选择"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="钟点房时间"
              prop="hourRoomTime"
              :rules="[
                {required: true, message: '', trigger: 'blur'}
            ]"
            >
              <el-input
                placeholder="请输入内容"
                maxlength="10"
                size="small"
                v-model="timeForm.hourRoomTime"
                style="width:220px"
              >
                <template slot="append">小时</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          type="primary"
          size="small"
          class="fr"
          v-if="authorityButtons.includes('asystem_assist_hotel_1018')"
          @click="hotelruntimeconfigUpdate"
          style="margin-right:25px"
        >保存</el-button>
      </el-form>
    </fieldset>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeForm: {
        earliestCheckInTime: '', // 最早入住时间
        latestCheckOutTime: '', // 最晚退房时间
        changeDirtyTime: '', // 置脏房时间
        retainTime: '', // 默认保留时间
        hourRoomTime: '' // 钟点房时间
      }
    }
  },
  created () {
    this.hotelruntimeconfigInfo()
  },
  methods: {
    hotelruntimeconfigInfo () {
      this.$api.seeHotelService.hotelruntimeconfigInfo()
        .then((res) => {
          this.$store.commit('setHotelTimeAllocation', res.data || {})
          if (res && res.data) {
            this.timeForm = res.data
          } else {
            this.timeForm = {
              earliestCheckInTime: '', // 最早入住时间
              latestCheckOutTime: '', // 最晚退房时间hotelruntimeconfigInfo
              changeDirtyTime: '', // 置脏房时间
              retainTime: '', // 默认保留时间
              hourRoomTime: '' // 钟点房时间
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    hotelruntimeconfigUpdate () {
      this.$refs['timeForm'].validate((valid) => {
        if (valid) {
          this.$api.seeHotelService.hotelruntimeconfigUpdate(this.timeForm)
            .then((res) => {
              this.hotelruntimeconfigInfo()
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
