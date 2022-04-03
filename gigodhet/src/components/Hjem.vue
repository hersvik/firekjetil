<template>
  <div class="container container_under_nav">


    <div class="jumbotron" :class="{jumbotron__logged_in: getters.user().uid}">
      <h1 class="display-4">Godhet Stavanger &ndash; 2022</h1><!--remember year duplicated in wish.event and reg.event-->
      <p class="lead"><strong>Uke 22</strong> &ndash; fra mandag 30. mai</p>
      <p class="lead">Vi gjør <strong>godhet</strong> sammen</p>
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
          <button type="button" class="btn btn-primary btn-lg mr-2 mt-3">
            Deltager-påmelding
          </button><br>
        </router-link>
        <span class="lead mb-3 mr-4">&ndash; for deg selv, eller på vegne av noen andre</span><br>
        <router-link to="/wishes">
          <button type="button" class="btn btn-primary btn-lg mt-4">
            Foreslå oppdrag
          </button><br>
        </router-link>
        <span class="lead mb-3">&ndash; som noen kan utføre</span>
      </div>

      <hr class="my-4">
      <p class="lead">Etter at du har sendt inn en påmelding eller et forslag kan du når som helst <span style="background-color: white; border-right: solid 1px grey">redigere</span> det &ndash; bare naviger inn samme vei på nytt.
      </p>
      <div v-if="!getters.user() || !getters.user().uid">
        <hr class="my-4">
        <p class="lead">💚 Hvis du står fast kan (eventuelt) en du kjenner logge på med sitt eget passord, og melde på deg eller andre. Da er det denne personen som har tilgang til å lese eller redigere på vegne av deg i etterkant.
        </p>
      </div>
    </div>
    Kontakt oss: stavanger@godhet.no

    <div class="video_wrapper">
      <iframe width="200" height="112" src="https://www.youtube.com/embed/--K_rM6p4IM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    I samarbeid med <a href="http://godhet.no">godhet.no</a>

    <div style="margin-top: 1em; color: silver;">
      <em>Oppdatert 3. april 2022</em>
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