<script setup lang="ts">
import {reactive, ref, toRefs,watch, defineProps,watchEffect} from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import ClientTableForSelect from "@/components/Client/ClientTableForSelect.vue";
import service from "@/webservice";

let props = defineProps({
    selectClientDialogShow: {
        type: Boolean,
        default: false,
    },
});
const refProps = toRefs(props)
let dialogVisible = ref(props.selectClientDialogShow)

watch(refProps.selectClientDialogShow, (val, old) => {
    dialogVisible.value = val
}, { deep: true })//监听修改本地
const emit = defineEmits(['selectClientClosed'])
const dialogClose = ()=> {
    dialogVisible.value=false;
    console.log('close');
    emit('selectClientClosed');
}
const selectDialogClose = (param)=> {
    dialogVisible.value=false;
    console.log(param.firstname);
    emit('selectClientClosed',param);
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


</script>

<template>
    <el-dialog v-model="dialogVisible" title="Select Client" tabindex="-1" :before-close="dialogClose">
        <ClientTableForSelect @dialogClosed="selectDialogClose"/>
    </el-dialog>

</template>

<style scoped>

</style>