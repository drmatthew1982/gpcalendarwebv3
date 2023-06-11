<script setup lang="ts">
import {reactive, ref, toRefs,watch, defineProps,watchEffect} from "vue";

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
    console.log(dialogVisible.value);
    dialogVisible.value=false;
    console.log(dialogVisible.value);
    emit('dialogClosed');
}
const formLabelWidth = '140px'
const form = reactive({
    eventcmt: undefined,
    client_id: undefined,
    date: undefined,
    starttime: undefined,
    endtime: undefined,
    reportstatus: 0,
    orgid:undefined
})
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Shipping address" tabindex="-1">
        <el-form :model="form">
            <el-form-item label="Event comment" :label-width="formLabelWidth" prop="eventcmt">
                <el-input v-model="form.eventcmt" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Select a client" :label-width="formLabelWidth" prop="client_id">
                <el-input v-model="form.client_id" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Select a orgnization" :label-width="formLabelWidth" prop="client_id">
                <el-input v-model="form.orgid" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Date" :label-width="formLabelWidth" prop="date">
                <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Start Time" :label-width="formLabelWidth" prop="starttime">
                <el-time-picker v-model="form.starttime"  autocomplete="off" />
            </el-form-item>
            <el-form-item label="End Time" :label-width="formLabelWidth" prop="endtime">
                <el-time-picker v-model="form.endtime"  autocomplete="off" />
            </el-form-item>
            <el-form-item label="Ready for Report">
                <el-switch v-model="form.reportstatus" />
            </el-form-item>

        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Cancel</el-button>
        <el-button type="primary" @click="dialogClose">
          Confirm
        </el-button>
      </span>
        </template>
    </el-dialog>

</template>

<style scoped>

</style>