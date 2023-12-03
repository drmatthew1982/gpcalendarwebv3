<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, watchEffect, onMounted} from "vue";
import SelectClientDialog from "@/components/Client/SelectClientDialog.vue";
import SelectOrganisationDialog from "@/components/Organisation/SelectOrganisationDialog.vue";
import {FormInstance, FormRules} from "element-plus";
import service from "@/webservice";
import moment from 'moment'
import CreateMedicalRecordDialog from "@/components/MedicalRecord/MedicalRecordDialog.vue";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
//import UpdateEventDialog from "@/components/Event/UpdateEventDialog.vue";

let props = defineProps({
    updateDialogShow: {
        type: Boolean,
        default: false,
    },
    editdata: {
        type: Object
    }
});
const refProps = toRefs(props)
let dialogVisible = ref(props.updateDialogShow)
let m_record = ref();
let selectedDate = ref(props.defaultDate)
let selectClientDialogShow = ref(false);
let selectOrgDialogShow = ref(false);
let medicalRecordShow = ref(false);
let endtimeDisable = ref(true)
watch(refProps.updateDialogShow, (val, old) => {
    dialogVisible.value = val
}, {deep: true})//监听修改本地
watch(refProps.editdata, (val, old) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    console.log("DDDDD:"+moment(String(new Date(val.extendedProps.eventdate))).format('yyyy-MM-DD'));
    form.id = val.id,
        //findData(val.id),
    form.eventcmt =  val.extendedProps.eventcmt,
    form.client_id=  val.extendedProps.client_id,
    form.client_first_name = val.extendedProps.firstname,
    form.client_middle_name = val.extendedProps.middlename,
    form.client_last_name = val.extendedProps.lastname,
    form.client_id_no = val.extendedProps.client_id_no,
    form.eventdate = moment(String(new Date(val.extendedProps.eventdate))).format('yyyy-MM-DD'),
    form.eventEndDate = moment(String(new Date(val.extendedProps.eventEndDate))).format('yyyy-MM-DD'),
    form.sameDayEvent = (form.eventdate == form.eventEndDate),
    form.startTimeStr = val.extendedProps.startTimeStr.substring(0,5),
    form.endTimeStr = val.extendedProps.endTimeStr.substring(0,5),
    form.reportStatus = val.extendedProps.reportStatus,
    form.org_id = val.extendedProps.org_id,
    form.org_code = val.extendedProps.org_code,
    form.org_name = val.extendedProps.org_name,
    form.org_show_value = val.extendedProps.org_code + val.extendedProps.org_name;
    if(form.client_middle_name !=null){
        form.client_show_value = form.client_id_no +": "+ form.client_first_name+" "+form.client_middle_name+ " "+form.client_last_name;
    }else{
        form.client_show_value = form.client_id_no +": "+ form.client_first_name+" "+form.client_last_name;
    }
    findData(val.id);

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
    id:undefined,
    eventcmt: undefined,
    client_id: undefined,
    client_first_name:undefined,
    client_middle_name:undefined,
    client_last_name:undefined,
    client_id_no:undefined,
    client_show_value:undefined,
    eventdate:undefined,
    eventEndDate:undefined,
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
    selectClientDialogShow.value = true;
}
const openOrgSelectionForm = () => {
    selectOrgDialogShow.value = true;
}
const  openMedicalRecord= () => {
    medicalRecordShow.value = true;

}
const dialogClosed = ()=>{
    console.log("dialogClosed in Create Event Dialog");
    selectClientDialogShow.value = false;
    selectOrgDialogShow.value = false;
    medicalRecordShow.value = false;
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
        return date<new Date(form.eventdate);
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
const findData = (eventid) => {
    console.log("findData");
    console.log(eventid);
    let par = {
        "event_id":eventid
    }
    service.get('http://localhost:8080/findmedicalrecordbyeventid',
        par,
        headers)
        .then(response => {
            console.log("founddata");
            m_record= response.data[0];

        })
}
const formSubmit = async (formEl: FormInstance | undefined)=> {
    console.log("submit: "+formEl);
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        console.log("valid: "+valid);
        console.log("fields: "+fields);
        if (valid) {
            let event = {
                id: form.id,
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
                modified_user_id: localStorage.getItem('userid')
            };
            service.post('http://localhost:8080/updateevent',
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
    <el-dialog v-model="dialogVisible" title="Update Event" tabindex="-1" :before-close="dialogClose" append-to-body>
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
                <el-col>
                    <el-date-picker v-model="form.eventEndDate" type="date" value-format="YYYY-MM-DD" autocomplete="off" :clearable="false" :disabled-date="getEndDisableDate" :disabled="form.sameDayEvent"/>
                </el-col>
                <el-col>
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
            <el-form-item label="Medical Record" >
                <el-button link type="primary" size="small" @click="openMedicalRecord()">Open Medical Record
                </el-button>
            </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">Cancel</el-button>
        <el-button type="primary" @click="formSubmit(ruleFormRef)">
          Update
        </el-button>
      </span>
        </template>
    </el-dialog>
    <CreateMedicalRecordDialog :medicalRecordShow="medicalRecordShow" :m_record="m_record" @dialogClosed="dialogClosed"/>
    <SelectClientDialog :selectClientDialogShow="selectClientDialogShow" @selectClientClosed="selectClientClosed" @dialogClosed="dialogClosed"/>
    <SelectOrganisationDialog :selectOrgDialogShow="selectOrgDialogShow" @selectOrganisationClosed="selectOrganisationClosed" @dialogClosed="dialogClosed"/>
</template>

<style scoped>

</style>