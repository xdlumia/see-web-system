<!--私有组件：默认城市
/**
* 辅助管理-公共设置-私有组件：默认城市
* @/components/asistant/defaultCity 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div>
    <div class="wfull cityTop">
      <span class="d-text-qgray pl20">默认城市</span>
    </div>
    <fieldset class="d-fieldset mb20" style="height: 150px;">
      <legend>
        <i class="d-round12 d-circle d-bg-green mr5 ml5"></i>
        <span class="mr5">默认城市</span>
      </legend>
      <div class="d-text-black mt40 ml35">
        当前公司的默认城市：
        <span class="d-text-blue">{{cityInfo.name}}</span>
        <span class="d-relative ml100 defaultCityChange">
          <el-popover placement="bottom" width="500" trigger="click">
            <div class="cityChangeDrop d-bg-white mt0">
              <div class="p10 wfull hfull mt0" style="box-sizing: border-box;">
                <div class="cityChangeTop wfull mt0 ac">
                  <span class="f14 d-text-gray b">城市切换</span>
                  <!-- <i @click="isCityChange = false" class="el-icon-close fr f16 d-pointer mt5 d-text-black"></i> -->
                </div>
                <div class="cityChangeInput wfull mt0">
                  <el-input
                    style="width: 60%;"
                    class="mt5"
                    size="small"
                    @keyup.native="fsearchCityName"
                    v-model="searchCityName"
                    placeholder="请输入内容"
                  ></el-input>
                  <el-button
                    @click="fsearchCityName"
                    class="ml5"
                    style="margin-top: 8px;"
                    size="small"
                  >确定</el-button>
                </div>
                <div class="cityChangeTab">
                  <el-tabs class="wfull" v-model="activeName">
                    <el-tab-pane v-for="(item,index) of cityClass" :label="item" :name="item" :key="index"></el-tab-pane>
                  </el-tabs>
                  <div class="ac d-text-gray" v-if="!Object.keys(cityList).length>0">无此城市</div>
                  <div class="d-auto-y wfull mt0" style="max-height: 240px;">
                    <div
                      v-for="(val, key, index) of cityList"
                      class="mt0 wfull mb10"
                      :key="index">
                      <div v-if="activeName.indexOf(key) > -1">
                        <div class="d-hidden">
                          <div class="fl mt5 ac" style="width: 10%;">
                            <span class="f14 d-text-black">{{key}}</span>
                          </div>
                          <div class="fr mt5" style="width: 90%;">
                            <span
                              v-for="(item1,index1) of val"
                              :key="index1"
                              @click="chooseCity(item1)"
                              class="f14 d-text-black mr20 fl mb10 d-pointer city-pointer"
                            >{{item1.name}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-button
              class="ml10"
              type="text"
              v-if="authorityButtons.includes('asystem_assist_bizsetting_1018')"
              slot="reference"
            >重新设置</el-button>
          </el-popover>
        </span>
      </div>
    </fieldset>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: [],
  name: "app",
  data() {
    return {
      activeIndex: "",
      isCityChange: false, //城市是否显示
      cityList: {}, //城市列表
      cityClass:["ABC", "DEF", "GHJ", "KLM", "NPQ", "RST", "WXYZ",],
      activeName: "ABC",
      cityInfo: "",
      searchCityName: "" //搜索城市名字
    };
  },
  components: {},
  created() {
    this.getCityList();
  },
  beforeMount() {},
  watch: {
    $route() {}
  },
  methods: {
    //获取城市列表
    getCityList() {
      //获取城市列表
      this.$api.seeHouseConfigService.getCityList() 
        .then(res => {
            this.cityList = res.data || {};
        });
      //获取当前用户的默认城市
      this.$api.seeHouseConfigService.getDefaultCity({type:0}) 
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.cityInfo = res.data || {};
              // localStorage.setItem("cityInfo",JSON.stringify(this.cityInfo))
            }
          }
        });
    },
    // 选择城市
    chooseCity(item) {
      //点击列表下的城市  updateCityInfo
      this.cityInfo = item;
      let params = {
        cityId: this.cityInfo.id,
        userId: '0', //
        type: '0' //type,1个人，0公司
      };
      let defaultName = item.name
      this.$api.seeHouseConfigService.updateCityInfo(params) //保存城市
        .then(res => {
          this.$local.save('cityInfo',this.cityInfo)
          this.isCityChange = false;
        });
    },
    // 城市搜索
    fsearchCityName() {
      let params = {
        cityName: this.searchCityName
      };
      this.$api.seeHouseConfigService.getCityList(params) //获取城市列表
        .then(res => {
          if (res.code == 200) {
            // 搜索到的城市列表
            this.cityList = res.data || {};
            // 获取城市列表的首字母数组
            let objectKeys = Object.keys(this.cityList)
            if(objectKeys.length){
              // 获取到子一个城市的首字母
              let firstKey = objectKeys[0]
              // 根据城市首字母查询cityClass 数组项
              const findTeen = (classify,key) => classify.find(v => v.includes(key));
              this.activeName = findTeen(this.cityClass,firstKey)
            }
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
.cityTop {
  height: 50px;
  border-bottom: 1px solid #f2f2f2;
  line-height: 50px;
}
.city-pointer:hover {
  color: #409eff !important;
}
.defaultCityChange {
  margin-top: 13px !important;
  height: 33px;
  width: auto !important;
  max-width: 2000px;
  min-width: 60px;
  min-height: 35px;
  margin-top: 15px;
  border-radius: 20px;
  line-height: 35px !important;
  position: relative !important;
  div {
    display: inline-block;
  }
  .cityChangeDrop {
    display: flex;
    box-sizing: border-box;
    position: absolute;
    width: 487px;
    height: 434px;
    border: 1px solid #f2f2f2;
    left: -145px;
    top: 40px;
    z-index: 50;
    .cityChangeTop {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #f2f2f2;
    }
    .cityChangeTab {
      border: 1px solid #f2f2f2;
      width: 460px;
      height: 322px;
      .el-tabs__item {
        padding: 0px 13px !important;
      }
    }
  }
}
</style>