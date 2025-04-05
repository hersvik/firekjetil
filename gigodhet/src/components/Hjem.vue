<template>
  <div class="container container_under_nav">
    <div
      class="jumbotron"
      :class="{ jumbotron__logged_in: getters.user().uid }"
    >
      <h1 class="display-4">Godhet Stavanger &ndash; 2025</h1>
      <!--remember year duplicated in wish.event and reg.event-->
      <p class="lead">19. - 23. mai</p>
      <p class="lead">
        Les
        <router-link to="/info">infoskriv om godhetsuken</router-link>
        (publisert 24.mai 2024)
      </p>
      <hr class="my-4" />

      <div v-if="!getters.user() || !getters.user().uid">
        <p class="lead">
          For å <strong>melde deg på</strong>, <br />eller for å
          <strong>komme med forslag</strong> til oppdrag:
        </p>
        <a href="/auth">
          <button type="button" class="btn btn-primary btn-lg">
            Denne veien inn
          </button>
        </a>
      </div>
      <div v-else>
        <p class="lead logged_in" style="margin-bottom: 1.5em;">
          🔷 Du er logget inn 👍 Se videre:
        </p>
        <router-link to="/regs">
          <button type="button" class="btn btn-primary btn-lg mr-2 mt-3">
            Deltager-påmelding</button
          ><br />
        </router-link>
        <span class="lead mb-3 mr-4"
          >&ndash; for deg selv, eller på vegne av noen andre</span
        ><br />
        <router-link to="/wishes">
          <button type="button" class="btn btn-primary btn-lg mt-4">
            Meld inn oppdrag</button
          ><br />
        </router-link>
        <span class="lead mb-3">&ndash; som noen kan utføre</span><br />

        <router-link to="/teamreg">
          <button
            type="button"
            class="btn btn-light btn-lg mr-2 mt-3"
            style="box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;"
          >
            Bli teamleder</button
          ><br />
        </router-link>
        <span class="lead mb-3">&ndash; for "godhetsagenter" i huskirkene</span>
      </div>

      <hr class="my-4" />
      <p class="lead">
        Etter innsending kan du
        <span style="background-color: white; border-right: solid 2px silver"
          >endre påmeldinger
        </span>
        &nbsp;eller oppdrag som du har meldt inn. Kom i så fall tilbake hit til
        <strong>godhetstavanger.no</strong>. Vi oppdaterer informasjonen for deg
        også ved behov.
      </p>
      <p>
        Teamlederen for akkurat ditt team (som skal være godhetsagenten i
        huskirken din), får oversikt og kan oppdatere dine saker.
      </p>
      <div v-if="!getters.user() || !getters.user().uid">
        <hr class="my-4" />
        <p class="lead">
          💚 Hvis du ikke får til å starte registrering, kan hvem som helst
          andre gjøre det på dine vegne, ved å logge på som seg selv. Da er det
          denne personen som har tilgang til å endre opplysningene dine.
          Alternativt kan du skrive epost til stavanger@godhet.no, så får du
          hjelp med registrering.
        </p>
      </div>
    </div>
    Kontakt oss: stavanger@godhet.no

    <div class="video_wrapper">
      <iframe
        width="200"
        height="112"
        src="https://www.youtube.com/embed/--K_rM6p4IM"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>

    I samarbeid med <a href="http://godhet.no">godhet.no</a>

    <div style="margin-top: 1em; color: silver;">
      <em>Oppdatert 5. april 2025</em> -
      <a href="/teamreg">Team-registrering (midlertidig snarvei)</a>
    </div>
  </div>
</template>

<script>
import { getters, setters } from "../store";
export default {
  beforeCreate() {
    setters.setActiveNav("hjem");
  },
  data() {
    return {
      more: false,
    };
  },
  methods: {},
  computed: {
    getters() {
      return getters;
    },
  },
};
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
  padding: 4px 16px;
  position: relative;
  /* left: -16px; */
  border-left: solid blue 2px;
}
</style>
