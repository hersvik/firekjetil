import VueRouter from 'vue-router';
import Auth from './components/Auth.vue';
// import AuthSuccess from './components/AuthSuccess.vue';
import Registrering from './components/Registrering.vue';
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Registrering },
    { path: '/auth', component: Auth },
  ]
});
export default router;