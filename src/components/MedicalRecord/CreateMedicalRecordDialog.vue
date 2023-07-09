<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, watchEffect, onMounted} from "vue";
import SelectClientDialog from "@/components/Client/SelectClientDialog.vue";
import SelectOrganisationDialog from "@/components/Organisation/SelectOrganisationDialog.vue";
import {FormInstance, FormRules} from "element-plus";
import service from "@/webservice";
import VueDrawingCanvas from "vue-drawing-canvas";
//import UpdateEventDialog from "@/components/Event/UpdateEventDialog.vue";
import bgimage from "@/assets/jintaizu.jpg"
let props = defineProps({
    medicalRecordShow: {
        type: Boolean,
        default: false,
    },
});
const refProps = toRefs(props)
let dialogVisible = ref(props.medicalRecordShow);
let selectedDate = ref(props.defaultDate);
let selectedEndDate = ref(props.defaultDate);
let selectClientDialogShow = ref(false);
let selectOrgDialogShow = ref(false);
let endtimeDisable = ref(true)
watch(refProps.medicalRecordShow, (val, old) => {
    dialogVisible.value = val
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
    event_id: undefined,
    image:undefined
})
const rules = reactive<FormRules>({

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
            // service.post('http://localhost:8080/createevent',
            //     event,
            //     headers).then(response => {
            //     console.log(response.data);
            //     dialogVisible.value = false;
            //
            //     emit('dialogClosed');
            // })
        }
    })

}
//https://codesandbox.io/s/vue-3-drawing-canvas-demo-ihmmz?file=/src/App.vue
//https://github.com/razztyfication/vue-drawing-canvas#installation
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Medical Record" tabindex="-1" :before-close="dialogClose" append-to-body>
        <el-form ref="ruleFormRef" :model="form" :rules="rules">
            <vue-drawing-canvas ref="VueCanvasDrawing"
                                v-model:image="form.image"
                                :width="600"
                                :height="400"
                                :styles="{
                                  border: 'solid 1px #000',
                                }"
                                :background-image="bgimage"
                                :lock="disabled"/>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogClose">Cancel</el-button>
            <el-button type="primary" @click="saveRecord(ruleFormRef)">
              Create
            </el-button>
          </span>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>