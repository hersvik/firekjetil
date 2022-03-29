<template>
  <div class="container container_under_nav">
    <h1>Team registrering</h1>
    <div v-if="team && team.teamName">
      Du har registert deg som leder/agent for <em>{{team.teamName}}</em><br>
      <br>
      Dine deltagere skal bruke denne <strong>påmeldings-lenken</strong> (kun for din gruppe): <br>
      <!--button @click="copyUrl" class="btn btn-secondary">{{copied ? "Kopiert !" : "Kopier"}}</button (Not IOS security compatible)-->
      <code>godhetstavanger.no/registrering/agent/{{team.id}}</code><!--duplicated url in clipbaord line below-->
      <br>
      <button class="btn btn-secondary" @click="redirectToSms()">Send den på SMS</button><br>
      (bruk mobiltelefonen)<br>
      <br>
      <a :href="'/registrering/agent/'+getters.user().uid">
        Bruk lenken til å registrere deg selv også
      </a>
    </div>
    <div v-else>
      Registrer deg som team-leder ved å trykke på denne knappen:<br>
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

      copyUrl() {
        navigator.clipboard.writeText("godhetstavanger.no/registrering/agent/"+this.team.id);
        this.copied = true;
      },
      redirectToSms() {
        window.location.href='sms:&body=Godhet%20n%C3%A6rmer%20seg!%20Meld%20deg%20p%C3%A5%20direkte%20til%20gruppen%20v%C3%A5r%20her%2C%20s%C3%A5%20vet%20jeg%20hvilke%20dager%20folk%20sikter%20p%C3%A5%20%C3%A5%20delta%3A%20godhetstavanger.no%2Fregistrering%2Fagent%2F'+this.team.id;
      },
    }
  }
</script>

<style scoped>
</style>