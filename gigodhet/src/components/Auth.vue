<template lang="html">
  <div>
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
    // debugger
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
    let ui;
    if(firebaseui.auth.AuthUI.getInstance()) {
      ui = firebaseui.auth.AuthUI.getInstance();
    }
    else {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    // debugger
    ui.start('#firebaseui-auth-container', uiConfig);
    },
}
</script>