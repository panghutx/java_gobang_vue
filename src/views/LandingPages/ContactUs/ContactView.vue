<script setup>
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//image
import image from "@/assets/img/illustrations/illustration-signin.jpg";

//material components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextArea from "@/components/MaterialTextArea.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>

<script>
export default {
  data() {
    return {
      status: false,
      copyWrite: '开始匹配',
      buttonType1: 'primary',
      buttonType2: 'success',
      failReason: '连接异常，请登录后重试',
    }
  },
  created() {
    this.initWebSocket();
  },

  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      // const wsuri = 'ws://101.42.247.231:8082/findMatch';
      const wsuri = import.meta.env.VITE_WS_URI+'/findMatch?token='+localStorage.getItem("token")
      this.websock = new WebSocket(wsuri);
      // 客户端接收服务端数据时触发
      this.websock.onmessage = this.websocketonmessage;
      // 连接建立时触发
      this.websock.onopen = this.websocketonopen;
      // 通信发生错误时触发
      this.websock.onerror = this.websocketonerror;
      // 连接关闭时触发
      this.websock.onclose = this.websocketclose;
    },
    // 连接建立时触发
    websocketonopen() {
      console.log("建立连接");
      // this.websock.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
      // this.websock.send(JSON.stringify({
      //         token: 
      //       }));
    },
    // 通信发生错误时触发
    websocketonerror() {
      console.log("出现错误");
    },
    // 客户端接收服务端数据时触发
    websocketonmessage(e) {
      let resp = JSON.parse(e.data);
      console.log(resp);
      if (!resp.ok) {
        this.failReason = resp.reason
        return
      }
      if (resp.message == 'startMatch') {
        this.copyWrite = '匹配中，请稍等…'
        this.buttonType1 = 'warning'
      } else if (resp.message == 'stopMatch') {
        this.copyWrite = '开始匹配'
        this.buttonType1 = 'primary'
      } else if (resp.message = 'matchSuccess') {
        this.$router.push('/pages/landing-pages/pvp');
      }

    },
    websocketsend() {
      //先判断是否建立连接，建立连接后才能进行匹配
      if (this.websock.readyState == this.websock.OPEN) {
        this.status = !this.status //更改匹配状态
        if (this.status == true) {
          // 数据发送
          this.websock.send(
            JSON.stringify({
              message: 'startMatch',
            }));

        } else {
          this.websock.send(
            JSON.stringify({
              message: 'stopMatch',
            }));
        }
      } else {
        this.$message({
          message: this.failReason,
          type: 'warning'
        })
      }

    },
    // 连接关闭时触发
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },

    aipk() {
      if(localStorage.getItem("token")==null){
        this.$message({
          message: this.failReason,
          type: 'warning'
        })
        return
      }
      this.$router.push('/pages/landing-pages/pve')
    }

  }
}
</script>
<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar :sticky="true" :action="{
          route: 'https://www.creative-tim.com/product/vue-material-kit-pro',
          color: 'bg-gradient-success',
          label: 'Buy Now',
        }" />
      </div>
    </div>
  </div>
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
            <div class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
              :style="{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }" loading="lazy"></div>
          </div>
          <div class="mt-8 col-xl-5 col-lg-6 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
            <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                  <h3 class="text-white text-success mb-0">游戏大厅</h3>
                </div>
              </div>
              <div class="card-body">
                <p class="pb-3">
                  点击开始匹配按钮，匹配到对手后才可进入游戏<br>
                  点击人机对战按钮，即可与机器人展开对决，可别小看机器人哦~
                </p>
               

                  <div class="card-body p-0 my-3">

                    <div class="row">
                      <div class="col-md-12 text-center">
                        <el-button :type="buttonType1" round style="width: 300px;" @click="websocketsend()">{{ copyWrite }}</el-button>
                      </div>

                    </div>


                    <div class="row" style="margin-top: 20px;">
                      <div class="col-md-12 text-center">
                        <el-button :type="buttonType2" round style="width: 300px;" @click="aipk()">人机对战</el-button>
                      </div>
                    </div>

                    <div class="row" style="margin-top: 20px;">
                      <div class="col-md-12 text-center">
                        <el-button :type="buttonType1" round style="width: 300px;" @click="websocketsend()">{{ copyWrite }}</el-button>
                      </div>
                    </div>
                  </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <DefaultFooter />
</template>
