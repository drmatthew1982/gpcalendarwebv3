<script setup lang="ts">
//import TheWelcome from '../components/TheWelcome.vue'
import SideMenu from "@/components/SideMenu.vue";
import {markRaw, reactive, shallowRef} from "vue";
import GPCalendar from "@/components/GPCalendar.vue";
import OrganizationForm from "@/components/OrganizationForm.vue";
const active_name = shallowRef(GPCalendar);
let list = reactive([
    {
        name:'GPCalendar',component:markRaw(GPCalendar)
    },{
        name:'OrganizationForm',component:markRaw(OrganizationForm)
    }
])
const active_name_change = (index:any)=>{
    console.log(index);
    active_name.value=list[index].component
}
</script>

<template>
    <el-aside width="200px">
        <SideMenu @valuechange="active_name_change"/>
    </el-aside>
    <el-main>
        <keep-alive>
            <component :is="active_name" ></component>
        </keep-alive>
    </el-main>
</template>
