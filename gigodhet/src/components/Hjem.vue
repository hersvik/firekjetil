<template>
  <div class="container container_under_nav">


    <div class="jumbotron" :class="{jumbotron__logged_in: getters.user().uid}">
      <h1 class="display-4">Godhet Stavanger &ndash; 2021</h1>
      <p class="lead"><strong>Uke 22</strong> &ndash; fra mandag 31. mai</p>
      <hr class="my-4">

      <div v-if="!getters.user() || !getters.user().uid">
        <p class="lead">For å <strong>melde deg på</strong>, <br />eller for å <strong>komme med forslag</strong> til oppdrag: </p>
        <router-link to="/auth">
          <button type="button" class="btn btn-primary btn-lg">
            Start her
          </button>
        </router-link>
        <!-- <span style="color: silver;"> PC eller smartelefon</span> -->
        <p class="lead">Ved første innlogging kan du opprette et passord (velg "email") eller velge "google" for å bruke din google konto. Hvis du ønsker å vende tilbake en annen gang, er det nok å huske hvilken epostadresse du brukte, så kan du få nytt passord ved behov. </p>
      </div>
      <div v-else>
        <p class="lead">Yes, du er nå logget inn, <strong>kjør på</strong> videre:</p>
        <router-link to="/regs">
          <button type="button" class="btn btn-primary btn-lg mr-3 mt-3">
            Meld på som deltager
          </button>
        </router-link>
        <router-link to="/wishes">
          <button type="button" class="btn btn-primary btn-lg mt-3">
            Foreslå oppdrag
          </button>
        </router-link>
      </div>

      <hr class="my-4">
      <p class="lead">Etter at du har sendt inn en påmelding eller et forslag kan du når som helst <span style="background-color: white;">redigere</span> informasjonen &ndash; bare naviger inn samme vei.
      <span v-if="more">Vi beholder kun informasjon fra din siste endring. Godhet Stavanger vil kontakte deg angående påmeldingen din. Hvis du ønsker å endre påmeldingen din (eller ditt forslag til oppdrag) etter at du har fått svar på den, kan det være lurt å si ifra til personen som kontaktet deg i tillegg til å redigere her på egenhånd. Vedkommende leser ellers ikke nødvendigvis informasjonen din på nytt.
        <span style="font-size: 0.8em"><br />Du kan også fjerne informasjonen din på egenhånd ved å evt. erstatte med tom info. Ta kontakt eventuelt ved ønske om å slette brukernavn eller slette tidspunkt for din siste redigering.</span>
      </span>
      <span @click="toggleMore()" style="color: silver; cursor: pointer;"> {{more ? "vis mindre" : "vis mer"}}</span>
    </p>
    </div>

    <div class="video_wrapper">
      <iframe width="200" height="112" src="https://www.youtube.com/embed/--K_rM6p4IM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    I samarbeid med <a href="http://godhet.no">godhet.no</a>

    <div style="margin-top: 1em; color: silver;">
      <em>Oppdatert 13. april 2021 (Gjennomgang av all info, endret årstall 2020->2021)</em>
    </div>
  </div>
</template>

<script>
  import {getters, setters} from '../store'
  export default {
    beforeCreate() {
      setters.setActiveNav("hjem");
    },
    data(){
      return {
      more: false,
      }
    },
    methods: {
      toggleMore() {
        return this.more = !this.more;
      },
    },
    computed: {
      getters(){
        return getters;
      }
    }
  }
</script>

<style>
  .video_wrapper {
    display: block;
    margin: 1em 0;
  }

  .jumbotron__logged_in {
    background-color: #cfffdd;
  }
</style>