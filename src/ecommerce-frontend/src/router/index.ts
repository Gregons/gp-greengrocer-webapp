import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/item/:id",
    name: "item",
    component: () =>
      import(/* webpackChunkName: "item" */ "../views/ItemView.vue"),
    props: true,
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/RegisterView.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () =>
      import(/* webpackChunkName: "cart" */ "../views/CartView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue"),
  },
  {
    path: "/purchases",
    name: "purchases",
    component: () =>
      import(
        /* webpackChunkName: "purchases" */ "../views/PurchaseHistoryView.vue"
      ),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/review-and-pay",
    name: "review-and-pay",
    component: () =>
      import(
        /* webpackChunkName: "review-and-pay" */ "../views/ReviewAndPayView.vue"
      ),
  },
  {
    path: "/final-checkout",
    name: "final-checkout",
    component: () =>
      import(
        /* webpackChunkName: "final-checkout" */ "../views/FinalCheckoutView.vue"
      ),
  },
  {
    path: "/successful-checkout",
    name: "successful-checkout",
    component: () =>
      import(
        /* webpackChunkName: "successful-checkout" */ "../views/SuccessfulCheckoutView.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
