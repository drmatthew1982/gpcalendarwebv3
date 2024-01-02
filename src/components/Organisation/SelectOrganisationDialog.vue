<script setup lang="ts">
import {ref, toRefs,watch, defineProps} from "vue";
import OrganisationSelectionTable from "@/components/Organisation/OrganisationSelectionTable.vue";
import {getCurrentInstance} from 'vue'

const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const headers = globalProperties.$defaultheaders
let props = defineProps({
    selectOrgDialogShow: {
        type: Boolean,
        default: false,
    },
});
const refProps = toRefs(props)
let dialogVisible = ref(props.selectOrgDialogShow)

watch(refProps.selectOrgDialogShow, (val, old) => {
    dialogVisible.value = val
}, { deep: true })//监听修改本地
const emit = defineEmits(['selectOrganisationClosed','dialogClosed'])
const dialogClosed = ()=> {
    dialogVisible.value=false;
    emit('dialogClosed');
}
const selectDialogClose = (param)=> {
    dialogVisible.value=false;
    emit('selectOrganisationClosed',param);
}



</script>

<template>
    <el-dialog v-model="dialogVisible" title="Select Organisation" tabindex="-1" :before-close="dialogClosed">
        <OrganisationSelectionTable @dialogClosed="selectDialogClose"/>
    </el-dialog>

</template>

<style scoped>

</style>