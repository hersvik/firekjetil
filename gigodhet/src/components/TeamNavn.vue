<template>
  <div class="container container_under_nav">
    <h1>Team registrering</h1>
    <div v-if="team && team.teamName">
      Teamet ditt er opprettet &ndash; <em>"{{team.teamName}}"</em><br>
      <br>
      Send <strong>en slik beskjed</strong> til ditt team: <br>

      <div class="jumbotron" style="margin-bottom: 0">
        Godhet nærmer seg! Meld deg på direkte til gruppen vår her, så vet jeg hvilke dager folk sikter på å delta:
        <code>godhetstavanger.no/registrering/agent/{{team.id}}</code><!--duplicated url in sms method below-->
      </div>
      <button class="btn btn-secondary" @click="redirectToSms()">Åpne som SMS</button><br>
      (bruk mobiltelefonen)<br>
      <br>
      <router-link :to="'/registrering/agent/'+getters.user().uid">
        😃 Bruk lenken til å registrere deg selv også
      </router-link>
    </div>
    <div v-else>
      Registrer deg som team-leder ved å trykke på denne knappen:<br>
      <br>
      <button @click="save" class="btn btn-primary">Bekreft og opprett "{{suggestedTeamName}}"</button>
    </div>
  </div>


</template>

<script>
  import { db } from '../main';
  import { getters, constants } from '../store';

  export default {
    beforeCreate() {
      // setters.setActiveNav("pameldinger");
    },
    name: "TeamNavn",
    props: [],
    data () {
      return {
        team: {},
        copied: false,
      }
    },
    firestore () {
      if (this.getters.user().uid) {
        return {
          team: db.collection("teams").doc(this.getters.user().uid)
        }
      }
    },
    computed: {
      constants() {
        return constants;
      },
      getters(){
        return getters;
      },
      suggestedTeamName() {
        return "Team-"+this.getters.user().displayName
      },

    },
    methods: {

      save () {
        if (this.getters.user().uid) {

          db.collection('teams')
            .doc(this.getters.user().uid)
            .set(
              {
                teamName: this.suggestedTeamName,
                ownerUid: this.getters.user().uid // for db write-permission.
              }, {merge: true})
            .then(() => {
            })
            .catch(function(error){
              alert("Kunne ikke lagre. ("+error+")")
            });
        }
        else {

          alert("Systemfeil - mangler 'user Uid'.")
        }

      },

      redirectToSms() {
        let urlPrefix = this.getMobileOperatingSystem() == "Android" ? "sms:?body=" : "sms:&body=";
        window.location.href=urlPrefix+'Godhet%20n%C3%A6rmer%20seg!%20Meld%20deg%20p%C3%A5%20direkte%20til%20gruppen%20v%C3%A5r%20her%2C%20s%C3%A5%20vet%20jeg%20hvilke%20dager%20folk%20sikter%20p%C3%A5%20%C3%A5%20delta%3A%20godhetstavanger.no%2Fregistrering%2Fagent%2F'+this.team.id; // de/encoder https://meyerweb.com/eric/tools/dencoder/
      },
      getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // // Windows Phone must come first because its UA also contains "Android"
        // if (/windows phone/i.test(userAgent)) {
        //     return "Windows Phone";
        // }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
      },
    }
  }
</script>

<style scoped>
</style>