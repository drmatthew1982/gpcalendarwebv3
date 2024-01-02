<script setup lang="ts">
import {ref, toRefs,watch, defineProps} from "vue";
import ClientSelectionTable from "@/components/Client/ClientSelectionTable.vue";
import service from "@/webservice";
import {getCurrentInstance} from 'vue'

const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const headers = globalProperties.$defaultheaders

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
const emit = defineEmits(['selectClientClosed','dialogClosed'])
const dialogClosed = ()=> {
    dialogVisible.value=false;
    emit('dialogClosed');
}
const selectDialogClose = (param)=> {
    dialogVisible.value=false;
    emit('selectClientClosed',param);
}

</script>

<template>
    <el-dialog v-model="dialogVisible" title="Select Client" tabindex="-1" :before-close="dialogClosed">
        <ClientSelectionTable @dialogClosed="selectDialogClose"/>
    </el-dialog>

</template>

<style scoped>

</style>