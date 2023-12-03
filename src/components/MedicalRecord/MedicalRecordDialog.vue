<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, getCurrentInstance} from "vue";
import {FormInstance, FormRules} from "element-plus";
import VueDrawingCanvas from "vue-drawing-canvas";
import bgimage from "@/assets/jintaizu.jpg"
import service from "@/webservice";
let props = defineProps({
    medicalRecordShow: {
        type: Boolean,
        default: false,
    },
    parenteventid: {
        type: String
    },
});
const instance = getCurrentInstance()
const refProps = toRefs(props)
let dialogVisible = ref(props.medicalRecordShow);
let eventid = ref(props.parenteventid);
watch(refProps.medicalRecordShow, (val, old) => {
    dialogVisible.value = val
}, {deep: true})//监听修改本地
watch(refProps.parenteventid, (val, old) => {
    eventid.value = val
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
    summary: undefined,
    image: undefined
})
const rules = reactive<FormRules>({});

const headers = {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}

const saveRecord = async (formEl: FormInstance | undefined) => {
    console.log("submit: " + ruleFormRef.value);
    console.log("bodyCanvas: " + JSON.stringify(instance.refs.bodyCanvas.getAllStrokes()));
    console.log("eventid: " + eventid);
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        console.log("valid: " + valid);
        console.log("fields: " + fields);
        if (valid) {
            let medicalRecorde = {
                eventid: eventid,
                summary: form.summary,
                positions: JSON.stringify(instance.refs.bodyCanvas.getAllStrokes()),
                created_user_id: localStorage.getItem('userid')
            };
            service.post('http://localhost:8080/createmedicalrecord',
                medicalRecorde,
                headers).then(response => {
                console.log(response.data);
                dialogVisible.value = false;

                emit('dialogClosed');
            })
        }
    })

}
//https://codesandbox.io/s/vue-3-drawing-canvas-demo-ihmmz?file=/src/App.vue
//https://github.com/razztyfication/vue-drawing-canvas#installation
</script>

<template>
    <el-dialog v-model="dialogVisible" title="Medical Record" tabindex="-1" :before-close="dialogClose"
               display="flex" flex-direction="column">

        <el-form ref="ruleFormRef" :model="form" :rules="rules">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-text>Summary</el-text>
                    <el-input
                            v-model="form.summary"
                            type="textarea"
                            placeholder="Please input"
                            rows="18"
                            resize="none"
                            display="flex"
                            flex = 1
                    />
                </el-col>
                <el-col :span="10">
                    <el-text>Image</el-text>
                    <vue-drawing-canvas ref="bodyCanvas"
                                        v-model:image="form.image"
                                        :width="400"
                                        :height="400"
                                        :styles="{
                                  border: 'solid 1px #000',
                                }"
                                        :background-image="bgimage"/>
                    <!--:lock="disabled"-->
                </el-col>
            </el-row>
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