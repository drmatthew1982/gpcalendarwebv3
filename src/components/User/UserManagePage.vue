
<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import service from "@/webservice";
import md5 from "js-md5";
import { useBase64 } from '@vueuse/core'


const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    newpassword:undefined,
    confirmnewpassword: undefined
})
const validatePass2 = () => {
    return (rule, value, callback) => {
        if (value !== ruleForm.newpassword && ruleForm.confirmnewpassword !== '') {
            callback(new Error('两次输入密码不一致!'))
        } else {
            callback()
        }
    }}
const rules = reactive<FormRules>({
    newpassword: [
        {required: true, message: 'Please input new password', trigger: 'blur'}
    ],
    confirmnewpassword: [
        {required: true, message: 'Please input new password', trigger: 'blur'},
        {required: true, message: 'Confirm password should same as "new password"', trigger: 'blur', validator: validatePass2()}
    ]
})


const changePassword = async (formEl: FormInstance | undefined)=>{
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let user = {
                id: localStorage.getItem('userid'),
                password: useBase64(md5(ruleForm.newpassword) + generateRandomID(10))
            };
        }
    })
}
const generateRandomID = (length:number) => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const idLength = length; // 字符串长度 这里生成30位的
    let randomID = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }

    return randomID;
}


</script>
<template>
    <el-form
            ref="ruleFormRef"
            label-position="left"
            label-width="auto"
            style="max-width: 460px"
            class="loginForm"
            :model="ruleForm"
            :rules="rules"
    >
        <el-row>
        <el-form-item label="New Passwrod: " prop="newpassword">
            <el-input type="password" v-model="ruleForm.newpassword" />
        </el-form-item>
        <el-form-item label="Confirm  Passwrod: " prop="confirmnewpassword">
            <el-input type="password" v-model="ruleForm.confirmnewpassword" />
        </el-form-item>

            </el-row>
        <el-row>
            <el-button
                    type="primary"
                    class="loginBtn"
                    @click="changePassword(ruleFormRef)"
            >
                Change Password
            </el-button>
        </el-row>
    </el-form>
</template>