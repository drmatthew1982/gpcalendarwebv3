
<script setup lang="ts">
import { ref,reactive } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import EventDialog from '@/components/EventDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'


let dialogShow = ref(false);

const dialogClosed = ()=>{
    console.log("dialogClosed");
    dialogShow.value = false;
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
        eventClick: function(info) {
            console.log(dialogShow.value);
            dialogShow.value=true;
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
        <EventDialog :dialogShow="dialogShow" @dialogClosed="dialogClosed"/>
    </div>
</template>


<style scoped>

</style>