<script setup lang="ts">
import {reactive, ref, toRefs,watch, defineProps,watchEffect} from "vue";
import service from "@/webservice";
import {FormInstance, FormRules} from "element-plus";

let props = defineProps({
    dialogShow: {
        type: Boolean,
        default: false,
    },
    editdata: {
        type: Object
    }
});
const refProps = toRefs(props)
let dialogVisible = ref(props.dialogShow)
let editdata = ref(props.editdata)
let editdataId =ref();
watch(refProps.dialogShow, (val, old) => {
    dialogVisible.value = val
}, { deep: true })//监听修改本地
watch(refProps.editdata, (val, old) => {
    ruleform.name = val.org_name,
    ruleform.code = val.org_code
    editdataId = val.id
}, { deep: true })//监听修改本地
const emit = defineEmits(['editDialogClosed'])
const dialogClose = ()=> {
    dialogVisible.value=false;
    emit('editDialogClosed');
}
const formLabelWidth = '140px'

const ruleFormRef = ref<FormInstance>()
const ruleform = reactive({
    name: undefined,
    code: undefined
})

const rules = reactive<FormRules>({
    name: [
        {required: true, message: 'Please input Activity name', trigger: 'blur'}
    ],
    code: [
        {required: true, message: 'Please input Activity code', trigger: 'blur'}
    ]
})
const headers= {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}
const formSubmit = ()=> {
    console.log("====:"+editdata.id);
    let organisation = {
        org_name:ruleform.name,
        org_code:ruleform.code,
        modified_user_id:localStorage.getItem('userid'),
        id:editdataId
    };
    service.post('http://localhost:8080/updateorg',
        organisation,
        headers).then(response=> {
        console.log(response.data);
        dialogVisible.value = false;
        emit('editDialogClosed');
    })
}
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Create Organisation" tabindex="-1" :before-close="dialogClose">
        <el-form ref="ruleFormRef" :model="ruleform" :rules="rules">
            <el-form-item label="Organisation name" :label-width="formLabelWidth" prop="name">
                <el-input v-model="ruleform.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="ruleform code" :label-width="formLabelWidth" prop="code">
                <el-input v-model="ruleform.code" autocomplete="off" disabled />
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