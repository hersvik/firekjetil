<template>
  <div class="container container_under_nav">


    <div class="jumbotron" :class="{jumbotron__logged_in: getters.user().uid}">
      <h1 class="display-4">Godhet Stavanger</h1>
      <p class="lead"><strong>25. - 29. mai</strong> 2020</p>
      <hr class="my-4">

      <div v-if="!getters.user() || !getters.user().uid">
        <p class="lead">For å <strong>melde deg på</strong>, <br />eller for å <strong>komme med forslag</strong> til oppdrag: </p>
        <router-link to="/auth">
          <button type="button" class="btn btn-primary btn-lg">
            Start her
          </button>
        </router-link>
        <p class="lead">Du kan bruke en google konto, eller opprette et selvstendig passord direkte på første innlogging. Glemt passord-funksjonalitet kan deretter brukes. </p>
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
      <p class="lead">I etterkant kan du <strong>lese og redigere</strong> alt du eventuelt har sendt inn - bare naviger inn samme vei.</p>
    </div>

    <div class="video_wrapper">
      <iframe width="200" height="112" src="https://www.youtube.com/embed/--K_rM6p4IM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    I samarbeid med <a href="http://godhet.no">godhet.no</a>
  </div>
</template>

<script>
  import {getters, setters} from '../store'
  export default {
    beforeCreate() {
      setters.setActiveNav("hjem");
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