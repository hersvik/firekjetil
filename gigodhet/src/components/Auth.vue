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
        Du logger inn for at det skal være mulig for deg å gjøre endringer etter innsending, om du skulle foretrekke (ikke krise om du glemmer). Mest sannsynlig forblir du pålogget på telefonen/enheten din, så det er kjapt og enkelt å komme tilbake (via enten godhetstavanger.no eller godhet.no). Det primære målet er at den nærmeste teamlederen/godhetsagenten din får oversikt over deltagere begrenset til sitt team, og kan oppdatere oversikten på dine vegne også. Registreringene her gjør det også lettere dersom teamet trenger assistanse fra sekretariatet til enten å få flere hender på oppdrag, eller å skaffe et oppdrag.   
      </div>
      <br>
      <br>
      <a href="#how_forget" id="how_forget" @click="showWhatIfForget = !showWhatIfForget">Hva om jeg ikke har passord?</a>
      <div v-if="showWhatIfForget">
        Første gang dikter du opp et passord. Hvis du skal hente/redigere opplysningene dine og du er på en annen telefon/maskin enn den som er logget inn, må du huske hvilken epost-adresse du logger inn med her.  Du er ikke nødt til å huske passordet ditt dersom epost-adressen er ekte og riktig. Da kan systemet sende deg hjelp til å logge inn igjen hvis du ber om det. Du forblir vanligvis pålogget på telefonen/enheten din, så det vil som regel ikke være et behov for passord uansett.
      </div>
      <br>
      <br>
      <a href="#how_anonymous" id="how_anonymous" @click="showHowAnonymous = !showHowAnonymous">Hva om jeg ikke vil oppgi en epost adresse, evt. være anonym?</a>
      <div v-if="showHowAnonymous">
        I det tilfellet er det mulig å dikte opp en fantasi-epost og/eller bruke kallenavn. Merk at kontoen du oppretter her  <em>ikke</em> kan brukes noe annet sted på internett uansett. Husk, hvis du dikter en epostadresse, bør du vurdere å skrive den ned inkludert passordet du velger, fordi glemt passord-tjenesten ikke vil kunne hjelpe deg når eposten du angir er falsk. I skjemaene du sender inn blir du spurt på nytt om hvem du er, evt. hvem personen du ønsker å melder på er, så der velger du selv hvilke opplysninger du vil oppgi.
      </div>
      <br>
      <br>
      <a href="#how_fallback" id="how_fallback" @click="showHowFallback = !showHowFallback">Hva om jeg likevel ikke vil eller klarer å logge inn?</a>
      <div v-if="showHowFallback">
        I så fall kan du sende forespørsler eller påmeldinger til stavanger@godhet.no, så får du svar når vi har mottatt meldingen eller påmeldingen din. Merk at vi ikke har mulighet til å svare alle som ønsker hjelp i godhetsuken (forslag til oppdrag), det gjelder om man registrerer direkte med innlogging også. Vi tar kontakt med dem vi har mulighet til å hjelpe blant forslagene som kommer inn. 
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