<template>
  <div class="container container_under_nav">


    <div class="jumbotron" :class="{jumbotron__logged_in: getters.user().uid}">
      <h1 class="display-4">Godhet Stavanger &ndash; 2022</h1><!--remember year duplicated in wish.event and reg.event-->
      <p class="lead"><strong>Uke 22</strong> &ndash; fra mandag 30. mai</p>
      <p class="lead">Vi gjør <strong>godhet</strong> sammen</p>
      <hr class="my-4">

      <div v-if="!getters.user() || !getters.user().uid">
        <p class="lead">For å <strong>melde deg på</strong>, <br />eller for å <strong>komme med forslag</strong> til oppdrag: </p>
        <a href="/auth">
          <button type="button" class="btn btn-primary btn-lg">
            Denne veien inn
          </button>
        </a>
      </div>
      <div v-else>
        <p class="lead logged_in"><strong>Du er logget inn 👍</strong> Se videre:</p>
        <router-link to="/regs">
          <button type="button" class="btn btn-primary btn-lg mr-2 mt-3">
            Deltager-påmelding
          </button><br>
        </router-link>
        <span class="lead mb-3 mr-4">&ndash; for deg selv, eller på vegne av noen andre</span><br>
        <router-link to="/wishes">
          <button type="button" class="btn btn-primary btn-lg mt-4">
            Meld inn oppdrag
          </button><br>
        </router-link>
        <span class="lead mb-3">&ndash; som noen kan utføre</span>
      </div>

      <hr class="my-4">
      <p class="lead">Etter innsending er det mulig for deg på egenhånd å <span style="background-color: white; border-right: solid 1px silver">endre</span> påmeldinger eller oppdrag som du har meldt inn, om du foretrekker. Kom i så fall tilbake hit til <strong>godhetstavanger.no</strong> (evt. gå via godhet.no). </p>
      <p>Teamlederen din, som eventuelt skal være godhetsagenten i huskirken din, kan beholde oversikt ved å lese og endre infoen din på dine vegne også, begrenset til  de deltagerne teamlederen har i sitt eget team :) 
      </p>
      <div v-if="!getters.user() || !getters.user().uid">
        <hr class="my-4">
        <p class="lead">💚 Hvis du står fast kan hvem som helst registrere her på dine vegne, ved å logge seg selv inn først. Alternativt kan du skrive epost til stavanger@godhet.no
        </p>
      </div>
    </div>
    Kontakt oss: stavanger@godhet.no

    <div class="video_wrapper">
      <iframe width="200" height="112" src="https://www.youtube.com/embed/--K_rM6p4IM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    I samarbeid med <a href="http://godhet.no">godhet.no</a>

    <div style="margin-top: 1em; color: silver;">
      <em>Oppdatert 3. mai 2022</em> - <a href="/teamreg">Team-registrering (midlertidig snarvei)</a>
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

  .logged_in {
    background-color: white;
    padding-left: 16px;
    padding-top: 0.5em;
    position: relative;
    left: -16px;
    border-left: solid blue 2px;
    }
</style>