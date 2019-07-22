<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"   @blur="cannelHintColor()">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')" @blur="cannelHintColor()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips" :class="{'hintColor':hintColor.display}">Tips : {{prompt.hint}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import axios from '../../utils/request.js';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: 'admin',
                    password: '123123'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                //提示
                prompt:{
                    hint:"用户名:admin,密码:123456"
                },
                hintColor:{
                    display: false
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                    var api = '/api/sysUser/login';
                        let param = {"username":this.ruleForm.username,"password":this.ruleForm.password};
                        console.info(param)
                      this.$axios.post(api,param).then((resp) =>{
                          
                            if(resp.data.code == 10000){
                                localStorage.setItem('ms_username',this.ruleForm.username);
                                this.$router.push('/');
                            }else if(resp.data.code == 10001){
                                this.prompt.hint = "用户名或密码错误";
                                this.hintColor.display = true;
                            }
                           
                        }).catch(function(error){
                            alert(error)
                        })
                 
                    } else {
                        console.log('error submit!!');
                        this.prompt.hint='错误提交。';
                        this.hintColor.display = true;
                        return false;
                    }
                });
            },
            cannelHintColor(){
                if(this.ruleForm.username.length > 0 && this.ruleForm.password.length > 0){
                    this.prompt.hint = "用户名:admin,密码:123456";
                    this.hintColor.display = false;
                }else{
                    this.prompt.hint = "请填写用户名密码";
                    this.hintColor.display = false;
                }
                
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .hintColor{
        color:red;
    }
</style>