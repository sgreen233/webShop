import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "/face",
          name: "Face",
          component: () => import("../views/Faceview.vue"),
        },
        {
          path:"/meetting",
          name:"Meetting",
          component:()=>import("../views/Meetting.vue")
        },
      ],
    },
  ],
});

export default router;
