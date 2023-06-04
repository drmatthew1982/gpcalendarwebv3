<template>
    <el-row>
        <el-button type="primary" @click="showCreateForm">Create My Organization </el-button>
    </el-row>
    <el-table :data="tableData.arr" style="width: 100%">
        <el-table-column prop="org_name" label="Name" width="120" />
        <el-table-column prop="org_code" label="Code" width="120" />
        <el-table-column>
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope)">Detail & Edit Name</el-button>
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
onMounted(()=> {
//setup 是围绕beforeCreate和created生命周期钩子运行的，不需要显式地定义它们。在这些钩子中编写的任何代码都应该直接在 setup 函数中编写。
//生命周期基本都被重命名 首字母大写后加上on前缀  例如beforeUpdate => onBeforeUpdate
    findData();
})

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
    console.log(editdata.id);
    editDialogShow.value = true;
}
const editDialogClosed = ()=>{
    console.log("editDialogClosed");
    findData();
    editDialogShow.value = false;
}
const showCreateForm = () => {
    console.log('click');
    dialogShow.value = true;
}
const headers= {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}
const findData =  ()=> {
    let organisation = {
        created_user_id:localStorage.getItem('userid')
    };
    service.get('http://localhost:8080/findorgbyuserid',
        organisation,
        headers).then(response=> {
        tableData.arr=response.data;
        console.log(tableData.arr);
    })
}
</script>
