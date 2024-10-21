import {createRouter, createWebHistory} from 'vue-router'
import homeView from '../homeView.vue'

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:homeView,
        },
    ]
})

export default router