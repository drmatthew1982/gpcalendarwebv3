
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
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import service from "@/webservice";


let updateDialogShow = ref(false);
let createDialogShow = ref(false);
let defaultDate = ref();
let calendar= ref(Calendar);
let editdata = ref();
// calendar.addEventListener('prev', function() {
//     console.log("prev click");
// });

let events=[];
document.addEventListener('DOMContentLoaded', function() {
    let calendarEl:HTMLElement = document.getElementById('calendar')!;
    //console.log(document.getElementById('333'));
    //let
        calendar = new Calendar(calendarEl, {
        plugins: [ dayGridPlugin,timeGridPlugin,interactionPlugin ],
        //timeZone: 'Pacific/Auckland',
        initialView: 'dayGridMonth',
        customButtons: {
            prev: {
                click: function() {
                    calendar.prev();
                    findEvent(calendar.view.currentEnd.toISOString(),calendar);
                }
            },
            next: {
                click: function() {
                    calendar.next();
                    findEvent(calendar.view.currentEnd.toISOString(),calendar);
                }
            },
            today: {
                text: 'Today',
                click: function() {
                    calendar.today();
                    findEvent(calendar.view.currentEnd.toISOString(),calendar);
                }
            }
        },
        headerToolbar: {
            left: 'prev,next,today',
            center: 'title',
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        editable: true,
        dateClick: function(info) {
            //alert('clicked ' + info.dateStr);
            console.log(createDialogShow.value);
            createDialogShow.value=true;
            defaultDate.value=info.dateStr;

        },
        eventClick: function(info) {
            console.log(info.event);
            updateDialogShow.value=true;
            editdata=info.event;
            //emit('eventClick',info.event.id);
        },

        // events:
        //     [
        //     {id:'111', title: 'event 1', start: '2023-06-04T10:00:00',end:'2023-06-04T12:00:00'},
        //     {id:'222', title: 'event 2', start: '2023-06-04T11:00:00',end:'2023-06-04T12:30:00'},
        //     {id:'333', title: 'event 3', start: '2023-06-04T11:00:00',end:'2023-06-04T12:30:00',assign:'matthew',editable:false,backgroundColor:'#555555'}
        // ]
    });

    console.log(calendar.view.currentStart);
    calendar.addEventSource(events);
    findEvent(calendar.view.currentEnd.toISOString(),calendar);
    calendar.render();
    console.log(calendar.getEvents());
});
const dialogClosed = ()=>{
    console.log("dialogClosed");
    updateDialogShow.value = false;
    createDialogShow.value = false;
    findEvent(calendar.view.currentEnd.toISOString(),calendar);
}
const headers = {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
}
const findEvent = (current_date,calendar) => {
    console.log(current_date);
    let par = {
        "user_id": localStorage.getItem('userid'),
        "current_date":current_date.split('T')[0]
    }
    service.get('http://localhost:8080/findeventsbyuserid',
        par,
        headers)
        .then(response => {
            //console.log(response.data);
            events = response.data;
            calendar.removeAllEvents();
            // events.forEach(function(value,index,array){
            //     calendar.addEvent(value);
            // })
            calendar.addEventSource(events);
            console.log(events);
            console.log(calendar.getEvents());

        })
}

</script>
<template>
    <div>
        <div id="calendar">

        </div>
        <CreateEventDialog :createDialogShow="createDialogShow" :defaultDate="defaultDate" @dialogClosed="dialogClosed"/>
        <UpdateEventDialog :updateDialogShow="updateDialogShow" :editdata ="editdata" @dialogClosed="dialogClosed"/>
    </div>
</template>


<style scoped>

</style>