<script setup>
import RotatingCard from "../../../examples/cards/rotatingCards/RotatingCard.vue";
import RotatingCardFront from "../../../examples/cards/rotatingCards/RotatingCardFront.vue";
import RotatingCardBack from "../../../examples/cards/rotatingCards/RotatingCardBack.vue";
import DefaultInfoCard from "../../../examples/cards/infoCards/DefaultInfoCard.vue";

</script>
<script>
import axios from 'axios'
export default {
    data() {
        return {
            tableData: [{}]
        }
    },
    created() {
        axios({
            method: 'get',
            url: import.meta.env.VITE_URI+'/ranked',

        }).then((res) => {
            if (res.data.code == 3000) {
                this.tableData = res.data.data;
            } else {
                this.tableData = ''
                this.$message({
                    message: '查询失败',
                    type: 'warning'
                });
            }
        })
    }
}

</script>
<template>
  <section class="my-5 py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-4 ms-auto me-auto p-lg-4 mt-lg-0 mt-4">
          <RotatingCard>
            <RotatingCardFront icon="touch_app" title="游戏规则"
              description="五子棋 - 五子棋也称为连珠或连五子。 游戏是在一个15x15的棋盘内进行的。 第一个串连起5个自己颜色棋子的玩家获胜。" />

            <RotatingCardBack
              image="https://images.unsplash.com/photo-1498889444388-e67ea62c464b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1365&q=80"
              title="你准备好了吗" description="点击下方按钮，进入游戏大厅，决一死战吧！" :action="[
                {

                  route: './pages/landing-pages/contact-us',
                  label: 'go！',
                },
              ]" />


          </RotatingCard>
          

        </div>
        <div class="col-lg-6 ms-auto" style="margin-top: 20px;">
          <div class="row justify-content-start">

            <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%"
              @current-change="handleCurrentChange">
              <el-table-column type="index" width="50" />
              <el-table-column property="username" label="" width="120" />
              <el-table-column property="count" label="win/lose" width="120" />
              <el-table-column property="score" label="天梯分" />
            </el-table>

          </div>

        </div>
      </div>
    </div>
  </section>
</template>
