<template lang="html">
  <div>
    <div class="sentrer_hjemlink">
      Godhetstavanger.no
    </div>
    
    <div id="firebaseui-auth-container"></div>

    <div  class="sentrer_hjemlink">
      Tilbake til
      <router-link to="/">Godhetstavanger.no</router-link>
    </div>

    <div class="jumbotron bg-light rounded-lg" style="border:solid 1px #eee; margin: 1em;">
      <a href="#how_why" id="how_why" @click="showWhy = !showWhy">Hvorfor skal jeg logge inn?</a>
      <div v-if="showWhy">
        Du logger inn for å kunne gjøre endringer ved behov senere. Mest sannsynlig forblir du pålogget på telefonen/enheten din, så det er kjapt og enkelt å komme tilbake.
      </div>
      <br>
      <br>
      <a href="#how_forget" id="how_forget" @click="showWhatIfForget = !showWhatIfForget">Hva om jeg glemmer passordet mitt?</a>
      <div v-if="showWhatIfForget">
        Du trenger ikke huske passordet ditt, det er bare bonus faktisk, så lenge epost-adressen er riktig vel å merke. Systemet sender deg hjelp til å logge inn igjen hvis du ber om det. Du forblir vanligvis pålogget på telefonen/enheten din, så det vil ofte ikke være et behov uansett.
      </div>
      <br>
      <br>
      <a href="#how_anonymous" id="how_anonymous" @click="showHowAnonymous = !showHowAnonymous">Hva om jeg ikke vil oppgi en epost adresse, evt. være anonym?</a>
      <div v-if="showHowAnonymous">
        I det tilfellet er det mulig å dikte opp en fantasi-epost og bruke kallenavn, etc. Skriv i så fall gjerne ned eposten for innlogging, og husk passordet i tilfelle du skulle bli logget ut og ønsker tilgang på dine opplysninger igjen. I skjemaene blir du spurt på nytt om hvem du er, så der velger du selv hvilke opplysninger du vil oppgi.
      </div>
      <br>
      <br>
      <a href="#how_fallback" id="how_fallback" @click="showHowFallback = !showHowFallback">Hva om jeg likevel ikke vil eller klarer å logge inn?</a>
      <div v-if="showHowFallback">
        Du kan sende forespørsler eller påmeldinger til stavanger@godhet.no, så får du svar når vi har mottatt meldingen din.
      </div>
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
  data() {
    return {
      showWhy: false,
      showWhatIfForget: false,
      showHowAnonymous: false,
      showHowFallback: false,
    }
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