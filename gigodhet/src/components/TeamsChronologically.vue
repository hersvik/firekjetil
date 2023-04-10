<template>
  <div class="container container_under_nav">
    <a @click="$router.go(-1)">Tilbake</a><br><br>

    <ul v-for="team in chronologicalTeams" :key="team.ownerUid">
      <li>
        {{ team.created && team.created.toDate().toLocaleDateString() }} 
        <router-link :to="{name: 'dashTeamid', params: {teamid: team.ownerUid}}">{{ team.teamName }}</router-link>
      </li>
    </ul>

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