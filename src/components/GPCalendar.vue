
<script setup lang="ts">
import { ref,reactive } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import UpdateEventDialog from '@/components/Event/UpdateEventDialog.vue'
import CreateEventDialog from '@/components/Event/CreateEventDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'


let updateDialogShow = ref(false);
let createDialogShow = ref(false);
let defaultDate = ref();
const dialogClosed = ()=>{
    console.log("dialogClosed");
    updateDialogShow.value = false;
    createDialogShow.value = false;
}

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
        dateClick: function(info) {
            //alert('clicked ' + info.dateStr);
            console.log(createDialogShow.value);
            createDialogShow.value=true;
            defaultDate.value=info.dateStr;
        },
        eventClick: function(info) {
            console.log(updateDialogShow.value);
            updateDialogShow.value=true;
            //emit('eventClick',info.event.id);
        },
        events:[
            {id:'111', title: 'event 1', start: '2023-06-04T10:00:00',end:'2023-06-04T12:00:00'},
            {id:'222', title: 'event 2', start: '2023-06-04T11:00:00',end:'2023-06-04T12:30:00'},
            {id:'333', title: 'event 3', start: '2023-06-04T11:00:00',end:'2023-06-04T12:30:00',assign:'matthew',editable:false,backgroundColor:'#555555'}
        ]
    });
    calendar.render();
});

</script>
<template>
    <div>
        <div id="calendar">

        </div>
        <CreateEventDialog :createDialogShow="createDialogShow" :defaultDate="defaultDate" @dialogClosed="dialogClosed"/>
        <UpdateEventDialog :updateDialogShow="updateDialogShow" @dialogClosed="dialogClosed"/>
    </div>
</template>


<style scoped>

</style>