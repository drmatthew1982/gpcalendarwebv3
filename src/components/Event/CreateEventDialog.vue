<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, watchEffect, onMounted} from "vue";
import SelectClientDialog from "@/components/Client/SelectClientDialog.vue";
import SelectOrganisationDialog from "@/components/Organisation/SelectOrganisationDialog.vue";
import {FormInstance, FormRules} from "element-plus";
//import UpdateEventDialog from "@/components/Event/UpdateEventDialog.vue";

let props = defineProps({
    createDialogShow: {
        type: Boolean,
        default: false,
    },
    defaultDate: {
        type: String,
        default: false,
    },
});
const refProps = toRefs(props)
let dialogVisible = ref(props.createDialogShow)
let selectedDate = ref(props.defaultDate)
let selectClientDialogShow = ref(false);
let selectOrgDialogShow = ref(false);
let endtimeDisable = ref(true)
watch(refProps.createDialogShow, (val, old) => {
    dialogVisible.value = val
}, {deep: true})//监听修改本地
watch(refProps.defaultDate, (val, old) => {
    selectedDate.value = val
}, {deep: true})//监听修改本地
const emit = defineEmits(['dialogClosed'])
const dialogClose = () => {
    //console.log(dialogVisible.value);
    dialogVisible.value = false;
    //console.log(dialogVisible.value);
    emit('dialogClosed');
}
const formLabelWidth = '140px'
const ruleFormRef = ref<FormInstance>()
const form = reactive({
    eventcmt: undefined,
    client_id: undefined,
    client_first_name:undefined,
    client_middle_name:undefined,
    client_last_name:undefined,
    client_id_no:undefined,
    client_show_value:undefined,
    date: selectedDate,
    starttime: undefined,
    endtime: undefined,
    reportstatus: 0,
    org_id: undefined,
    org_code: undefined,
    org_name: undefined,
    org_show_value: undefined
})
const rules = reactive<FormRules>({
    eventcmt: [
        {required: true, message: 'Please input Activity event comment', trigger: 'blur'}
    ],
    client_show_value: [
        {required: true, message: 'Please select Activity client', trigger: 'blur'}
    ],
    org_show_value: [
        {required: true, message: 'Please select Activity organisation', trigger: 'blur'}
    ],
    date: [
        {required: true, message: 'Please choose Activity date', trigger: 'blur'}
    ],
    starttime: [
        {required: true, message: 'Please choose Activity start time', trigger: 'blur'}
    ],
    endtime: [
        {required: true, message: 'Please choose Activity end time', trigger: 'blur'}
    ],

})
const openClientSelectionForm = () => {
    selectClientDialogShow.value = true;
}
const openOrgSelectionForm = () => {
    selectOrgDialogShow.value = true;
}
const dialogClosed = ()=>{
    console.log("dialogClosed in Create Event Dialog");
    selectClientDialogShow.value = false;
    selectOrgDialogShow.value = false;
}
const selectClientClosed = (param)=>{
    form.client_id = param.id;
    form.client_first_name = param.firstname;
    form.client_middle_name = param.middlename;
    form.client_last_name = param.lastname;
    form.client_id_no = param.client_id_no;
    if(param.middlename!=null){
        form.client_show_value = param.client_id_no +": "+ param.firstname+" "+param.middlename+ " "+param.lastname;
    }else{
        form.client_show_value = param.client_id_no +": "+ param.firstname+" "+param.lastname;
    }
    selectClientDialogShow.value = false;
}
const selectOrganisationClosed = (param)=> {
    form.org_id = param.id;
    form.org_code = param.org_code;
    form.org_name = param.org_name;
    form.org_show_value = param.org_code+"-"+param.org_name;
}
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Create Event" tabindex="-1" :before-close="dialogClose" append-to-body>
        <el-form ref="ruleFormRef" :model="form" :rules="rules">
            <el-form-item label="Event comment" :label-width="formLabelWidth" prop="eventcmt">
                <el-input v-model="form.eventcmt" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="Select a client" :label-width="formLabelWidth" prop="client_show_value">
                <el-col :span="11">
                    <el-input v-model="form.client_show_value" autocomplete="off" disabled/>
                </el-col>
                <el-col :span="11">
                    <el-button link type="primary" size="small" @click="openClientSelectionForm()">Select a Client
                    </el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="Select a orgnization" :label-width="formLabelWidth" prop="org_show_value">
                <el-col :span="11">
                    <el-input v-model="form.org_show_value" autocomplete="off" disabled/>
                </el-col>
                <el-col :span="11">
                    <el-button link type="primary" size="small" @click="openOrgSelectionForm()">Select a Org
                    </el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="Date" :label-width="formLabelWidth" prop="date">
                <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="Start Time" :label-width="formLabelWidth" prop="starttime">
                <el-time-select v-model="form.starttime" :max-time="form.endtime" start="00:00" step="00:30" end="23:30" autocomplete="off" onchange="startTimeChange()"/>
            </el-form-item>
            <el-form-item label="End Time" :label-width="formLabelWidth" prop="endtime">
                <el-time-select v-model="form.endtime" :min-time="form.starttime" start="00:00"  step="00:30" end="23:30" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="Ready for Report">
                <el-switch v-model="form.reportstatus"/>
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
    <SelectClientDialog :selectClientDialogShow="selectClientDialogShow" @selectClientClosed="selectClientClosed"/>
    <SelectOrganisationDialog :selectOrgDialogShow="selectOrgDialogShow" @selectOrganisationClosed="selectOrganisationClosed"/>
</template>

<style scoped>

</style>