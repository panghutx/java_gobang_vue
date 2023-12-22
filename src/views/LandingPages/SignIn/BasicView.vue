<script>

import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";
import axios from 'axios'

export default {

  components: {
    DefaultNavbar,Header
  },
    data() {
        return {
            ruleForm: {
                username: "",
                password: "",
            },
            rules: {
                username: [
                    { required: true, message: "用户名不能为空！", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "密码不能为空！", trigger: "blur" },
                ],
            },
        };
    },
    methods: {
        
        submitForm(formName) {
            
            console.log(formName);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios({
                        method: 'post',		// 请求方法
                        url: import.meta.env.VITE_URI+'/login',	// 请求地址
                        data: {	// 请求参数
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        }
                    }).then((res) => {	// 请求成功回调
                        if (res.data.code == 3000) {
                            // 跳转页面到首页
                            localStorage.setItem("token", res.data.data);
                            this.$router.push('/');
                            // 显示后端响应的成功信息
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
                            });
                        }

                    }) .catch(function (error) {	// 请求异常回调
                            console.log(error);
                        });
                } else { //用户名或密码没填
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) { //重置
            this.$refs[formName].resetFields();
        },
    },
};
</script>
<template>
  <DefaultNavbar transparent />
  <Header>
    <div class="page-header align-items-start min-vh-100" :style="{
      backgroundImage:
        'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
    }" loading="lazy">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1">
                  <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                    登 录
                  </h4>

                </div>
              </div>
              <div class="card-body">

                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="left" label-width="70px"
                class="login-from">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="btnGroup">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <router-link to="/pages/landing-pages/register">
                    <el-button style="margin-left:10px">注册</el-button>
                </router-link>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Header></template>
