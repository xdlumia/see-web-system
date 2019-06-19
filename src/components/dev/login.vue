<template>
  <div style="height:100%">
    <canvas ref="myCanvas" id="myCanvas"></canvas>
    <div class="login-content">
      <div class="login-mian">
        <div class="login-header">
          <h2> 分散式公寓-装修平台</h2>
          <p> 分散式公寓-装修平台</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-info">
          <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input type="password" v-model="loginForm.pwd" placeholder="请输入密码" v-on:keyup.13.native="loginBtn()"></el-input>
          </el-form-item>
          <div style="margin-bottom:10px; height:25px;">
            <el-checkbox-group v-model="remember">
              <el-checkbox label="记住密码" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-form-item>
            <el-button style="width: 100%" type="primary" :loading="loading" @click="loginBtn()">{{loadingText}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="login-footer ">
        <p>copyright © 2018
          <a href="/" target="_blank">fanteren</a>
        </p>
        <p>
          <span>
            <a href="/" target="_blank">帮助</a>
          </span>
          <span>
            <a href="/" target="_blank">隐私</a>
          </span>
          <span>
            <a href="/" target="_blank">条款</a>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
// import router from 'vue-router'
import Fingerprint2 from 'fingerprintjs2'
let baseURL = window.g.ApiUrl

export default {
  name: 'login',
  data () {
    return {
      loading: false,
      loadingText: '立即登录',
      remember: true, // 是否记住密码
      routeUrl: '',
      loginForm: {
        account: '',
        pwd: '',
        finger: '',
        syscode: 'decorate',
        from: 1
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 读取用户信息
    let userInfo = this.$local.fetch('userInfo')
    // 记住密码
    let account = userInfo.account
    let pwd = userInfo.pwd
    this.loginForm.account = account
    this.loginForm.pwd = pwd
    // 载入页面获取当前页面名称
    document.title = this.$route.meta.title
  },
  mounted () {
    // 定义画布宽高和生成点的个数
    this.initBg()
  },
  methods: {
    // 初始化动画背景
    initBg () {
      let WIDTH = window.innerWidth
      let HEIGHT = window.innerHeight
      let POINT = 35
      let canvas = this.$refs.myCanvas
      canvas.width = WIDTH
      canvas.height = HEIGHT
      var context = canvas.getContext('2d')
      context.strokeStyle = 'rgba(0,0,0,0.02)'
      context.strokeWidth = 1
      context.fillStyle = 'rgba(0,0,0,0.05)'
      var circleArr = []
      // 线条：开始xy坐标，结束xy坐标，线条透明度
      function Line (x, y, _x, _y, o) {
        this.beginX = x
        this.beginY = y
        this.closeX = _x
        this.closeY = _y
        this.o = o
      }
      // 点：圆心xy坐标，半径，每帧移动xy的距离
      function Circle (x, y, r, moveX, moveY) {
        this.x = x
        this.y = y
        this.r = r
        this.moveX = moveX
        this.moveY = moveY
      }
      // 生成max和min之间的随机数
      function num (max, _min) {
        var min = arguments[1] || 0
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
      // 绘制原点
      function drawCricle (cxt, x, y, r, moveX, moveY) {
        var circle = new Circle(x, y, r, moveX, moveY)
        cxt.beginPath()
        cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
        cxt.closePath()
        cxt.fill()
        return circle
      }
      // 绘制线条
      function drawLine (cxt, x, y, _x, _y, o) {
        var line = new Line(x, y, _x, _y, o)
        cxt.beginPath()
        cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
        cxt.moveTo(line.beginX, line.beginY)
        cxt.lineTo(line.closeX, line.closeY)
        cxt.closePath()
        cxt.stroke()
      }
      // 初始化生成原点
      function init () {
        circleArr = []
        for (var i = 0; i < POINT; i++) {
          circleArr.push(
            drawCricle(
              context,
              num(WIDTH),
              num(HEIGHT),
              num(15, 2),
              num(10, -10) / 40,
              num(10, -10) / 40
            )
          )
        }
        draw()
      }

      // 每帧绘制
      function draw () {
        context.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < POINT; i++) {
          drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r)
        }
        for (let i = 0; i < POINT; i++) {
          for (var j = 0; j < POINT; j++) {
            if (i + j < POINT) {
              var A = Math.abs(circleArr[i + j].x - circleArr[i].x)
              var B = Math.abs(circleArr[i + j].y - circleArr[i].y)
              var lineLength = Math.sqrt(A * A + B * B)
              var C = 1 / lineLength * 7 - 0.009
              var lineOpacity = C > 0.03 ? 0.03 : C
              if (lineOpacity > 0) {
                drawLine(
                  context,
                  circleArr[i].x,
                  circleArr[i].y,
                  circleArr[i + j].x,
                  circleArr[i + j].y,
                  lineOpacity
                )
              }
            }
          }
        }
      }
      init()
      setInterval(function () {
        for (var i = 0; i < POINT; i++) {
          var cir = circleArr[i]
          cir.x += cir.moveX
          cir.y += cir.moveY
          if (cir.x > WIDTH) cir.x = 0
          else if (cir.x < 0) cir.x = WIDTH
          if (cir.y > HEIGHT) cir.y = 0
          else if (cir.y < 0) cir.y = HEIGHT
        }
        draw()
      }, 16)
    },
    // 登录
    loginBtn () {
      this.loading = true
      this.loadingText = '登录中'
      // 获取浏览器指纹
      new Fingerprint2({
        excludeSessionStorage: true
      }).get((finger, components) => {
        localStorage.setItem('finger', finger)

        this.loginForm.finger = finger // 获取指纹
        axios.defaults.timeout = 5000
        axios.get(baseURL.login + '/login/login', {params: this.loginForm})
          .then(res => {
            let data = res.data
            if (data.code === 200) {
              var userId = data.data.id
              var userName = data.data.name
              var deptId = data.data.deptId
              var token =data.data.token
              localStorage.token = token

              axios.defaults.headers.finger = localStorage.finger
              axios.defaults.headers.token = localStorage.token
              // 存储账户和密码
              this.$api.bizSystemService.getUserDetail().then(res => {
                if (res.data.code === 200) {
                  var rmDeptEntity = res.data.data.rmDeptEntity || {} // 部门
                  var rmRoleEntities = res.data.data.rmRoleEntities || [] // 人员
                  var companyCode = res.data.data.companyCode
                  if (this.remember === true) { //eslint-disable-line
                    // 存储用户信息
                    this.$local.save('userInfo', {
                      userName: userName,
                      userId: userId,
                      deptId: deptId, // 部门id
                      companyCode: companyCode, // 公司code
                      account: this.loginForm.account, // 帐号
                      pwd: this.loginForm.pwd, // 密码
                      companyName: res.data.data.companyEntity.companyName, // 公司名字
                      roleType: rmRoleEntities[0] && rmRoleEntities[0].id, // 人员权限
                      deptName: rmDeptEntity.deptName, // 部门名字
                      roleName: rmRoleEntities[0] && rmRoleEntities[0].roleName // 角色名字
                    })
                  } else {
                    // 清空用户信息
                    this.$local.save('userInfo', {})
                    // {
                    //   userName: userName,
                    //   userId: userId,
                    //   deptId: deptId, // 部门id
                    //   account: '', // 帐号
                    //   pwd: '', // 密码
                    //   companyName: res.data.data.companyEntity.companyName, // 公司名字
                    //   roleType: rmRoleEntities[0] && rmRoleEntities[0].id, // 人员权限
                    //   deptName: rmDeptEntity.deptName, // 部门名字
                    //   roleName: rmRoleEntities[0] && rmRoleEntities[0].roleName // 角色名字
                    // }
                  }
                }
              })
              this.$api.bizSystemService.getUserAuth('decorate')
              // axios.get(baseUrl+'/biz-system-service/rmuserrole/list',{params:{ token: token }},)
                .then(res => {
                  if (res.data && res.data.code === 200) {
                    const loginData = res.data.data || [{url: '/'}]
                    localStorage.setItem('navData', JSON.stringify(loginData)) // 存储导航信息
                    this.$message({
                      type: 'success',
                      message: '登录成功',
                      showClose: true,
                      duration: 1000
                    })
                    router.replace({ // eslint-disable-line
                      path: loginData[0] ? loginData[0].url === '' ? loginData[0].children[0].url : loginData[0].url : '/'
                    })
                  } else {
                    this.$message.error({
                      message: res.data.msg,
                      showClose: true
                    })
                    this.loading = false
                    this.loadingText = '立即登陆'
                  }
                })
              this.$api.bizSystemService.getsyslist() // 获取当前用户可操作的系统/平台列表
                .then(res => {
                  let syslist = res.data.data
                  localStorage.setItem('syslist', JSON.stringify(syslist))// 存储该用户拥有的平台权限
                })
            } else {
              this.loading = false
              this.loadingText = '立即登陆'

              if (this.loginForm.accoung === '') {
                data.msg = '请输入用户名'
              }
              this.$message.error({
                message: data.msg,
                showClose: true
              })
            }
          })
          .catch(ero => {
            this.loading = false
            this.loadingText = '立即登录'
          })
      })
    },
  }
}
</script>
<style scoped >
.login-mian {
  padding: 100px 0;
  width: 325px;
  margin: 0 auto;
  flex: 1 1 0%;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header p {
  font-weight: 300;
  color: #999;
}
.login-footer {
  margin: 0 auto;
}
.login-footer p a {
  padding: 0 5px;
  color: rgba(0, 0, 0, 0.5);
}
canvas {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
