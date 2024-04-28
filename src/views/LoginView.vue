<template>
    <div class="layout">
        <el-tabs type="border-card">
            <el-tab-pane label="Login">
                <el-form
                    label-position="right"
                    label-width="60px"
                    style="max-width: 460px"
                    class="loginForm"
                >
                    <el-form-item label="Username: ">
                        <el-input v-model="loginname" />
                    </el-form-item>
                    <el-form-item label="Passwrod: ">
                        <el-input type="password" v-model="loginpassword" />
                    </el-form-item>

                    <el-row>
                        <el-checkbox
                            class="checkBox"
                            v-model="isAgree"
                            label="Agree user principles"
                            name="type"
                        />
                    </el-row>
                    <el-button
                        v-if="isAgree"
                        type="primary"
                        class="loginBtn"
                        @click="login"
                    >
                        Login
                    </el-button>
                </el-form>
            </el-tab-pane>
    <!--
            <el-tab-pane label="Register">
                <el-form
                    label-position="right"
                    label-width="100px"
                    style="max-width: 460px"
                    class="loginForm"
                >
                    <el-form-item label="username:">
                        <el-input v-model="rEmail" />
                    </el-form-item>
                    <el-form-item label="Passwro:">
                        <el-input type="password" v-model="rPassword" />
                    </el-form-item>
                    <el-form-item label="Confirm Password:">
                        <el-input
                            type="password"
                            v-model="confirmPassword"
                            @blur="confirmFunc"
                        />
                    </el-form-item>
                    <el-form-item label="Identify Code：">
                        <el-row>
                            <el-input
                                type="password"
                                v-model="identifyCode"
                                class="inpWidth"
                            />
                            <el-button type="primary" @click="getIdentifyCode" plain>
                                Get Identify Code
                            </el-button>
                        </el-row>
                    </el-form-item>

                    <el-row>
                        <el-checkbox
                            class="checkBox"
                            v-model="rAgree"
                            label="Agree user principles"
                            name="type"
                        />
                    </el-row>
                    <el-button
                        v-if="rAgree"
                        type="primary"
                        class="loginBtn"
                        @click="register"
                    >
                        Register
                    </el-button>
                </el-form>
            </el-tab-pane>-->
        </el-tabs>
        <br/>
        <el-text class="mx-1" size="large" type="warning">For guests/vistors</el-text>
        <br/>
        <el-text class="mx-1" size="large" type="warning">Please use follow information login</el-text>
        <br/>
        <br/>
        <el-text class="mx-1" size="large" >Username: tester</el-text>
        <br/>
        <el-text class="mx-1" size="large" >Password: retset</el-text>
        <br/>
        <br/>
        <el-text class="mx-1" size="large" type="warning">This project still in MVP phase,</el-text>
        <el-text class="mx-1" size="large" type="warning">so this is a simple and vulnerable playground.</el-text>
        <br/>
        <el-text class="mx-1" size="large" type="warning">But please kindly and avoid play tricky and evil on it</el-text>
        <br/>
        <el-text class="mx-1" size="large" type="warning">(If you like, you can have you own account if you contact me, but almost no different than "tester" )</el-text>
        <br/>
        <br/>
        <el-text class="mx-1" size="large">And if you have any job opportunity</el-text>
        <br/>
        <el-text class="mx-1" size="large">Please contact me at LinkedIn, many thanks</el-text>
        <br/>
        <br/>
        <el-text class="mx-1" size="large"><a href="https://www.linkedin.com/in/matthew-zhu-nz/" target="_blank">https://www.linkedin.com/in/matthew-zhu-nz/</a></el-text>
    </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import service from '@/webservice'
import md5 from "js-md5";
import {getCurrentInstance} from "vue";
export default {
    setup() {
        const globalProperties = getCurrentInstance().appContext.config.globalProperties;
        const form = reactive({
            loginname: "",
            loginpassword: "",
            isAgree: 0,
        });
        const registerForm = reactive({
            rEmail: "",
            rPassword: "",
            confirmPassword: "",
            identifyCode: "",
            rAgree: 0,
        });
        const router = useRouter();
        const headers= {
            Accept: 'application/json;charset=UTF-8',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        // 方法
        // 登录
        function login() {console.log("login");
            let securekey = '111';
            let params = new URLSearchParams();
            params.append("username",form.loginname);
             service.post('http://'+globalProperties.$serviceurl+'/getSecKey',
                 params,
                 headers).then(response=> {
                 securekey=response.data[0]
                 params.append("password",md5(md5(form.loginpassword+form.loginname)+securekey));
                 let obj = service.post('http://'+globalProperties.$serviceurl+'/logincheck',
                     params,
                     headers).then(response=> {
                     if (response.data.length > 0) {
                         localStorage.setItem('token', 'logined');
                         localStorage.setItem('userid', response.data[0].id);
                         localStorage.setItem('username', response.data[0].username);
                         window.location.href = "/";
                     }else{
                         ElMessage({
                             type: 'error',
                             showClose: true,
                             dangerouslyUseHTMLString: true,
                             message: "Login error,check user name or password,please",
                         })
                     }
                 });
            });
        }
        // 注册
        function register() {
            console.log("Register", registerForm);
        }
        // 获取验证码
        function getIdentifyCode() {
            console.log("Get Identify Code");
        }
        // 确认密码
        // function confirmFunc() {
        //   if (registerForm.confirmPassword !== registerForm.rPassword)
        //     alert("密码与确认密码不一致");
        // }
        const confirmFunc = () => {
            if (registerForm.confirmPassword !== registerForm.rPassword)
                ElMessage.error("The password and confirmPassword is different.");
        };
        return {
            ...toRefs(form),
            ...toRefs(registerForm),
            login,
            register,
            getIdentifyCode,
            confirmFunc,
        };
    },
};
</script>

<style scoped>
.layout {
    position: absolute;
    left: calc(50% - 200px);
    top: 20%;
    width: 400px;
}
.loginBtn {
    width: 100px;
}
.loginForm {
    text-align: center;
}
.checkBox {
    margin-left: 7px;
}
.inpWidth {
    width: 165px;
}
</style>
