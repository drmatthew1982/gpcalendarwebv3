
<script setup lang="ts">
import {markRaw, reactive, ref, shallowRef} from 'vue'
import SideMenu from "@/components/SideMenu.vue";
import GPCalendar from "@/components/GPCalendar.vue";
import OrganizationForm from "@/components/OrganizationForm.vue";
import EventDialog from '@/components/Event/UpdateEventDialog.vue';
import { RouterLink, RouterView } from 'vue-router'

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
    <div id="app">
        <router-view></router-view>
        <!--<div class="common-layout">
            <el-container>
                <el-header>Header

                </el-header>
                <el-container>
                    <el-aside width="200px">
                        <SideMenu @valuechange="active_name_change"/>
                    </el-aside>
                    <el-main>
                      <keep-alive>
                        <component :is="active_name" ></component>
                      </keep-alive>
                    </el-main>
                </el-container>
            </el-container>
        </div>-->
    </div>
</template>

