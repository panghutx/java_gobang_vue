<script setup>
// example component
import DefaultCounterCard from "../../../../examples/cards/counterCards/DefaultCounterCard.vue";
</script>

<script>
import { mapState } from 'vuex';
export default {
  
  data(){
    return{
      count:1000
    }
  },
  computed: {
    ...mapState(['userInfo']), // 将 userInfo 映射为组件的计算属性
  },
  created(){
    this.getCount()
  },
  methods:{
    getCount(){
      // console.log(userInfo.username);
    }
  }
}
</script>
<template>
  
  <section class="pt-4 pb-6" id="count-stats">
    <div class="container">

      <div class="row justify-content-center text-center" style="margin-top: 20px;">
        <div class="col-md-3">
          <DefaultCounterCard
            title="比赛场次"
            description="仅记录真人对战PVP游戏次数"
            :count="userInfo.totalCount"
            :duration="3000"
          />
        </div>
        <div class="col-md-3">
          <DefaultCounterCard
            title="胜利次数"
            description="仅包含真人对战PVP胜利次数"
            :count="userInfo.winCount"
            :duration="3000"
          />
        </div>
        <div class="col-md-3">
          <DefaultCounterCard
            title="天梯积分"
            description="初始积分1000分，胜利/失败加减30分"
            :count="userInfo.score"
            :duration="4000"
          />
        </div>
      </div>
    </div>
  </section>
</template>
