<template>
  <div style="height: 100%">
    <el-container class="d-container">
      <!-- 头部区域 -->
      <el-header height="68px" class="header-top">
        <div class="d-header-left">
          <img class="header-img"/>
          <div>
            <p> 互联网A系统 </p>
            <p> 帮助房地产中介提升企业产能 </p>
          </div>
        </div>
        <div class="d-header-main">
          <div class="header-content">
            <el-menu :default-active="activeIndex"  mode="horizontal"
                    :router="true"
                    :unique-opened="true">
              <!-- <div v-for="(item,index) of navData" :key="index" class="fl"> -->
                <el-menu-item v-for="(item,index) of navData" :key="index" v-if="(!item.children || item.id == 376)" :index="item.url" class="fl">{{item.name}}</el-menu-item>
                <el-submenu v-for="(item,index) of navData" :index="index + ''" v-if="item.children && item.id != 376" :key="index" style="max-width: 116px;min-width:90px">
                  <template slot="title">{{item.name}}</template>
                  <el-menu-item v-for="(item1,index1) of item.children" :key="index1" :index="item1.url" >{{item1.name}}</el-menu-item>
                </el-submenu>
              <!-- </div> -->
              <!-- <el-menu-item index="/">工程</el-menu-item>
              <el-submenu index="1">
                <template slot="title">采购</template>
                <el-menu-item index="/purchase/purchasePicking"> 采购配货</el-menu-item>
                <el-menu-item index="/purchase/supplierManage">供应商管理</el-menu-item>
              </el-submenu>
              <el-submenu index="2">
              <template slot="title">库存</template>
              <el-menu-item index="/inventory/goodsInventory">物品库存</el-menu-item>
              <el-menu-item index="/inventory/goodsInput">物品入库</el-menu-item>
              <el-menu-item index="/inventory/goodsOutput">物品出库</el-menu-item>
              <el-menu-item index="/inventory/warehouseManage">库房管理</el-menu-item>
            </el-submenu>
              <el-submenu index="3">
                  <template slot="title">产品</template>
                  <el-menu-item index="/products/productsConfig"> 产品配置</el-menu-item>
                  <el-menu-item index="/products/productsBaseAssembly">基装工程</el-menu-item>
                  <el-menu-item index="/products/projectClass">工程分类</el-menu-item>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">物品</template>
                <el-menu-item index="/goods/goodsManagement"> 物品管理</el-menu-item>
                <el-menu-item index="/goods/categoryManagement">类目管理</el-menu-item>
              </el-submenu>
              <el-submenu index="5">
                <template slot="title">设置</template>
                <el-menu-item index="/asistant/businessDictionary">业务字典</el-menu-item>
                <el-menu-item index="/asistant/formAllocation">业务设置</el-menu-item>
              </el-submenu>
              <el-submenu index="6">
                <template slot="title">系统管理</template>
                <el-menu-item index="/system/employee">员工管理</el-menu-item>
                <el-menu-item index="/system/dept">部门管理</el-menu-item>
                <el-menu-item index="/system/role">角色管理</el-menu-item>
              </el-submenu> -->
              <el-dropdown class="mt20 d-pointer ml10" style="color:#909399">
                <span class="el-dropdown-link">
                  更多应用<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                      <a v-if="syslistCodeArr.includes('asystem')" :href="asystemUrl+'?token='+token+'&finger='+finger" class="fl">
                        <div style="width:60px;height:60px;background:skyblue;color:#FFF;font-size:20px" class="lh60 ac f22"><i class="el-icon-menu"></i></div>
                        <span style="width:80px;height:50px;color:#909399">租住平台</span>
                      </a>
                      <!--<a v-if="syslistCodeArr.includes('decorate')" :href="decorateUrl+'?token='+token+'&finger='+finger" class="fl ml15">
                        <div style="width:60px;height:60px;background:skyblue;color:#FFF;font-size:20px" class="lh60 ac f22"><i class="el-icon-menu"></i></div>
                        <span style="width:80px;height:50px;color:#909399">装修平台</span>
                      </a>-->
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-menu>

          </div>
        </div>

          <div class="d-header-right">
            <el-menu class="user fl" mode="horizontal" :router="true">
              <el-submenu index="">
                <template slot="title">
                  <div>
                    <div>
                      <p> {{userInfo.userName}} </p>
                      <p> {{userInfo.roleName}} </p>
                    </div>
                  </div>
                </template>
                <el-menu-item index="/login" @click="logout">退出</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
      </el-header>

      <!-- 中间内容区域 -->
      <el-main>
        <transition mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
let baseURL = window.g.ApiUrl
export default {
  name: 'app',
  data () {
    return {
      authorityBtn: {},
      activeIndex: '',
      userInfo: this.$local.fetch('userInfo'),
      token: '',
      finger: '',
      navData: [],
      syslist: [],
      syslistCodeArr: [],
      asystemUrl: baseURL.asystemUrl, // 租住平台的地址
      decorateUrl: baseURL.decorateUrl // 装修平台的地址
    }
  },
  components: {},
  computed: {
    menus() {
      let routes = this.$router.options.routes

      return routes.map((item) => {
        return {
          meta: item.meta,
          to: item.path
        }
      })
    }
  },
  created () {
    // 判断当前是否从别的平台跳转到当前
    let urlParams = this.$route.query || {}
    let token = urlParams.token
    let finger = urlParams.finger
    if (urlParams.token) {
      localStorage.setItem('token', token)
      localStorage.setItem('finger', finger)
      this.token = token
      this.finger = finger
      axios.defaults.headers = {token: token, finger: finger}
      this.getNavData()
    } else {
      this.token = localStorage.token
      this.finger = localStorage.finger
    }
    // 获取公共的信息
    this.syslist = JSON.parse(localStorage.getItem('syslist')) || []
    this.navData = JSON.parse(localStorage.getItem('navData')) || []
    //  this.activeIndex = this.navData[0] ? this.navData[0].url === '' ? this.navData[0].children[0].url : this.navData[0].url : '/'
    this.syslist.forEach(item => {
      this.syslistCodeArr.push(item.syscode)
    })
  },
  beforeMount () {},
  watch: {},
  methods: {
    // 获取菜单权限
    getNavData () {
      this.$api.bizSystemService.getUserAuth('decorate').then(res => {
        if (res.data && res.data.code === 200) {
          const loginData = res.data.data || [{ url: '/' }]
          // 存储菜单
          localStorage.setItem('navData', JSON.stringify(loginData))
          this.authorityBtn = {} // 按钮权限
          this.authorityHandle(loginData)
          // 存储功能权限
          localStorage.setItem('authorityBtn', JSON.stringify(this.authorityBtn))
          // this.$local.save('authorityBtn', this.authorityBtn)

          // 根据token查询用户信息
          this.$api.bizSystemService.getUserDetail().then(res => {
            if (res.data.code === 200) {
              let data = res.data.data
              var rmDeptEntity = data.rmDeptEntity || {} // 部门
              var rmRoleEntities = data.rmRoleEntities || [] // 人员
              this.$local.save('userInfo', {
                userName: data.name,
                userId: data.id,
                deptId: data.deptId, // 部门id
                companyCode: data.companyCode, // 公司code
                account: data.account, // 帐号
                companyName: data.companyEntity.companyName, // 公司名字
                roleType: rmRoleEntities[0] && rmRoleEntities[0].id, // 人员权限
                deptName: rmDeptEntity.deptName, // 部门名字
                roleName: rmRoleEntities[0] && rmRoleEntities[0].roleName // 角色名字
              })
            }
          })
          router.replace({ // eslint-disable-line
            path: loginData[0] ? loginData[0].url : '/' // eslint-disable-line
          })
        }
      })
      // 获取当前用户可操作的系统/平台列表
      this.getsyslist()
    },
    // 获取当前用户可操作的系统/平台列表
    getsyslist () {
      this.$api.bizSystemService.getsyslist().then(res => {
        let syslist = res.data.data || []
        localStorage.setItem('syslist', JSON.stringify(syslist)) // 存储该用户拥有的平台权限
      })
    },
    // 递归处理权限数据
    authorityHandle (authorityData) {
      authorityData.forEach((item, index) => {
        if (item.code !== '') {
          this.authorityBtn[item.code] = item.buttonsCode
        }
        // 存在children 递归
        if (item.children && item.children[0]) {
          this.authorityHandle(item.children)
        }
      })
    },
    // 退出登录
    logout () {
      localStorage.token = ''
      localStorage.timer = ''
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style scoped lang="scss">
.header-top {
  width: 100%;
  height: 70px;
  background: #ffffff;
  // margin: 0px 20px;
  position: relative;
  border-bottom: 3px solid #e4e4e4;
}
.d-header-left {
  margin-left: 5px;
  position: absolute;
  top: 0;
  left: 0;
  width: 220px;
  font-size: 14px;
  img {
    display: inline-block;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  div {
    width: 170px;
    font-size: 12px;
    display: inline-block;
    line-height: 20px;
    margin-top: 10px;
    color: #999;
    p:nth-child(1) {
      color: #111;
    }
  }
}

.d-header-main {
  position: absolute;
  left: 220px;
  right: 240px;
  margin-left: 30px;
  .header-content {
    margin: 5px auto;
    width: 800px;
  }
}

.d-header-right {
  position: absolute;
  right: 50px;
  top: 0;
  width: 185px;
  img {
    display: inline-block;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  div {
    margin-left: 11px;
    display: inline-block;
    line-height: 20px;
    color: #ccc;
    p:nth-child(1) {
      color: #111;
    }
  }
}
</style>
<style>
.d-header-main .el-menu--horizontal,
.d-header-right .el-menu--horizontal {
  border-bottom: none;
}
</style>
