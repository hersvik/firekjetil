<template>
  <div class="container container_under_nav">
    <h1>Team registrering</h1>
    <div v-if="team && team.teamName">
      Du har registert deg som kontaktperson for <em>{{team.teamName}}</em><br>
      Dine deltagere skal bruke denne påmeldings-linken: <br>
      <code>godhetstavanger.no/registrering/agent/{{team.id}}</code>
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

    }
  }
</script>

<style scoped>
</style>