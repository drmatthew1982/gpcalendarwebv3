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
    </div>
</template>
<script>
import { reactive, toRefs } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import service from '@/webservice'
export default {
    setup() {
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
            let params = new URLSearchParams();
            params.append("username",form.loginname);
            params.append("password",form.loginpassword);
            let obj = service.post('http://localhost:8080/logincheck',
                params,
                headers).then(response=> {
                    console.log(response.data)
                if (response.data.length > 0) {
                    localStorage.setItem('token', 'logined');
                    localStorage.setItem('userid', response.data[0].id);
                    window.location.href = "/";
                }else{
                    ElMessage({
                        type: 'error',
                        showClose: true,
                        dangerouslyUseHTMLString: true,
                        message: "Login error",
                    })
                }
            });

            //router.push('/');

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
