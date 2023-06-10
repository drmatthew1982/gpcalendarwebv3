<template>
    <el-row>
        <el-button type="primary" @click="showCreateForm">Create My Client </el-button>
    </el-row>
    <el-table :data="tableData.arr" style="width: 100%">
        <el-table-column prop="firsttname" label="First Name" width="120" />
        <el-table-column prop="niddlename" label="Middle Name" width="120" />
        <el-table-column prop="lastname" label="Last Name" width="120" />
        <el-table-column prop="gender" label="Gender" width="120" />
        <el-table-column prop="birthday" label="Birthday" width="120" />
        <el-table-column prop="client_id_no" label="Client No ID" width="120" />
        <el-table-column>
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope)">Detail & Edit Name</el-button>
            </template>
        </el-table-column>
    </el-table>
    <CreateClientnDialog :dialogShow="dialogShow" @dialogClosed="dialogClosed"/>
    <UpdateClientDialog :dialogShow="editDialogShow" :editdata ="editdata" @editDialogClosed="editDialogClosed"/>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import CreateClientnDialog from '@/components/Client/CreateClientDialog.vue';
import UpdateClientDialog from '@/components/Client/UpdateClientDialog.vue';
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

    let par = {
        "user_id":localStorage.getItem('userid')
    }
    service.get('http://localhost:8080/findclientsbyuserid',
            par,
            headers)
    //     .then(response=> {
    //     tableData.arr=response.data;
    //     console.log(tableData.arr);
    // })
}
</script>
