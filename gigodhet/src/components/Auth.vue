<template lang="html">
  <div>
    <div class="sentrer_hjemlink">
      Godhetstavanger.no
    </div>
    <div class="sentrer_hjemlink">
      Enten oppgi en "ny" eller tidligere brukt epost-adresse 
      <br>(Gjenbruk av epost gir tilgang til egne påmeldinger etc.) 
    </div>
    <div id="firebaseui-auth-container"></div>
    <div class="sentrer_hjemlink">
      Tilbake til
      <router-link to="/">Godhetstavanger.no</router-link>
      <br><br>Dersom epost-adressen er ekte kan den redde deg ved glemt passord. <br>Det er mulig å dikte opp en falsk epost-adresse men bruk uansett samme epost-adresse innad i samme år / dvs. for samme godhetsuke.
    </div>
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