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
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Shipping address" tabindex="-1">
        <el-form :model="form">
            <el-form-item label="Promotion name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Zones" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="Please select a zone">
                    <el-option label="Zone No.1" value="shanghai" />
                    <el-option label="Zone No.2" value="beijing" />
                    <el-option label="Zone No.3" value="props.dialogFormVisible" v-model="dialogVisible"/>
                </el-select>
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