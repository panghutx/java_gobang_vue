<script setup>
import { onMounted } from "vue";

// example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";
import luozi from "@/assets/mp3/luozi.mp3";
import fail from "@/assets/mp3/fail.mp3";
import success from "@/assets/mp3/success.mp3";


</script>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            gameInfo: {
                roomId: null,
                thisUserId: null,
                thatUserId: null,
                isWhite: true,
            },
            screen: '游戏初始化，请稍等',
            winStyles: {
                backgroundColor: '',
            },
            show: false,
            dropSound: new Audio(luozi),
            successSound: new Audio(success),
            failSound: new Audio(fail),
            

        };
    },
    created() {
        this.initWebSocket();
    },

    methods: {
        goHome() {
            this.$router.push('/')
        },
        initWebSocket() {
            //初始化weosocket
            const wsuri = import.meta.env.VITE_WS_URI + '/ai?token=' + localStorage.getItem('token');
            this.websock = new WebSocket(wsuri);
            // 客户端接收服务端数据时触发
            this.websock.onmessage = this.receiveMsg;
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
        },
        // 通信发生错误时触发
        websocketonerror() {
            console.log("出现错误");
        },
        receiveMsg(event) {
            // console.log("[handlerGameReady] " + event.data);
            let resp = JSON.parse(event.data);
            console.log(resp);
            if (!resp.ok) {
                this.$message({
                    message: resp.reason,
                    type: 'warning'
                })
                this.$router.push('/')
                return;
            }
            console.log(resp.ok);
            if (resp.ok == true) {
                this.screen = '轮到你下棋了'
                this.initGame();
            }


        },
        websocketclose(e) {
            //关闭
            console.log("断开连接", e);
        },


        //设置屏幕信息
        setScreenText(me) {
            if (me) {
                this.screen = '轮到你落子了'
            } else {
                this.screen = '轮到对方落子了'
            }

        },
        initGame() {
            
            let prevPiece = { i: -1, j: -1 };
            
            
            // 游戏是否结束
            let over = false;
            let chessBoard = [];
            //初始化chessBord数组(表示棋盘的数组)
            for (let i = 0; i < 15; i++) {
                chessBoard[i] = [];
                for (let j = 0; j < 15; j++) {
                    chessBoard[i][j] = 0;
                }
            }
            console.log(chess);
            let context = chess.getContext('2d');
            context.strokeStyle = "red";
            // 背景图片
            let logo = new Image();
            logo.src = 'https://img1.imgtp.com/2023/07/31/GZxDE4iE.png'
            logo.onload = function () {
                context.drawImage(logo, 0, 0, 450, 450);
                initChessBoard();
                // 绘制棋盘网格
            }

            
            // 绘制一个棋子, me 为 true
            function oneStep1(s, i, j) {
                that.dropSound.play();
                // console.log(that.dropSound);
                // 清除上一个棋子的高亮效果
                if (prevPiece.i >= 0 && prevPiece.j >= 0) {
                    drawPiece(prevPiece.i, prevPiece.j,s); // 重新绘制上一个棋子
                }

                context.beginPath();
                context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
                context.closePath();
                var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
                if (s == 1) {
                    gradient.addColorStop(0, "#0A0A0A");
                    gradient.addColorStop(1, "#636766");
                } else {
                    gradient.addColorStop(0, "#D1D1D1");
                    gradient.addColorStop(1, "#F9F9F9");
                }
                
                context.fillStyle = gradient;
                context.fill();

                // 绘制高亮效果
                var highlightGradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 2, 15 + i * 30 + 2, 15 + j * 30 - 2, 10);
                highlightGradient.addColorStop(0, "rgba(255, 255, 0, 0.8)"); // 设置高亮颜色
                highlightGradient.addColorStop(1, "rgba(255, 255, 0, 0)"); // 设置透明
                context.fillStyle = highlightGradient;
                context.fill();

                // 更新上一个棋子的坐标
                prevPiece.i = i;
                prevPiece.j = j;

            
            }

            const that = this;
            chess.onclick = function (e) {
                // console.log(e);
                if (over) {
                    return;
                }

                let x = e.offsetX;
                let y = e.offsetY;
                // 注意, 横坐标是列, 纵坐标是行
                let col = Math.floor(x / 30);
                let row = Math.floor(y / 30);
                if (chessBoard[row][col] == 0) {
                    // 发送坐标给服务器, 服务器要返回结果
                    send(row, col);
                }
            }

            // 清除指定位置的高亮效果
            function clearHighlight(i, j) {
                context.clearRect(15 + i * 30 - 15, 15 + j * 30 - 15, 30, 30);
            }
            // 绘制棋子
            function drawPiece(i, j,s) {
                context.beginPath();
                context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
                context.closePath();
            
                var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
                if (s == 2) {
                    gradient.addColorStop(0, "#0A0A0A");
                    gradient.addColorStop(1, "#636766");
                } else {
                    gradient.addColorStop(0, "#D1D1D1");
                    gradient.addColorStop(1, "#F9F9F9");
                }
                context.fillStyle = gradient;
                context.fill();
            }

            function send(row, col) {
                let req = {
                    message: 'putChess',
                    row: row,
                    col: col
                };

                that.websock.send(JSON.stringify(req));
            }


            function initChessBoard() {
                for (let i = 0; i < 15; i++) {
                    context.moveTo(15 + i * 30, 15);
                    context.lineTo(15 + i * 30, 435);
                    context.stroke();
                    context.moveTo(15, 15 + i * 30);
                    context.lineTo(435, 15 + i * 30);

                }
                context.stroke();
            }
            this.websock.onmessage = function (event) {
                // console.log("[handlerPutChess] " + event.data);
                

                let resp = JSON.parse(event.data);
                console.log(resp);
                if (resp.message != 'putChess') {
                    console.log("响应类型错误!");
                    return;
                }

                oneStep1(resp.p, resp.pCol, resp.pRow);
                // 给对应的位置设为 1, 方便后续逻辑判定当前位置是否已经有子了. 
                chessBoard[resp.pRow][resp.pCol] = 1;
                oneStep1(resp.e, resp.eCol, resp.eRow)
                chessBoard[resp.eRow][resp.eCol] = 2;


                // 判定游戏是否结束

                if (resp.winner != 0) {
                    if (resp.winner == 1) {
                        // alert('你赢了!');
                        that.screen = '你赢了'
                        that.winStyles.backgroundColor = 'rgb(6, 255, 43)'
                        that.successSound.play();
                    } else if (resp.winner = 2) {
                        // alert('你输了!');
                        that.screen = '你输了'
                        that.winStyles.backgroundColor = 'rgb(223, 113, 113)'
                        that.failSound.play();
                    } else {
                        alert("winner 字段错误! " + resp.winner);
                    }

                    // 增加一个按钮, 让玩家点击之后, 再回到游戏大厅~

                    that.show = true;

                }
            }

        },

    }
}
</script>
<style>
#chess {}
</style>
<template>
    <DefaultNavbar transparent />
    <Header>
        <div class="page-header align-items-start min-vh-100" :style="{
            backgroundImage:
                'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
        }" loading="lazy">
            <span class="mask bg-gradient-dark opacity-6"></span>
            <div class="container my-auto">

                <div>
                    <canvas id="chess" width="450" height="450"></canvas>
                </div>

                <div style="margin-top: 20px; width: 450px;">
                    <el-card shadow="always" :style="winStyles">
                        {{ screen }}
                    </el-card>

                </div>

                <div style="margin-top: 20px;" v-show=show>
                    <el-button @click="goHome" type="primary" round>返回大厅</el-button>
                    <!-- <el-button type="success" round>保存棋局</el-button> -->
                </div>

            </div>

        </div>
    </Header>
</template>
