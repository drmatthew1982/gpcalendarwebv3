<script setup lang="ts">
import {reactive, ref, toRefs,watch, defineProps,watchEffect} from "vue";
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
    emit('dialogClosed');
}
const formLabelWidth = '140px'
const form = reactive({
    name: '',
    code: ''
})
const headers= {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}
const formSubmit = ()=> {
    let organisation = {
        org_name:form.name,
        org_code:form.code,
        created_user_id:localStorage.getItem('userid')
    };
    service.post('http://localhost:8080/createorg',
        organisation,
        headers).then(response=> {
        console.log(response.data);
        dialogVisible.value = false;
        emit('dialogClosed');
    })
}
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Create Organisation" tabindex="-1">
        <el-form :model="form">
            <el-form-item label="Organisation name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Organisation code" :label-width="formLabelWidth">
                <el-input v-model="form.code" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Cancel</el-button>
        <el-button type="primary" @click="formSubmit">
          Confirm
        </el-button>
      </span>
        </template>
    </el-dialog>

</template>

<style scoped>

</style>