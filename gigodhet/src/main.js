import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import 'bootstrap'; //import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
require('firebase/firestore')

// import 'firebase/firestore' // needed?
import {firestorePlugin} from 'vuefire'
// import firebaseui from 'firebaseui';
import router from './router'
import {setters} from './store'
import {config} from './helpers/firebaseConfig'
Vue.use(VueRouter)
Vue.use(firestorePlugin)

firebase.initializeApp(config);

router.beforeEach( (to, from, next) => {

  firebase.auth().onAuthStateChanged((user) => {

    setters.setUser(user || {});

    if(to.path === '/' || user) {
      next();
    } else {
      if (to.path !== '/auth' && to.path !== "/info") {
        next('/auth')
      } else {
        next();
      }
    }
   });

});
Vue.directive('tooltip', function(el, binding){
  $(el).tooltip({
           title: binding.value,
           placement: binding.arg,
           trigger: 'hover'
       })
})

new Vue({
  router,
  created() {
    },
  el: '#app',
  render: h => h(App)
});

export const db = firebase.firestore();