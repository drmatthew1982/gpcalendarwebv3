<script setup lang="ts">
import {reactive, ref, toRefs,watch, defineProps,watchEffect} from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import service from "@/webservice";

let props = defineProps({
    dialogShow: {
        type: Boolean,
        default: false,
    },
});
const refProps = toRefs(props)
let dialogVisible = ref(props.dialogShow)

watch(refProps.dialogShow, (val, old) => {
    dialogVisible.value = val
}, { deep: true })//监听修改本地
const emit = defineEmits(['dialogClosed'])
const dialogClose = ()=> {
    dialogVisible.value=false;
    console.log('close');
    emit('dialogClosed');
}
const formLabelWidth = '140px'
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    firstname: undefined,
    middlename: undefined,
    lastname: undefined,
    birthday: undefined,
    gender: 0,
    client_id_no:undefined
})

const rules = reactive<FormRules>({
    firstname: [
        {required: true, message: 'Please input Activity first name', trigger: 'blur'}
    ],
    lastname: [
        {required: true, message: 'Please input Activity last name', trigger: 'blur'}
    ],
    client_id_no: [
        {required: true, message: 'Please input Activity id', trigger: 'blur'}
    ]
})
const headers= {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}
const formSubmit = async (formEl: FormInstance | undefined)=> {
    console.log("submit: "+formEl);
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        console.log("valid: "+valid);
        console.log("fields: "+fields);
        if (valid) {
            let client = {
                firstname: ruleForm.firstname,
                middlename: ruleForm.middlename,
                lastname: ruleForm.lastname,
                birthday:ruleForm.birthday,
                gender: ruleForm.gender,
                client_id_no:ruleForm.client_id_no,
                created_user_id: localStorage.getItem('userid')
            };
            service.post('http://localhost:8080/createclient',
                client,
                headers).then(response => {
                console.log(response.data);
                dialogVisible.value = false;
                emit('dialogClosed');
            })
        }
    })
}

</script>

<template>
    <el-dialog v-model="dialogVisible" title="Create Client" tabindex="-1" :before-close="dialogClose">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
            <el-form-item label="First Name" :label-width="formLabelWidth" prop="firstname">
                <el-input v-model="ruleForm.firstname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Middle Name" :label-width="formLabelWidth" prop="middlename">
                <el-input v-model="ruleForm.middlename" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Last Name" :label-width="formLabelWidth" prop="lastname">
                <el-input v-model="ruleForm.lastname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Birthday" :label-width="formLabelWidth" prop="birthday">
                <el-date-picker v-model="ruleForm.birthday" type="date" value-format="YYYY-MM-DD" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Gender" :label-width="formLabelWidth" prop="gender">
                <el-radio-group v-model="ruleForm.gender" size="large">
                    <el-radio-button label="0">Not selected</el-radio-button>
                    <el-radio-button label="1">Male</el-radio-button>
                    <el-radio-button label="2">Female</el-radio-button>
                    <el-radio-button label="3">Other</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Client ID" :label-width="formLabelWidth" prop="client_id_no">
                <el-input v-model="ruleForm.client_id_no" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogClose">Cancel</el-button>
            <el-button type="primary" @click="formSubmit(ruleFormRef)">
              Confirm
            </el-button>
          </span>
        </template>
    </el-dialog>

</template>

<style scoped>

</style>