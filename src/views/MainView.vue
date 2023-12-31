
<script setup lang="ts">
import {markRaw, reactive, ref, shallowRef} from 'vue'
import SideMenu from "@/components/SideMenu.vue";
import GPCalendar from "@/components/GPCalendar.vue";
import OrganizationTable from "@/components/Organisation/OrganisationTable.vue";
import ClientTable from "@/components/Client/ClientTable.vue";
import UnderConstruct from "@/components/UnderConstruct.vue";
import UserManagePage from "@/components/User/UserManagePage.vue";
import EventDialog from '@/components/Event/UpdateEventDialog.vue';
import { RouterLink, RouterView } from 'vue-router'
const active_name = shallowRef(GPCalendar);

let list = reactive([
    {
        name:'GPCalendar',component:markRaw(GPCalendar)
    },{
        name:'OrganizationForm',component:markRaw(OrganizationTable)
    }
    ,{
        name:'ClientTable',component:markRaw(ClientTable)
    }
    ,{
        name:'UnderConstruct',component:markRaw(UnderConstruct)
    },
    {
        name:'UserManagePage',component:markRaw(UserManagePage)
    }
])
const active_name_change = (index:any)=>{
    //console.log(index);
    active_name.value=list[index].component
}
function logout() {
    localStorage.setItem('token','');
    localStorage.setItem('userid','');
    localStorage.setItem('username','');
    //router.push('/');
    window.location.href="/"
}

</script>
<template>
    <div id="app">
        <div class="common-layout">
            <el-container>
                <el-header>Header
                    <el-button
                        type="primary"
                        class="loginBtn"
                        @click="logout"
                    >
                        Logout
                    </el-button
                       >
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
        </div>
    </div>
</template>

