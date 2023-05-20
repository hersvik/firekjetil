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
        component: () => import('./components/ListRegistreringer.vue'),
        meta: {noScroll: true}
    },
    {
        path: "/countregs",
        component: () => import('./components/CountRegistreringer.vue'),
        meta: {noScroll: true}
    },
    {
        path: "/regs/all",
        props: {includeHasTeam: true},
        component: () => import("./components/ListRegistreringer.vue"),
        meta: {noScroll: true}
    },
    {
        path: "/teams",
        component: () => import('./components/TeamsChronologically.vue')
    },
    {
        path: "/dash",
        component: () => import('./components/TeamDashboard.vue')
    },
    {
        path: "/dash/:teamid",
        name: "dashTeamid",
        props: true,
        component: () => import('./components/TeamDashboard.vue')
    },
    {
        path: "/teamreg",
        component: () => import('./components/TeamNavn.vue')
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
        path: "/registrering/agent/:agent",
        // name: "registrerHosAgent",
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
        props: {statuses: "all"},
        component: () => import("./components/ListWishes.vue"),
        meta: {noScroll: true}
    },
    {
        path: "/wishes/assigned",
        props: {statuses: "assigned"},
        component: () => import("./components/ListWishes.vue"),
        meta: {noScroll: true}
    },
    {
        path: "/wishes/unassigned",
        props: {statuses: "unassigned"},
        component: () => import("./components/ListWishes.vue"),
        meta: {noScroll: true}
    },
    {
        path: "/wishes/discarded",
        props: {statuses: "discarded"},
        component: () => import("./components/ListWishes.vue"),
        meta: {noScroll: true}
    },
  ],
  scrollBehavior(to, /*from, savedPosition*/) {
    if(to.meta.noScroll)
        return;
    else
        return {x: 0, y: 0}
  }
});
export default router;