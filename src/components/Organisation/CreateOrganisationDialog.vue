<script setup lang="ts">
import {reactive, ref, toRefs,watch, defineProps,watchEffect} from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import service from "@/webservice";
import {getCurrentInstance} from 'vue'

const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const headers = globalProperties.$defaultheaders
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
    emit('dialogClosed');
}
const formLabelWidth = '140px'
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
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

const formSubmit = async (formEl: FormInstance | undefined)=> {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let organisation = {
                org_name: ruleForm.name,
                org_code: ruleForm.code,
                created_user_id: localStorage.getItem('userid')
            };
            service.post('http://'+globalProperties.$serviceurl+'/createorg',
                organisation,
                headers).then(response => {
                dialogVisible.value = false;
                emit('dialogClosed');
            })
        }
    })
}

</script>

<template>
    <el-dialog v-model="dialogVisible" title="Create Organisation" tabindex="-1" :before-close="dialogClose">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
            <el-form-item label="Organisation name" :label-width="formLabelWidth" prop="name">
                <el-input v-model="ruleForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Organisation code" :label-width="formLabelWidth" prop="code">
                <el-input v-model="ruleForm.code" autocomplete="off" />
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