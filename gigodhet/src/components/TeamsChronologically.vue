<template>
  <div class="container container_under_nav">
    <a @click="$router.go(-1)">Tilbake</a><br><br>

    <p style="color: silver">Liste-forklaring: dato team opprettet, <strong>Antall oppdrag</strong>, lenke til teamets info</p>
    <div v-for="team in chronologicalTeams" :key="team.ownerUid" style="margin: 0.5em">
        {{ team.created && team.created.toDate().toLocaleDateString() }}
        <strong>{{ wishes.filter(w => w.agentUid === team.ownerUid).length }}</strong>&nbsp;
        <router-link :to="{name: 'dashTeamid', params: {teamid: team.ownerUid}}">{{ team.teamName }}</router-link>
    </div>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, constants} from '../store';

  export default {
    beforeCreate() {
      // setters.setActiveNav("pameldinger");
    },
    mounted(){
    },
    name: "TeamsChronologically",
    props: [],
    data () {
      return {
        teams: [],
        wishes: [],
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
      chronologicalTeams() {
        let copy = this.teams.slice()
        return copy.sort((a, b) => (a.created && a.created.seconds || 0) - (b.created && b.created.seconds || 0));
      },
    },
    firestore () {
        return {
          teams: db.collection("teams").orderBy("teamName", "asc"),
          wishes: db.collection("wishes"),
        };
    },
    watch: {
    },
    methods: {

      // getRegistrationTeamName(agentUid){
      //   let teamObject = this.teams.filter(t => t.ownerUid === agentUid)[0];
      //   let teamName = teamObject && teamObject.teamName || "";
      //   return teamName;
      // },


    }
  }
</script>

<style scoped>
  h1 {
    margin-top: 0.5em;
  }
</style>