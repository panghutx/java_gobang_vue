<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

//image
import bg0 from "@/assets/img/bg9.jpg";

//dep
import Typed from "typed.js";

//sections
import Information from "./Sections/AboutInformation.vue";
import AboutTeam from "./Sections/AboutTeam.vue";
import Featuring from "./Sections/AboutFeaturing.vue";
import Newsletter from "./Sections/AboutNewsletter.vue";


const body = document.getElementsByTagName("body")[0];
//hooks
onMounted(() => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  if (document.getElementById("typed")) {
    // eslint-disable-next-line no-unused-vars
    var typed = new Typed("#typed", {
      stringsElement: "#typed-strings",
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 200,
      startDelay: 500,
      loop: true,
    });
  }
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});
</script>

<script>
import { mapState } from 'vuex';
import axios from "axios";
export default {
  data(){
    return {

    }
  },
  created(){
    this.getInfo()
  },
  computed: {
    ...mapState(['userInfo']), // 将 userInfo 映射为组件的计算属性
  },
  methods:{
    
    getInfo(){
      axios({
        method: 'get',		// 请求方法
        url: import.meta.env.VITE_URI+'/userinfo?token='+localStorage.getItem("token"),	// 请求地址
        
      }).then((res)=>{
        //发 setUserInfo mutation，并将 res.data 作为参数传递给它
        this.$store.commit('setUserInfo', res.data.data);
        
      })
    }
  }
}
</script>
<template>
  <DefaultNavbar
    :action="{
      route: 'javascript:;',
      label: 'Buy Now',
      color: 'btn-white',
    }"
    transparent
  />
  <header class="bg-gradient-dark">
    <div
      class="page-header min-vh-75"
      :style="{ backgroundImage: `url(${bg0})` }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center mx-auto my-auto">
            <h1 class="text-white">
              你好呀 <span class="text-white" id="typed"></span>
            </h1>
            <div id="typed-strings">
              <h1>{{  userInfo.username }}</h1>
              
            </div>

            <p class="lead mb-4 text-white opacity-8">
              We’re constantly trying to express ourselves and actualize our
              dreams. If you have the opportunity to play this game
            </p>

          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6">

    <!-- <AboutTeam /> -->
    <Featuring />
    <!-- <Newsletter /> -->
  </div>
  <DefaultFooter />
</template>
