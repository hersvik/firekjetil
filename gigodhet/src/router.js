import VueRouter from 'vue-router';
import Auth from './components/Auth.vue';
// import AuthSuccess from './components/AuthSuccess.vue';
import Registrering from './components/Registrering.vue';
import Overview from './components/Overview.vue';
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Overview },
    { path: '/auth', component: Auth },
    { path: '/registrering', component: Registrering },
    {
        path: "/registrering/:id",
        name: "endreRegistrering",
        props: true,
        component: () => import("./components/Registrering.vue")
    },
  ]
});
export default router;