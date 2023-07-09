<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, watchEffect, onMounted} from "vue";
import SelectClientDialog from "@/components/Client/SelectClientDialog.vue";
import SelectOrganisationDialog from "@/components/Organisation/SelectOrganisationDialog.vue";
import {FormInstance, FormRules} from "element-plus";
import service from "@/webservice";
//import UpdateEventDialog from "@/components/Event/UpdateEventDialog.vue";

let props = defineProps({
    createDialogShow: {
        type: Boolean,
        default: false,
    },
    defaultDate: {
        type: String
    },
});
const refProps = toRefs(props)
let dialogVisible = ref(props.createDialogShow);
let selectedDate = ref(props.defaultDate);
let selectedEndDate = ref(props.defaultDate);
let selectClientDialogShow = ref(false);
let selectOrgDialogShow = ref(false);
let endtimeDisable = ref(true)
watch(refProps.createDialogShow, (val, old) => {
    dialogVisible.value = val
}, {deep: true})//监听修改本地
watch(refProps.defaultDate, (val, old) => {
    selectedDate.value = val,
    selectedEndDate.value = val
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
    eventdate:selectedDate,
    eventEndDate:selectedEndDate,
    sameDayEvent:true,
    startTimeStr : undefined,
    endTimeStr: undefined,
    reportStatus: 0,
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
    eventdate: [
        {required: true, message: 'Please choose Activity date', trigger: 'blur'}
    ],
    eventEndDate: [
        {required: true, message: 'Please choose Activity date', trigger: 'blur'}
    ],
    startTimeStr: [
        {required: true, message: 'Please choose Activity start time', trigger: 'blur'}
    ],
    endTimeStr: [
        {required: true, message: 'Please choose Activity end time', trigger: 'blur'}
    ],

})
const openClientSelectionForm = () => {
    console.log(selectClientDialogShow.value);
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
    selectOrgDialogShow.value = false;
}
const headers= {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}
const getStartDisableDate =(date)=>{
    if(!form.sameDayEvent){
        return date>new Date(form.eventEndDate);
    }
}
const getEndDisableDate =(date)=>{
    if(!form.sameDayEvent){
        return date < new Date(form.eventdate);
    }
}
const startDateChange =()=>{
    if(form.sameDayEvent) {
        form.eventEndDate = form.eventdate
        console.log(form.eventEndDate);
    }else{
        if(new Date(form.eventEndDate)< new Date(form.eventdate)){
            form.eventEndDate = form.eventdate
        }
    }
}
const sameDayEventChange=()=>{
    if(form.sameDayEvent){
        form.eventEndDate = form.eventdate
        if(form.endTimeStr<form.startTimeStr){
            form.endTimeStr = null;
        }
    }
}
const getMaxEndTime =()=>{
    if(form.sameDayEvent || (form.eventEndDate == form.eventdate)){
        return form.endTimeStr;
    }
}
const getMinStartTime =()=>{
    if(form.sameDayEvent|| (form.eventEndDate == form.eventdate)){
        return form.startTimeStr;
    }
}
const formSubmit = async (formEl: FormInstance | undefined)=> {
    console.log("submit: "+formEl);
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        console.log("valid: "+valid);
        console.log("fields: "+fields);
        if (valid) {
            let event = {
                eventcmt: form.eventcmt,
                client_id: form.client_id,
                org_id: form.org_id,
                createby:localStorage.getItem('userid'),
                assigned_to: localStorage.getItem('userid'),
                eventdate:form.eventdate,
                eventEndDate:form.eventEndDate,
                startTimeStr:form.startTimeStr + ":00",
                endTimeStr:form.endTimeStr + ":00",
                reportStatus:form.reportStatus,
                created_user_id: localStorage.getItem('userid')
            };
            service.post('http://localhost:8080/createevent',
                event,
                headers).then(response => {
                console.log(response.data);
                dialogVisible.value = false;
                form.eventcmt = undefined;
                form.client_id = undefined;
                form.client_first_name = undefined;
                form.client_middle_name = undefined;
                form.client_last_name = undefined;
                form.client_id_no = undefined;
                form.client_show_value = undefined;
                form.startTimeStr = undefined;
                form.endTimeStr = undefined;
                form.sameDayEvent = true;
                form.org_id = undefined;
                form.org_code = undefined;
                form.org_name = undefined;
                form.org_show_value = undefined;
                emit('dialogClosed');
            })
        }
    })

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
            <el-form-item label="Start Date" :label-width="formLabelWidth" prop="eventdate">
                <el-date-picker v-model="form.eventdate" type="date" value-format="YYYY-MM-DD" autocomplete="off" :clearable="false" :disabled-date="getStartDisableDate" @change="startDateChange()" />
            </el-form-item>
            <el-form-item label="End Date" :label-width="formLabelWidth" prop="eventEndDate">
                <el-col :span="8">
                    <el-date-picker v-model="form.eventEndDate" type="date" value-format="YYYY-MM-DD" autocomplete="off" :clearable="false" :disabled-date="getEndDisableDate" :disabled="form.sameDayEvent"/>
                </el-col>
                <el-col :span="5">
                    <el-checkbox v-model="form.sameDayEvent" label="Same as Start Date" @change="sameDayEventChange"/>
                </el-col>
            </el-form-item>
            <el-form-item label="Start Time" :label-width="formLabelWidth" prop="startTimeStr">
                <el-time-select v-model="form.startTimeStr" :max-time="getMaxEndTime()" start="00:00" step="00:30" end="23:30" autocomplete="off" onchange="startTimeChange()"/>
            </el-form-item>
            <el-form-item label="End Time" :label-width="formLabelWidth" prop="endTimeStr">
                <el-time-select v-model="form.endTimeStr" :min-time="getMinStartTime()" start="00:00"  step="00:30" end="23:30" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="Ready for Report" prop="reportStatus">
                <el-switch v-model="form.reportStatus" inactive-value="0" active-value="1"/>
            </el-form-item>

        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Cancel</el-button>
        <el-button type="primary" @click="formSubmit(ruleFormRef)">
          Create
        </el-button>
      </span>
        </template>
    </el-dialog>
    <SelectClientDialog :selectClientDialogShow="selectClientDialogShow" @selectClientClosed="selectClientClosed" @dialogClosed="dialogClosed"/>
    <SelectOrganisationDialog :selectOrgDialogShow="selectOrgDialogShow" @selectOrganisationClosed="selectOrganisationClosed" @dialogClosed="dialogClosed"/>
</template>

<style scoped>

</style>