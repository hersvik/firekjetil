<template lang="html">
  <div>
    <div class="sentrer_hjemlink">
      Tilbake til
      <router-link to="/">Godhetstavanger.no</router-link>
    </div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>
<script>
import firebase from 'firebase';
import * as firebaseui from "firebaseui";
import "../../node_modules/firebaseui/dist/firebaseui.css"

// import {config} from '../helpers/firebaseConfig';
export default {
  name: 'auth',
  mounted() {
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ]
      };
    let ui;
    if(firebaseui.auth.AuthUI.getInstance()) {
      ui = firebaseui.auth.AuthUI.getInstance();
    }
    else {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    ui.start('#firebaseui-auth-container', uiConfig);
    },
}
</script>
<style scoped>
  .sentrer_hjemlink {
    text-align: center;
    width: 100%;
    margin-top: 2em;
  }
</style>