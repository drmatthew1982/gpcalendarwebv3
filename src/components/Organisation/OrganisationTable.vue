<template>
    <el-row>
        <el-button type="primary" @click="showCreateForm">Create My Organization </el-button>
    </el-row>
    <el-table :data="tableData.arr" style="width: 100%">
        <el-table-column prop="org_name" label="Name" width="120" />
        <el-table-column prop="org_code" label="Code" width="120" />
        <el-table-column>
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope)">Detail & Edit Org</el-button>
            </template>
        </el-table-column>
    </el-table>
    <CreateOrginsationDialog :dialogShow="dialogShow" @dialogClosed="dialogClosed"/>
    <UpdateOrginsationDialog :dialogShow="editDialogShow" :editdata ="editdata" @editDialogClosed="editDialogClosed"/>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import CreateOrginsationDialog from '@/components/Organisation/CreateOrganisationDialog.vue';
import UpdateOrginsationDialog from '@/components/Organisation/UpdateOrganisationDialog.vue';
import service from "@/webservice";
import {getCurrentInstance} from 'vue'

onMounted(()=> {
//setup 是围绕beforeCreate和created生命周期钩子运行的，不需要显式地定义它们。在这些钩子中编写的任何代码都应该直接在 setup 函数中编写。
//生命周期基本都被重命名 首字母大写后加上on前缀  例如beforeUpdate => onBeforeUpdate
    findData();
})

const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const headers = globalProperties.$defaultheaders
let dialogShow = ref(false);
let editDialogShow = ref(false);

let editdata =ref([]);
let tableData = reactive({
    arr: []
});
const dialogClosed = ()=>{
    findData();
    dialogShow.value = false;
    editdata =ref([]);
}
const edit = (scope) => {
    editdata = scope.row;
    editDialogShow.value = true;
}
const editDialogClosed = ()=>{
    findData();
    editDialogShow.value = false;
}
const showCreateForm = () => {
    dialogShow.value = true;
}

const findData =  ()=> {
    let organisation = {
        created_user_id:localStorage.getItem('userid')
    };
    service.get('http://'+globalProperties.$serviceurl+'/findorgbyuserid',
        organisation,
        headers).then(response=> {
        tableData.arr=response.data;
    })


}

</script>
