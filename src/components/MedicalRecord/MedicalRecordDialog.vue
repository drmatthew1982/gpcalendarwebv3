<script setup lang="ts">
import {reactive, ref, toRefs, watch, defineProps, getCurrentInstance, onMounted} from "vue";
import {FormInstance, FormRules} from "element-plus";
import VueDrawingCanvas from "vue-drawing-canvas";
import bgimage from "@/assets/jintaizu.jpg"
import service from "@/webservice";

onMounted(() => {
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
let eraser = ref(false);
let color=ref("#000000");
let strokeType=ref("dash");
let lock=ref(false);
let lineWidth=ref(5);
let clickType=ref("cross");
const strokeTypeOptions = ref([
    {label:"Free",
    value:"dash"},
    {label:"Straight Line",
    value:"line"},
    {label:"Circle",
     value:"circle"},
    {label:"Square",
     value:"square"},
    {label:"Triangle",
     value:"triangle"},
    {label:"Half triangle",
     value:"half_triangle"}
    ]);
const clickOptions = ref([
    {label:"Cross",
        value:"cross"},
    {label:"Circle",
        value:"circle"}
]);
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

const canvasClick = () => {
    let canvas = instance.refs.bodyCanvas;
    if(lock.value){
         let returnCoordinates = canvas.getCoordinates(event);
         let init_x= returnCoordinates.x;
         let init_y= returnCoordinates.y;

        if(clickType.value=="cross"){
            let coordinates= [
                {"x":init_x+1,"y":init_y+1},
                {"x":init_x+2,"y":init_y+2},
                {"x":init_x+3,"y":init_y+3},
                {"x":init_x+4,"y":init_y+4},
                {"x":init_x+5,"y":init_y+5},
                {"x":init_x-1,"y":init_y-1},
                {"x":init_x-2,"y":init_y-2},
                {"x":init_x-3,"y":init_y-3},
                {"x":init_x-4,"y":init_y-4},
                {"x":init_x-5,"y":init_y-5},
                {"x":init_x+1,"y":init_y-1},
                {"x":init_x+2,"y":init_y-2},
                {"x":init_x+3,"y":init_y-3},
                {"x":init_x+4,"y":init_y-4},
                {"x":init_x+5,"y":init_y-5},
                {"x":init_x-1,"y":init_y+1},
                {"x":init_x-2,"y":init_y+2},
                {"x":init_x-3,"y":init_y+3},
                {"x":init_x-4,"y":init_y+4},
                {"x":init_x-5,"y":init_y+5}
            ]
            let strokes=
                {
                    type: 'dash',
                    from: {
                        x: init_x, y: init_y
                    },
                    coordinates: coordinates,
                    color:color.value,
                    width:lineWidth.value,
                    fill:false
                    //lineCap:"round",
                    //lineJoin:"miter"
                }

            //canvas.drawing=true;
            canvas.drawShape(canvas.context,strokes,false);
            canvas.images.push(strokes);
            canvas.redraw(true);
            canvas.save();
         }
        if(clickType.value=="circle"){
            //Put certen point
            let coordinates=[{"x":init_x,"y":init_y}];
            let strokes=
                {
                    type: 'dash',
                    from: {
                        x: init_x, y: init_y
                    },
                    coordinates: coordinates,
                    color:color.value,
                    width:lineWidth.value,
                    fill:false
                    //lineCap:"round",
                    //lineJoin:"miter"
                }

            canvas.drawShape(canvas.context,strokes,false);
            canvas.images.push(strokes);
            canvas.redraw(true);
            canvas.save();

            let circleCoordinates = [{}];
            let cricleFrom={};
            let r = 10;
            for(let i=0;i<360;i++){
                let point_x = init_x + r * Math.cos(i  *  3.14/180   )
                let point_y = init_y + r * Math.sin(i  *  3.14/180   )
                if(i==0){
                    canvas.context.moveTo(point_x, point_y);
                    cricleFrom={x:point_x,y:point_y}
                }else{
                    circleCoordinates.push( {"x":point_x,"y":point_y})
                }
            }
            let circleStrokes=
                {
                    type: 'dash',
                    from: cricleFrom,
                    coordinates: circleCoordinates,
                    color:color.value,
                    width:lineWidth.value,
                    fill:false
                    //lineCap:"round",
                    //lineJoin:"miter"
                }
            canvas.drawShape(canvas.context,circleStrokes,false);
            canvas.images.push(circleStrokes);
            canvas.redraw(true);
            canvas.save();
            //canvas.drawing=true;

        }

    }
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
                id: record_id,
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
                            rows="20"
                            resize="none"
                            display="flex"
                            flex=1
                    />
                </el-col>
                <el-col :span="10">
                    <el-text>Image</el-text>
                    <vue-drawing-canvas ref="bodyCanvas"
                                        v-model:image="form.image"
                                        :width="380"
                                        :height="380"
                                        :styles="{
                                              border: 'solid 1px #000',
                                            }"
                                        :initialImage="initialImage"
                                        :background-image="bgimage"
                                        :eraser="eraser"
                                        :color="color"
                                        :strokeType="strokeType"
                                        :lock = "lock"
                                        :lineWidth="lineWidth"
                                        @click=canvasClick(event)
                                        />
                    <!--:lock="disabled"-->
                    <el-switch v-model="eraser"
                               active-text="Eraser"
                               inactive-text="Draw"
                               style="--el-switch-off-color: #13ce66; --el-switch-on-color: #ff4949"
                    />
                    <el-text class="mx-1">  |  Color:</el-text>
                    <el-color-picker v-model="color" />
                    <br/>
                    <el-text class="mx-1">Line width:</el-text>
                    <select v-model="lineWidth">
                        <option v-for="n in 25" :key="'option-' + n" :value="n">{{ n }}</option>
                    </select>
                    <br/>
                    <el-text>Line Style: </el-text>
                    <el-select-v2
                        v-model="strokeType"
                        :options="strokeTypeOptions"
                        placeholder="Please select"
                        style="width: 150px"
                        size="small"
                    />
                    <br/>
                    <el-text>Mode Selection: </el-text>
                    <el-switch v-model="lock"
                               active-text="Click Mode"
                               inactive-text="Draw Mode"
                    />
                    <br/>
                    <el-text>Click Mode: </el-text>
                    <el-select-v2
                        v-model="clickType"
                        :options="clickOptions"
                        placeholder="Please select"
                        style="width: 150px"
                        size="small"
                    />
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