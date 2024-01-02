
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
import {getCurrentInstance} from 'vue'


let updateDialogShow = ref(false);
let createDialogShow = ref(false);
let defaultDate = ref();
let calendar= ref(Calendar);
let editdata = ref();
const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const headers = globalProperties.$defaultheaders
// calendar.addEventListener('prev', function() {
//     console.log("prev click");
// });
const eventUpdate = (eventUpdateInfo) =>{
    let newEvent = eventUpdateInfo.event;
    let event = {
        id: newEvent.id,
        eventcmt: newEvent.extendedProps.eventcmt,
        client_id: newEvent.extendedProps.client_id,
        org_id: newEvent.extendedProps.org_id,
        eventdate:newEvent.startStr.split('T')[0],
        eventEndDate:newEvent.endStr.split('T')[0],
        startTimeStr:newEvent.startStr.split('T')[1].split('+')[0],
        endTimeStr:newEvent.endStr.split('T')[1].split('+')[0],
        reportStatus:newEvent.extendedProps.reportStatus,
        modified_user_id: localStorage.getItem('userid')
    };
    service.post('http://'+globalProperties.$serviceurl+'/updateevent',
        event,
        headers)
}
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
            createDialogShow.value=true;
            defaultDate.value=info.dateStr;

        },
        eventClick: function(info) {
            updateDialogShow.value=true;
            editdata=info.event;
            //emit('eventClick',info.event.id);
        },
        eventDrop: function(eventDropInfo) {
            eventUpdate(eventDropInfo);
        },
        eventResize: function(eventResizeInfo) {
            eventUpdate(eventResizeInfo);
         },
        // events:
        //     [
        //     {id:'111', title: 'event 1', start: '2023-06-04T10:00:00',end:'2023-06-04T12:00:00'},
        //     {id:'222', title: 'event 2', start: '2023-06-04T11:00:00',end:'2023-06-04T12:30:00'},
        //     {id:'333', title: 'event 3', start: '2023-06-04T11:00:00',end:'2023-06-04T12:30:00',assign:'matthew',editable:false,backgroundColor:'#555555'}
        // ]
    });

    calendar.addEventSource(events);
    findEvent(calendar.view.currentEnd.toISOString(),calendar);
    calendar.render();
});
const dialogClosed = ()=>{
    updateDialogShow.value = false;
    createDialogShow.value = false;
    findEvent(calendar.view.currentEnd.toISOString(),calendar);
}

const findEvent = (current_date,calendar) => {

    let par = {
        "user_id": localStorage.getItem('userid'),
        "current_date":current_date.split('T')[0]
    }
    service.get('http://'+ globalProperties.$serviceurl+'/findeventsbyuserid',
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