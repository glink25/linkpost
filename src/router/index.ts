import AppVue from "@/App.vue";
import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/new'
    },
    {
        path: '/new',
        component: AppVue
    },
    {
        path: '/edit',
        component: AppVue
    }
]

export const router = createRouter({ routes, history: createWebHashHistory() })