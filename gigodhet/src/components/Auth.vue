<template lang="html">
  <div>
    <div class="sentrer_hjemlink">
      Godhetstavanger.no
    </div>

    <div id="firebaseui-auth-container"></div>

    <div class="sentrer_hjemlink">
      Tilbake til
      <router-link to="/">Godhetstavanger.no</router-link> hovedside
    </div>

    <div
      class="jumbotron bg-light rounded-lg"
      style="border:solid 1px #eee; margin: 1em;"
    >
      <!-- <h4>Godhet Stavanger</h4> -->
      <p class="lead">
        Logg på med en e-postadresse for å komme videre ⬆️
        <br />Første gang får du velge passord selv ("choose password"). Neste
        gang, hvis du har glemt passordet ditt kan du trykke
        <em>trouble signin in</em> ved passordfeltet, og endre passord via
        mail/spam-folderen.
        <span style="opacity: 0.5;"
          >Alternativt kan du bruke en falsk epostadresse. Da kommer du lett
          inn, men det blir vanskeligere å finne tilbake til det du har sendt
          inn fra andre maskiner enn den du brukte. Helt greit å gjøre, vi
          merker faktisk ikke forskjell. Det er en perfekt løsning dersom du
          skulle ønske du slapp å logge inn i utgangspunktet, og din
          kontakt-info som f.eks. epost adresse fylles ut i skjemaet senere
          likevel.</span
        >
      </p>
      <p class="lead">
        Vi kan registrere for deg også, om du synes det er lettere, bare send
        hvilke dager du vil delta (eller beskrivelse av oppdrag du vil foreslå)
        til
        <em>stavanger@godhet.no</em>, så bekrefter vi når vi sjekker mail, evt
        etterspør vi detaljer ved behov. <br />Dersom vi registrerer for deg kan
        det være lurt å sjekke
        <a href="/deltager_skjema_mobil_10mai2026.pdf">
          kopi av deltager-skjema med info </a
        >.
      </p>
      <a href="#how_why" id="how_why" @click.prevent="showWhy = !showWhy"
        >Hvorfor skal jeg logge inn?</a
      >

      <div v-if="showWhy">
        Du logger inn for at det skal være mulig for deg å gjøre endringer etter
        innsending, om du skulle foretrekke (ikke krise om du glemmer). Mest
        sannsynlig forblir du pålogget på telefonen/enheten din, så det er kjapt
        og enkelt å komme tilbake (via enten godhetstavanger.no eller
        godhet.no). Det primære målet er at den nærmeste
        teamlederen/godhetsagenten din får oversikt over deltagere begrenset til
        sitt team, og kan oppdatere oversikten på dine vegne også.
        Registreringene her gjør det også lettere dersom teamet trenger
        assistanse fra sekretariatet til enten å få flere hender på oppdrag,
        eller å skaffe et oppdrag.
      </div>
      <br />
      <br />
      <a
        href="#how_forget"
        id="how_forget"
        @click.prevent="showWhatIfForget = !showWhatIfForget"
        >Hva om jeg ikke har passord?</a
      >
      <div v-if="showWhatIfForget">
        Første gang dikter du opp et passord ("choose password"). Du er ikke
        nødt til å huske passordet ditt dersom epost-adressen er ekte og riktig.
        Da kan systemet sende deg hjelp til å logge inn igjen hvis du ber om det
        (se <em>Trouble signin in</em> ved passordfeltet). Du forblir pålogget
        på telefonen/enheten din i månedsvis, så da vil det ikke være et behov
        for passord om du kommer tilbake noen måneder senere.
      </div>
      <br />
      <br />
      <a
        href="#how_anonymous"
        id="how_anonymous"
        @click.prevent="showHowAnonymous = !showHowAnonymous"
        >Hva om jeg ikke vil oppgi en epost adresse, evt. være anonym?</a
      >
      <div v-if="showHowAnonymous">
        I det tilfellet er det mulig å dikte opp en fantasi-epost og/eller bruke
        kallenavn. Merk at kontoen du oppretter her <em>ikke</em> kan brukes noe
        annet sted på internett uansett. Husk, hvis du dikter en epostadresse,
        bør du vurdere å skrive den ned inkludert passordet du velger, fordi
        glemt passord-tjenesten ikke vil kunne hjelpe deg når eposten du angir
        er falsk. I skjemaene du sender inn blir du spurt på nytt om hvem du er,
        evt. hvem personen du ønsker å melder på er, så der velger du selv
        hvilke opplysninger du vil oppgi.
      </div>
      <br />
      <br />
      <a
        href="#how_fallback"
        id="how_fallback"
        @click.prevent="showHowFallback = !showHowFallback"
        >Hva om jeg likevel ikke vil eller klarer å logge inn?</a
      >
      <div v-if="showHowFallback">
        I så fall kan du sende forespørsler eller påmeldinger til
        stavanger@godhet.no, så får du svar når vi har mottatt meldingen og
        registrert for deg. Merk at vi ikke har mulighet til å svare alle som
        ønsker hjelp i godhetsuken (forslag til oppdrag), det gjelder om man
        registrerer direkte med innlogging også. Vi tar kontakt med dem vi har
        mulighet til å hjelpe blant forslagene som kommer inn.
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "../../node_modules/firebaseui/dist/firebaseui.css";

// import {config} from '../helpers/firebaseConfig';
export default {
  name: "auth",
  mounted() {
    var uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    };
    let ui;
    if (firebaseui.auth.AuthUI.getInstance()) {
      ui = firebaseui.auth.AuthUI.getInstance();
    } else {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    ui.start("#firebaseui-auth-container", uiConfig);
  },
  data() {
    return {
      showWhy: false,
      showWhatIfForget: false,
      showHowAnonymous: false,
      showHowFallback: false,
    };
  },
};
</script>
<style scoped>
.sentrer_hjemlink {
  text-align: center;
  width: 100%;
  margin-top: 2em;
}
</style>
