
<script setup lang="ts">
import { ref,reactive } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import EventDialog from '@/components/Event/UpdateEventDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

const childRef = ref();
const direction ='ttb';
const dialogFormVisible=ref(true);


document.addEventListener('DOMContentLoaded', function() {
    let calendarEl:HTMLElement = document.getElementById('calendar')!;
    console.log(document.getElementById('333'));
    const calendar = new Calendar(calendarEl, {
        plugins: [ dayGridPlugin,timeGridPlugin,interactionPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },
        editable: true,
        eventClick: function(info) {
            console.log(document.getElementById('333'));
            dialogFormVisible=ref(true);
            console.log(dialogFormVisible);
        },
        events:[
            {id:'111', title: 'event 1', start: '2023-05-04T10:00:00',end:'2023-05-04T12:00:00'},
            {id:'222', title: 'event 2', start: '2023-05-04T11:00:00',end:'2023-05-04T12:30:00'},
            {id:'333', title: 'event 3', start: '2023-05-04T11:00:00',end:'2023-05-04T12:30:00',assign:'matthew',editable:false,backgroundColor:'#555555'}
        ]
    });
    calendar.render();
});

</script>
<template>
    <div>
        <div id="calendar">

        </div>
        <el-drawer v-model="dialogFormVisible" direction="ttb">
            <template #header>
                <h4>set title by slot</h4>
            </template>
            <template #default>
                <div>
                    <el-radio v-model="radio1" label="Option 1" size="large"
                    >Option 1</el-radio
                    >
                    <el-radio v-model="radio1" label="Option 2" size="large"
                    >Option 2</el-radio
                    >
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">cancel</el-button>
                    <el-button type="primary" @click="confirmClick">confirm</el-button>
                </div>
            </template>
        </el-drawer>
<!--        <EventDialog :dialogForm="dialogFormVisible"/>-->
    </div>
</template>


<style scoped>

</style>