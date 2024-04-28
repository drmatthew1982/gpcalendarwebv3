
<script setup lang="ts">
import {reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import service from "@/webservice";
import md5 from "js-md5";
import CryptoJS from 'crypto-js';
import {getCurrentInstance} from 'vue'

const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const headers = globalProperties.$defaultheaders
//'+globalProperties.$serviceurl+'
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

const changePassword = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let username:string = localStorage.getItem('username')
            let prepassword = md5(ruleForm.newpassword+username) + generateRandomID(16)
            console.log(prepassword);
            let key=CryptoJS.enc.Utf8.parse(fulfillZeroTill16(username.substring(0,3)))
            let iv = CryptoJS.enc.Utf8.parse(fulfillZeroTill16(username.substring(username.length-3) ));
            let srcs = CryptoJS.enc.Utf8.parse(prepassword);
            let encrypted =  CryptoJS.AES.encrypt(srcs,key,{
                    iv:iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.NoPadding,
            });
            let password = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
            let user={
                id:localStorage.getItem('userid'),
                username:username,
                password:password
            }
            service.post('http://'+globalProperties.$serviceurl+'/updatepassword',
                user,
                headers).then(response => {
            })
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
const fulfillZeroTill16 = (string:string) => {


    for (let i = string.length;i < 16; i++) {
        string = string+"0";
    }
    return string;
}

</script>
<template>
    <el-text class="mx-1" size="large" type="warning">This function is not workable for "tester"</el-text>
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