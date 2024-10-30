<template>
    <div>
        <FullCalendar  :options="calendarOptions" ref="calendar" class="full-calendar"></FullCalendar >
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';

const handleEventClick = (info) => {
    info.event.remove();
};

const addEvent = () => {
    const newEvent = {
        resourceId: 'r1',
        start: '2024-10-30T14:00:00',
        end: '2024-10-30T17:00:00',
        title: 'New Event'
    };
    calendarOptions.value.events.push(newEvent);
    console.log("添加完毕");
};

const calendarOptions = ref({
    plugins: [dayGridPlugin, resourceTimelinePlugin, interactionPlugin],
    initialView: 'resourceTimeline',
    handleWindowResize: true,
    schedulerLicenseKey:'GPL-My-Project-Is-Open-Source',
    customButtons: {
            myCustomButton: {
                text: '预订会议',
                click: addEvent,
            }
        },
    headerToolbar: {
        right: 'prev,next today',
        center: 'title',
        left:   'myCustomButton',
    },
    resources: [
        { id: 'r1', title: 'Resource One' },
        { id: 'r2', title: 'Resource Two' }
    ],
    events: [
    ],
    editable: true,
    eventClick: handleEventClick,
    // eventDrop: handleEventDrop,
    // eventChange: handleEventChange,
});


onMounted(() => {
});
</script>

<style>
.full-calendar {
    max-width: 500px;
    margin: auto;
    height: 600px;
}
@media screen and (max-width: 768px) {
    .full-calendar {
        height: auto; /* 对于小屏幕，允许高度自动调整 */
    }
}
</style>