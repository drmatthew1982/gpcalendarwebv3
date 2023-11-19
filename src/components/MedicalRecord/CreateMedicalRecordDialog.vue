<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, getCurrentInstance} from "vue";
import {FormInstance, FormRules} from "element-plus";
import VueDrawingCanvas from "vue-drawing-canvas";
import bgimage from "@/assets/jintaizu.jpg"
let props = defineProps({
    medicalRecordShow: {
        type: Boolean,
        default: false,
    },
});
const instance = getCurrentInstance()
const refProps = toRefs(props)
let dialogVisible = ref(props.medicalRecordShow);
let selectClientDialogShow = ref(false);
let selectOrgDialogShow = ref(false);
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
const ruleFormRef = ref<FormInstance>()
const form = reactive({
    event_id: undefined,
    image:undefined
})
const rules = reactive<FormRules>({});


const dialogClosed = ()=>{
    console.log("dialogClosed in Create Event Dialog");
    selectClientDialogShow.value = false;
    selectOrgDialogShow.value = false;
}


const headers= {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}

const saveRecord = async (formEl: FormInstance | undefined)=> {
    console.log("submit: "+ruleFormRef.value);
    console.log("bodyCanvas: "+ JSON.stringify(instance.refs.bodyCanvas.getAllStrokes()));
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
            <vue-drawing-canvas ref="bodyCanvas"
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
              Save
            </el-button>
            <el-button type="primary" @click="saveRecord(ruleFormRef)">
              Create
            </el-button>
          </span>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>