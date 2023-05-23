<script setup lang="ts">
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
//import {emitted} from "@vue/test-utils/dist/emit";
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const emit = defineEmits(['valuechange'])
const click = (value: any) => {
    emit('valuechange',value);
}
</script>

<template>
    <el-row class="tac">
        <el-col :span="24">
            <h5 class="mb-2">Default colors</h5>
            <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
            >
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><OfficeBuilding /></el-icon>
                        <span>Organization</span>
                    </template>
                        <el-menu-item index="1-1" @click="click(1)">orgnization info</el-menu-item>
                        <el-menu-item index="1-2" @click="click(1)">Users</el-menu-item>
                    </el-sub-menu>
                <el-menu-item index="2" @click="click(0)">
                    <el-icon><Calendar /></el-icon>
                    <span>My Calendar</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon><User /></el-icon>
                    <span>My Client</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>

