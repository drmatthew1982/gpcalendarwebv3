<script setup lang="ts">
import {ref, toRefs,watch, defineProps} from "vue";
import OrganisationSelectionTable from "@/components/Organisation/OrganisationSelectionTable.vue";

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
const emit = defineEmits(['selectOrganisationClosed'])
const dialogClose = ()=> {
    dialogVisible.value=false;
    console.log('close');
    emit('selectOrganisationClosed');
}
const selectDialogClose = (param)=> {
    dialogVisible.value=false;
    console.log(param.firstname);
    emit('selectOrganisationClosed',param);
}

const headers= {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}

</script>

<template>
    <el-dialog v-model="dialogVisible" title="Select Organisation" tabindex="-1" :before-close="dialogClose">
        <OrganisationSelectionTable @dialogClosed="selectDialogClose"/>
    </el-dialog>

</template>

<style scoped>

</style>