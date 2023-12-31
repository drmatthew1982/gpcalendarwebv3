<template>
    <el-row>
        <el-button type="primary" @click="showCreateForm">Create My Client </el-button>
    </el-row>
    <el-table :data="tableData.arr" style="width: 100%">
        <el-table-column prop="firstname" label="First Name" width="120" />
        <el-table-column prop="middlename" label="Middle Name" width="120" />
        <el-table-column prop="lastname" label="Last Name" width="120" />
        <el-table-column prop="gender" label="Gender"  :formatter="genderformatter" width="120" />
        <el-table-column prop="birthday" label="Birthday" :formatter="dataformatter" width="120" />
        <el-table-column prop="client_id_no" label="Client No ID" width="120" />
        <el-table-column>
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope)">Detail & Edit Client</el-button>
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
import {formatDate} from "@fullcalendar/core";
onMounted(()=> {
//setup 是围绕beforeCreate和created生命周期钩子运行的，不需要显式地定义它们。在这些钩子中编写的任何代码都应该直接在 setup 函数中编写。
//生命周期基本都被重命名 首字母大写后加上on前缀  例如beforeUpdate => onBeforeUpdate
    findData();
})
const dataformatter = (row, column, cellValue, index)=>{
    let format = 'YYYY-mm-dd'
    let date = new Date(cellValue);
    const dataItem = {
        'Y+': date.getFullYear().toString(),
        'm+': (date.getMonth() + 1).toString(),
        'd+': date.getDate().toString(),
        'H+': date.getHours().toString(),
        'M+': date.getMinutes().toString(),
        'S+': date.getSeconds().toString(),
    };
    Object.keys(dataItem).forEach((item) => {
        const ret = new RegExp(`(${item})`).exec(format);
        if (ret) {
            format = format.replace(ret[1], ret[1].length === 1 ? dataItem[item] : dataItem[item].padStart(ret[1].length, '0'));
        }
    });
    return format
}
const genderformatter = (row, column, cellValue, index)=>{
    if(cellValue==0){
        return 'Not selected';
    }
    if(cellValue==1) {
        return 'Male';
    }
    if(cellValue==2){
        return 'Female';
    }
    if(cellValue==3){
        return 'Other';
    }
}

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
        .then(response=> {
        tableData.arr=response.data;
    })
}
</script>
