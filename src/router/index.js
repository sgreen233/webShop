import { createRouter, createWebHistory } from "vue-router";
import homeView from "../views/homeView.vue";
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
          path: "",
          name: "Home",
          component: homeView,
          meta: {
            isLogin: true,
          },
        },
        {
          path: "product",
          name: "Product",
          component: () => import("../views/main/Product.vue"),
          meta: {
            isLogin: true,
          },
        },
        {
          path: "params",
          name: "Params",
          component: () => import("../views/main/Params.vue"),
          meta: {
            isLogin: true,
          },
        },
        {
          path: "ad",
          name: "ADCategory",
          component: () => import("../views/main/ADCategory.vue"),
          meta: {
            isLogin: true,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/trail",
      name: "trail",
      component: () => import("../views/trail.vue"),
    },
  ],
});

export default router;
