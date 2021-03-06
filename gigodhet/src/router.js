import VueRouter from 'vue-router';
import Auth from './components/Auth.vue';
// import AuthSuccess from './components/AuthSuccess.vue';
import Registrering from './components/Registrering.vue';

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
        path: "/",
        component: () => import('./components/Hjem.vue')
    },
    {
        path: "/regs",
        component: () => import('./components/ListRegistreringer.vue')
    },
    {
        path: "/cycle", // easter-egg app
        component: () => import('./components/CycleApp.vue')
    },
    {
        path: "/spendings", // easter-egg app
        component: () => import('./components/SpendingsApp.vue')
    },
    {
        path: "/chat", // easter-egg app
        component: () => import('./components/ChatApp.vue')
    },
    { path: '/auth', component: Auth },
    { path: '/registrering', component: Registrering },
    {
        path: "/registrering/:id",
        name: "endreRegistrering",
        props: true,
        component: () => import("./components/Registrering.vue")
    },
    {
        path: "/wish",
        component: () => import("./components/Wish.vue")
    },
    {
        path: "/wish/:id",
        name: "endreWish",
        props: true,
        component: () => import("./components/Wish.vue")
    },
    {
        path: "/wishes",
        component: () => import("./components/ListWishes.vue")
    },
  ]
});
export default router;