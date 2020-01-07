import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app' // from "firebase/app" ?
require('firebase/firestore')

// import 'firebase/firestore' // needed?
import {firestorePlugin} from 'vuefire'
// import firebaseui from 'firebaseui';
import router from './router'
import {config} from './helpers/firebaseConfig'
Vue.use(VueRouter)
Vue.use(firestorePlugin)

new Vue({
  router,
  created() {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$router.push('/success')
      } else {
        this.$router.push('/auth')
      }
     });
    },
  el: '#app',
  render: h => h(App)
});

export const db = firebase.firestore();