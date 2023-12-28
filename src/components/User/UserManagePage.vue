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
                    <el-form-item label="Passwrod: ">
                        <el-input type="password" v-model="loginpassword" />
                    </el-form-item>
                    <el-form-item label="Confirm Passwrod: ">
                        <el-input type="password" v-model="confirmloginpassword" />
                    </el-form-item>


                    <el-button
                            type="primary"
                            class="loginBtn"
                            @click="changePassword"
                    >
                        Change Password
                    </el-button>
                </el-form>
            </el-tab-pane>
</template>
<script setup lang="ts">
import {ref} from "vue";

let loginpassword = ref("");
let confirmloginpassword = ref("");
const changePassword = () => {

}
</script>