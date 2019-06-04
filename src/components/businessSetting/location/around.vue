<!--私有组件：周边配套
/**
* 辅助管理-公共设置-私有组件：周边配套
* @/components/asistant/businessSetting 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div
    v-if="authorityButtons.includes('asystem_assist_bizsetting_1004')"
    >
    <el-container v-loading="loading">
      <!-- 商圈分类 -->
      <el-aside width="240px">
        <el-scrollbar class="pb10" style="height:calc(100vh - 163px);">
          <div style="border-bottom:1px solid #efefef;" class="mb10 pb5">
            <span>楼盘列表</span>
            <span class="br ml10 d-inline num-dian d-round-dic"></span>
            <span class="d-filter-custom-box">{{loupanListCount}}</span>
            <span
              @click="buildDrapDown = !buildDrapDown"
              class="d-pointer d-text-gray fr d-relative"
            >
              <i class="iconfont icon-filter mr10"></i>
            </span>
            <div v-if="buildDrapDown" class="d-absolute d-flex d-drapdown">
              <div class="wfull hfull p10" style="background: #FFF;">
                <div class="wfull ac" style="border-bottom: 1px solid rgba(228, 228, 228, 1);">
                  <span class="d-text-gray b">楼盘筛选</span>
                  <i @click="buildDrapDown = false" class="el-icon-close fr f16 d-pointer"></i>
                </div>

                <div
                  @click="clearAll"
                  class="f13 d-text-qgray lh30"
                  style="height: 30px;width: 100%;"
                >
                  <i class="el-icon-search mr5"></i>楼盘筛选
                  <span class="f13 fr d-pointer d-text-blue">清除筛选</span>
                </div>

                <div v-if="listChooseArr.indexOf('lpName') > -1" class="mt5 mb5">
                  <el-autocomplete
                    class="wfull"
                    size="mini"
                    value-key="communityName"
                    v-model="buildFilterForm.buildingName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect"
                  ></el-autocomplete>
                </div>

                <div v-if="listChooseArr.indexOf('region') > -1" class="mt15">
                  <div class="d-text-qgray f13 mt5 mb5">行政区/商圈</div>
                  <el-cascader
                    @focus="loadCityData"
                    change-on-select
                    class="wfull"
                    :options="cityOptions"
                    size="mini"
                    v-model="selectedOptions"
                    @change="cityChange"
                    :props="props"
                  ></el-cascader>
                </div>

                <div v-if="listChooseArr.indexOf('wyType') > -1" class="mt15">
                  <div class="d-text-qgray f13 mt5 mb5">物业类型</div>
                  <el-checkbox
                    @change="fStatusSearch"
                    v-model="buildFilterForm.houseUse"
                    label="2"
                  >商业</el-checkbox>
                  <el-checkbox
                    @change="fStatusSearch"
                    v-model="buildFilterForm.houseUse"
                    label="1"
                  >居住</el-checkbox>
                </div>

                <div v-if="listChooseArr.indexOf('totalArea') > -1" class="mt15">
                  <div class="d-text-qgray f13 mt5 mb5">总面积(㎡)</div>
                  <div class="d-flex">
                    <el-input
                      v-model="buildFilterForm.floorAreaStart"
                      class="bn"
                      placeholder
                      size="mini"
                      style="width: 38%;"
                    ></el-input>-
                    <el-input
                      v-model="buildFilterForm.floorAreaEnd"
                      class="bn"
                      placeholder
                      size="mini"
                      style="width: 38%;"
                    ></el-input>
                    <span @click="fEnsure" class="d-text-blue f12 ml10 mb5 d-pointer">确定</span>
                  </div>
                </div>

                <div v-if="listChooseArr.indexOf('totalHu') > -1" class="mt15">
                  <div class="d-text-qgray f13 mt5 mb5">总户数(户)</div>
                  <div class="d-flex">
                    <el-input
                      v-model="buildFilterForm.roomTotalNumberStart"
                      class="bn"
                      placeholder
                      size="mini"
                      style="width: 38%;"
                    ></el-input>-
                    <el-input
                      v-model="buildFilterForm.roomTotalNumberEnd"
                      class="bn"
                      placeholder
                      size="mini"
                      style="width: 38%;"
                    ></el-input>
                    <span @click="fEnsure" class="d-text-blue f12 ml10 d-pointer">确定</span>
                  </div>
                </div>

                <div v-if="listChooseArr.indexOf('zhuanHouse') > -1" class="mt15">
                  <div class="d-text-qgray f13 mt5 mb5">转收房数(户)</div>
                  <div class="d-flex">
                    <el-input
                      v-model="buildFilterForm.transferRoomTotalNumberStart"
                      class="bn"
                      placeholder
                      size="mini"
                      style="width: 38%;"
                    ></el-input>-
                    <el-input
                      v-model="buildFilterForm.transferRoomTotalNumberEnd"
                      class="bn"
                      placeholder
                      size="mini"
                      style="width: 38%;"
                    ></el-input>
                    <span @click="fEnsure" class="d-text-blue f12 ml10 d-pointer">确定</span>
                  </div>
                </div>

                <div v-if="listChooseArr.indexOf('buildLabel') > -1" class="mt15">
                  <div class="d-text-qgray f13 mt5 mb5">标签</div>
                  <div v-for="(item,index) of tagValueList" :key="index">
                    <i class="iconfont icon-dian f18" :style="{color:item.updateColor}"></i>
                    <el-checkbox
                      @change="fTagValueList"
                      v-model="labels"
                      :label="item.code"
                    >{{item.content}}</el-checkbox>
                  </div>
                </div>

                <div class="mt15">
                  <el-dropdown :hide-on-click="false" size="medium" trigger="click">
                    <el-button type="text">
                      <i class="el-icon-circle-plus mr5"></i>添加筛选条件
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="d-text-qgray f13 mt5">筛选条件</el-dropdown-item>
                      <el-dropdown-item>
                        <i class="iconfont icon-dian f18 d-text-blue"></i>
                        <el-checkbox
                          @change="flistChoose"
                          v-model="listChooseArr"
                          label="lpName"
                        >楼盘名称</el-checkbox>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="iconfont icon-dian f18 d-text-blue"></i>
                        <el-checkbox
                          @change="flistChoose"
                          v-model="listChooseArr"
                          label="region"
                        >行政区/商圈</el-checkbox>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="iconfont icon-dian f18 d-text-blue"></i>
                        <el-checkbox
                          @change="flistChoose"
                          v-model="listChooseArr"
                          label="wyType"
                        >物业类型</el-checkbox>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="iconfont icon-dian f18 d-text-blue"></i>
                        <el-checkbox
                          @change="flistChoose"
                          v-model="listChooseArr"
                          label="totalArea"
                        >总面积</el-checkbox>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="iconfont icon-dian f18 d-text-blue"></i>
                        <el-checkbox
                          @change="flistChoose"
                          v-model="listChooseArr"
                          label="totalHu"
                        >总户数</el-checkbox>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="iconfont icon-dian f18 d-text-blue"></i>
                        <el-checkbox
                          @change="flistChoose"
                          v-model="listChooseArr"
                          label="zhuanHouse"
                        >转收房数</el-checkbox>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="iconfont icon-dian f18 d-text-blue"></i>
                        <el-checkbox
                          @change="flistChoose"
                          v-model="listChooseArr"
                          label="buildLabel"
                        >标签</el-checkbox>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
          <div
            v-loading="loading"
            class="resource-item mt10 d-bg-white d-pointer"
            v-for="(item,index) of this.builingList"
            @click="fHandelList(index,item)"
            :key="index" >
            <!--this.builingList-->
            <div class="task-check-bor d-relative d-bg-white" :class="{buildeActive: index == activeIndex }">
              <div class="order-state"></div>
              <div class="resource-top f13">
                <el-col :span="19" title="楼盘名称" class="b">{{item.communityName}}</el-col>
                <el-col
                  :span="5"
                  class="jzStyle ac mt5"
                  :class=" item.houseUse == '1' ? 'houseBlue' : 'housePurple' "
                >
                  <div class>{{item.houseUse == '1' ? '住宅' : '商业'}}</div>
                </el-col>
              </div>

              <div class="resource-center">
                <div class="d-text-gray f12">{{item.administrativeName}}/{{item.businessCircleName}}</div>
                <div
                  class="f12"
                >{{item.houseUse == '1' ? item.transferRoomTotalNumber||0+'/'+item.roomTotalNumber||0 : item.floorArea+'㎡'}}</div>
                <div>
                  <div class="d-inlineblock mr10">
                    <span class="br d-inline num-dian d-round-dic"></span>
                    <span class="ml5">热门</span>
                  </div>
                  <div class="d-inlineblock mr10">
                    <span class="br d-inline num-dian d-round-dic"></span>
                    <span class="ml5">热门</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ac mt10 mb20">
            <el-button type="info" @click="ftaskMoreHandle" size="mini">{{taskMoreText}}</el-button>
          </div>
        </el-scrollbar>
      </el-aside>

      <!-- 右侧table列表 -->
      <el-main>
          <el-tabs v-model="queryForm.type" type="card" @tab-click="rightTabHandle">
            <el-tab-pane label="公交" name="0"></el-tab-pane>
            <el-tab-pane label="地铁" name="1"></el-tab-pane>
            <el-tab-pane label="教育设施" name="2"></el-tab-pane>
            <el-tab-pane label="医院" name="3"></el-tab-pane>
            <el-tab-pane label="银行" name="4"></el-tab-pane>
            <el-tab-pane label="休闲娱乐" name="5"></el-tab-pane>
            <el-tab-pane label="购物" name="6"></el-tab-pane>
            <el-tab-pane label="餐饮" name="7"></el-tab-pane>
            <el-tab-pane label="运动健身" name="8"></el-tab-pane>
          </el-tabs>
          <div>
            <!-- <el-form ref="queryForm" :inline="true" :model="queryForm" label-width="80px">
              <el-form-item label="状态：">
                <el-select v-model="queryForm.state" size="medium" placeholder="启用/禁用">
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="0"></el-option>
                </el-select>
                <el-button  type="primary" size="medium" @click="handleSearch" icon="el-icon-search"
                           class="el-button el-button--primary  el-button--medium ml10">查询
                </el-button>
                <el-button type="button" @click="handleReset" size="medium">重置</el-button>
              </el-form-item>
            </el-form>-->
            <el-button
              type="primary"
              v-if="authorityButtons.includes('asystem_assist_bizsetting_1005')"
              @click="syncStation"
              size="medium"
            >批量同步</el-button>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              @click="delStation"
              v-show="stationIds.length"
              size="medium"
            >批量删除</el-button>
          </div>
          <!-- 表格数据 -->
          <d-table
            api="seeHouseConfigService.getInfrastructure"
            ref="table"
            style="height:calc(100vh - 255px)"
            :params="queryForm"
            @selection-change="stationSelectionChange">
            <el-table-column type="selection" width="55" prop="name"></el-table-column>
            <el-table-column label="站点名称" width="220" prop="name"></el-table-column>
            <el-table-column label="坐标" width="220" prop="coordinates"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="delStation(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </d-table>
      </el-main>
      <!-- 商圈添加和编辑 -->
    </el-container>
  </div>
</template>

<script>
export default {
  name: "business-tag",
  props: [],
  data() {
    return {
      builingList: [], //楼盘列表
      taskMoreText: "加载更多",
      buildingInfo: {}, //当前选中的楼盘的有关信息
      buildingId: "", //当前选中的楼盘Id
      communityName: "", //当前选中的楼盘名称
      activeIndex: 0, //点击左侧列表每个楼盘的下标
      selectedOptions: [], //行政区商圈层级
      props: {
        value: "id",
        label: "name"
      },
      buildFilterForm: {
        //楼盘列表筛选
        page: 1,
        limit: 18,
        buildingName: "",
        id: "",
        administrativeId: "", //行政区id
        businessCircleId: "", // 商圈ID
        houseUse: [], //物业类型
        floorAreaStart: "", //总面积开始
        floorAreaEnd: "", //总面积结束
        roomTotalNumberStart: "", //总户数开始
        roomTotalNumberEnd: "", //总户数结束
        transferRoomTotalNumberStart: "", //转收房数开始
        transferRoomTotalNumberEnd: "", //转收房数结束
        labels: [] //标签数组
      },
      labels: [],
      //楼盘列表下拉层级选择
      cityOptions: [],
      // 标签筛选
      listChooseArr: [
        "lpName",
        "region",
        "region",
        "totalArea",
        "totalHu",
        "zhuanHouse",
        "buildLabel",
        "wyType"
      ], //楼盘列表筛选条件控制

      buildDrapDown: false, //楼盘列表下拉筛选
      buildInfoDown: false, //楼盘详情下拉筛选
      buildingBlockList: [], //楼盘下栋座列表
      blockCheckedArr: [], //栋座复选框
      blockList: "", //栋座单选
      blockListRadio: "", //栋座单选id
      danYuanRadio: "", //单元单选
      danYuanCheckArr: [], //单元多选
      tagValueList: [], //标签列表

      // dongIndex:0,//监听栋座变化，触发弹框发送请求
      // danIndex:0,//监听单元变化，触发弹框发送请求
      // cengIndex:0,//监听楼层变化，触发弹框发送请求
      // zeIndex:0,//监听责任权限变化，触发弹框发送请求
      // louIndex:0,//监听楼盘信息变化，触发弹框发送请求
      // picUrl:'',
      // pDanList:'',//平铺状态下单元列表

      dialogVisible: false, //新增编辑弹出框
      dilaogWidth: "", //弹出框宽度
      isShowEle: true,
      dialogTitle: "", //弹出框名称
      dialogType: "", //dialog类型
      dictName: "",
      loading: false, //loading动画
      activeName: "0", // 当前选中项的名字
      dicCode: "",
      dicData: [],
      tableData: [
        {
          code: "1",
          content: "11",
          isEnable: "1",
          dicCode: "#fff",
          updateColor: "#fff"
        }
      ],
      saveEnabal: true, // 截流 防止多次保存
      loupanListCount: "",

      // 获取右侧表格参数
      queryForm: {
        type: "0",
        id: "",
        page: 1,
        limit: 15
      },
      cor: "", //经纬度
      blockId: "",
      stationIds: [], //表格批量删除的数据
      restaurants: []
    };
  },
  created() {
    // 初始拉取左侧商圈项
    this.fgetBuildList(this.buildFilterForm);
    this.getTagValueList();
  },
  watch: {},
  computed: {
  },
  methods: {
    //请求楼盘列表信息
    fgetBuildList(params) {
      this.loading = true
      this.$api.seeBaseHouseService
        .getBuildingList(this.buildFilterForm)
        .then(res => {
          this.loading = false;
          if (res.code == 200) {
            if (res.data.length != 0) {
              this.taskMoreText = "加载更多";
            } else {
              this.taskMoreText = "没，没有了";
            }
            this.builingList = res.data;
            this.loupanListCount = res.count;
            this.queryForm.id = this.builingList[0].id;
            this.cor =
              this.builingList[0].communityAddressLat +
              "," +
              this.builingList[0].communityAddressLng;
              // 重新加载数据
              this.$nextTick(()=>{
                this.$refs.table.reload();
              })
          } else {
            this.builingList = [];
          }
        });
    },
    fTagValueList() {
      //标签筛选
      this.buildFilterForm.labels = this.labels.join(",");
      this.fgetBuildList();
    },
    //楼盘列表点击加载更多
    ftaskMoreHandle(params) {
      this.taskMoreText = "正在加载";
      this.buildFilterForm.page++;
      this.$api.seeBaseHouseService
        .getBuildingList(this.buildFilterForm)
        .then(res => {
          this.loading = false;
          if (res.code == 200) {
            if (res.data.length != 0) {
              this.taskMoreText = "加载更多";
              this.builingList = this.builingList.concat(res.data);
              this.fHandelList(0, res.data[0]);
            } else {
              this.taskMoreText = "没，没有了";
            }
          } else {
          }
        });
    },
    // 实时获取后台查询
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      //楼盘列表名字联想
      return state => {
        return (
          state.communityName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // 拉取行政区信息
    loadCityData() {
      this.cityOptions = [];
      this.cityId = JSON.parse(localStorage.cityInfo).id;
      let params = {
        id: this.cityId,
        type: 1
      };
      this.$api.seeHouseConfigService.getArea(params).then(res => {
        if (res.code == 200) {
          for (let item of res.data) {
            item.children = [];
            this.cityOptions.push(item);
          }
        }
      });
    },
    // 加载商圈信息
    loadDistrictData(id) {
      //		    	console.log(id)
      return new Promise((resolve, reject) => {
        this.$api.seeHouseConfigService
          .getBusiness({ page: 1, limit: 1000, areaId: id })
          .then(res => {
            if (res.code == 200) {
              let newObj = [];
              for (let item of res.data) {
                item.name = item.busName;
                item.id = item.id;
                newObj.push(item);
              }
              resolve(newObj);
            }
          });
      });
    },
    // 行政区/商圈选择
    cityChange(val) {
      this.buildFilterForm.administrativeId = this.selectedOptions[0];
      if (this.selectedOptions.length == "2") {
        this.buildFilterForm.businessCircleId = this.selectedOptions[1];
      }
      let nowIndex = 0;
      this.cityOptions.forEach((item, index) => {
        if (item.id == val[0]) {
          nowIndex = index;
          return;
        }
      });
      this.loadDistrictData(this.cityOptions[nowIndex].id).then(res => {
        this.cityOptions[nowIndex].children = res;
      });
      this.fgetBuildList();
    },
    //楼盘列表筛选确定按钮
    fEnsure() {
      this.fgetBuildList();
    },
    //左侧列表筛选条件显隐选择
    flistChoose() {
      console.log(this.listChooseArr.indexOf("lpName"));
    },
    // 状态筛选
    fStatusSearch() {
      if (this.buildFilterForm.houseUse.length == "1") {
        this.buildFilterForm.houseUse.join(",");
        this.fgetBuildList();
      }
    },
    // listChooseArr(){},
    clearAll() {
      //清除筛选
      (this.buildFilterForm.page = "1"),
        (this.buildFilterForm.limit = "8"),
        (this.buildFilterForm.id = ""),
        (this.buildFilterForm.buildingName = ""),
        (this.buildFilterForm.administrativeId = ""),
        (this.buildFilterForm.businessCircleId = ""),
        (this.buildFilterForm.houseUse = []),
        (this.buildFilterForm.floorAreaStart = ""),
        (this.buildFilterForm.floorAreaEnd = ""),
        (this.buildFilterForm.roomTotalNumberStart = ""),
        (this.buildFilterForm.roomTotalNumberEnd = ""),
        (this.buildFilterForm.transferRoomTotalNumberStart = ""),
        (this.buildFilterForm.transferRoomTotalNumberEnd = ""),
        (this.buildFilterForm.labels = []),
        (this.selectedOptions = []),
        this.fgetBuildList(this.buildFilterForm); //重新获取楼盘列表
    },
    //点击左侧楼盘列表
    fHandelList(index, item) {
      this.activeIndex = index;
      this.queryForm.id = item.id;
      this.cor = item.communityAddressLat + "," + item.communityAddressLng;
      // 刷新数据
      this.$refs.table.reload();
    },
    // 右侧tab切换
    rightTabHandle(data) {
      this.queryForm.type = data.name;

      this.$refs.table.reload();
    },
    handleReset() {},

    // 右侧表格查询
    // handleSearch() {
    //   this.fnLoadTableData({
    //     page:'1',
    //     limit: this.pageSize ,
    //     content: this.queryForm.name,
    //     isEnable: this.queryForm.state,
    //     dicCode: this.dicCode,
    //   })
    // },
    handleSelect(item) {
      //楼盘名字点击后查询
      this.buildFilterForm.id = item.id;
      this.fgetBuildList();
    },

    // 多选
    stationSelectionChange(val) {
      this.stationIds = val;
    },
    // 右侧数据商圈同步方法
    syncStation() {
      let params = {
        id: this.queryForm.id,
        type: this.queryForm.type,
        cor: this.cor
      };

      this.$api.seeHouseConfigService
        .sycFacilities(
          "?id=" + params.id + "&type=" + params.type + "&cor=" + params.cor
        )
        .then(res => {
          if (res.code == 200) {
            this.$refs.table.reload(); //同步完成，重新走查询接口
          }
        });
    },
    // 右侧数据商圈删除方法
    delStation(index, data) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let ids = [];
          if (data == undefined) {
            this.stationIds.forEach(item => {
              ids.push(item.id);
            });
          } else {
            ids = [data.id];
          }
          this.$api.seeHouseConfigService.delInfrastructure({ ids: ids })
            .then(res => {
              this.saveEnabal = true;
              if (res.code == 200) {
                // 重新加载数据
                this.$nextTick(()=>{
                  this.$refs.table.reload();
                })
                
              }
            });
        })
        .catch(() => {});
    },
    getTagValueList() {
      this.$api.seeBaseHouseService
        .getBuildingNameList({
          communityName: this.buildFilterForm.buildingName
        }) //获取楼盘列表名字
        .then(res => {
          if (res.code == 200) {
            this.restaurants = res.data;
          }
        });

      this.$api.seeHouseConfigService
        .getTagValueList({ page: 1, limit: 1000, lamCode: "LPBQ" }) //楼盘标签
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.tagValueList = res.data || [];
            }
          }
        });
    }
  }
};
</script>
<style type="text/css" scoped>
/*楼盘列表*/
.resource-top {padding:2px 10px; height: 28px;  line-height: 28px; border-bottom: 1px dashed #dcdfe6  }
.resource-center{padding:5px 10px;font-size: 12px; line-height: 20px; color: #777}
.treeBox{ padding:10px; height:100%; box-sizing: border-box; border: 1px solid rgb(239, 239, 239);border-radius: 2px;transition: all .2s; overflow-y: auto; }
.num-dian{width: 7px;height: 7px;background: #808080;}
.task-check-bor{border: 1px solid #dcdfe6;border-radius:4px ;}
.dic-guanbi{width: 40px;height: 40px;border-left: 1px solid rgba(228, 228, 228, 1);}
.dic-guanbi:hover{background: rgba(153, 153, 153, 1);color: #fff;}
.d-round-dic {
		display: inline-block;
		border-radius: 5px;
	}
</style>