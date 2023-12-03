<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, getCurrentInstance, onMounted} from "vue";
import {FormInstance, FormRules} from "element-plus";
import VueDrawingCanvas from "vue-drawing-canvas";
import bgimage from "@/assets/jintaizu.jpg"
import service from "@/webservice";
onMounted(()=> {
//setup 是围绕beforeCreate和created生命周期钩子运行的，不需要显式地定义它们。在这些钩子中编写的任何代码都应该直接在 setup 函数中编写。
//生命周期基本都被重命名 首字母大写后加上on前缀  例如beforeUpdate => onBeforeUpdate

})
let props = defineProps({
    medicalRecordShow: {
        type: Boolean,
        default: false,
    },
    m_record: {
        type: Object
    },
});
const instance = getCurrentInstance()
const refProps = toRefs(props)

let dialogVisible = ref(props.medicalRecordShow);
let record_id = ref("")
let initialImage = ref([])
watch(refProps.medicalRecordShow, (val, old) => {
    dialogVisible.value = val
}, {deep: true})//监听修改本地
watch(refProps.m_record, (val, old) => {
    console.log(val)
    record_id = val.id,
    form.summary = val.summary
    initialImage = JSON.parse(val.positions)
}, {deep: true})//监听修改本地
const emit = defineEmits(['dialogClosed'])
const dialogClose = () => {
    //console.log(dialogVisible.value);
    dialogVisible.value = false;
    //console.log(dialogVisible.value);
    //instance.refs.bodyCanvas.reset();
    //initialImage = ref([])
    //instance.refs.bodyCanvas.redraw();
    //instance.proxy.$forceUpdate();

    emit('dialogClosed');
}
const ruleFormRef = ref<FormInstance>()
const form = reactive({
    summary: undefined,
    image: undefined
})
const rules = reactive<FormRules>({});

const headers = {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}
// const findData = () => {
//     console.log("findData");
//     console.log(props.p_event_id);
//     let par = {
//         "eventid":props.p_event_id
//     }
//     service.get('http://localhost:8080/findmedicalrecordbyeventid',
//         par,
//         headers)
//         .then(response => {
//             console.log("founddata");
//             console.log(response.data);
//         })
// }
const saveRecord = async (formEl: FormInstance | undefined) => {
    console.log("submit: " + ruleFormRef.value);
    console.log("bodyCanvas: " + JSON.stringify(instance.refs.bodyCanvas.getAllStrokes()));
    console.log("record: " + record_id);

    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let medicalRecorde = {
                id:record_id,
                summary: form.summary,
                positions: JSON.stringify(instance.refs.bodyCanvas.getAllStrokes()),
                modified_user_id: localStorage.getItem('userid')
            };
            service.post('http://localhost:8080/updatemedicalrecord',
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
                                        :initialImage = "initialImage"
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
          </span>
        </template>

    </el-dialog>
</template>

<style scoped>

</style>