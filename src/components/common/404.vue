<template>
  <div style="height:100%">
      <div class="login-content">
        <div class="login-mian">
          <div class="img404 fl"><img class="" src="./img/404.png" /></div>
          <div class="text404 fr">
            <span>
              <div class="ero404">404</div>
              <p>抱歉，您访问的页面不存在</p>
              <el-button type="primary" size="medium"> <router-link to="/" style="color:#fff">返回首页</router-link></el-button>
            </span>
          </div>
        </div>
        <div class="d-login-footer">
          <p>copyright © 2018 <a href="/" target="_blank">fanteren</a></p>
          <p>
            <span><a href="/" target="_blank">帮助</a></span>
            <span><a href="/" target="_blank">隐私</a></span>
            <span><a href="/" target="_blank">条款</a></span>
          </p>
        </div>
      </div>
      
  </div>
</template>
<script>
  import qs from 'qs'
  import axios from 'axios'
  // import fingerprint from 'fingerprint'

  export default {
    name: 'login',
    data () {
      return {
      }
    },
  }
</script>
<style scoped>
.login-content{display: flex; min-height: 100%; flex-direction: column;}
.login-mian{ padding:100px 0; width: 900px;margin:0 auto; flex: 1 1 0%; font-size: 0}
.img404,.text404{ height: 400px;}
.img404 img{ display: block; height: 100%; }
.text404{display: flex; flex-flow: wrap; align-items: center;}
.text404 p{ line-height: 22px; font-size: 20px; color: #999; margin:20px 0;}
.ero404{ line-height: 90px; font-size: 90px; color: #636363; }
.d-login-footer p a{padding: 0 5px; color: rgba(0,0,0,.5); } 
</style>
