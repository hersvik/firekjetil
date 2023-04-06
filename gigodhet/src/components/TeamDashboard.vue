<template>
  <div class="container container_under_nav">
    <router-link to="/regs">Tilbake</router-link><br><br>

    <span style="color: silver">Velg team å se på:</span>
    <select v-model="selectedTeamUid" class="custom-select">
      <option value="">-  Velg team -</option>
      <option v-for="(team, idx) in sortedTeams" :key="idx" :value="team.ownerUid">{{team.teamName}}</option>
    </select>

    <template>
      <h1>Deltagere</h1>
      <div v-for="(nVariableNotUsed, index) in constants.campaignDays.length" :key="index">
        <h5 class="dayTitle">{{constants.campaignDays[index]}}</h5>
        <div v-for="(registration) in myTeamRegistrations" :key="registration.id">
          <li v-if="registration.primaryPerson.willAttendDay[index]">
            <router-link :to="{name: 'endreRegistrering', params:{id: registration.id} }">
              {{registration.primaryPerson.firstName}} {{registration.primaryPerson.lastName}}
            </router-link>
          </li>
          <div v-for="(participant) in registration.participants" :key="participant.firstName + participant.lastName">
            <li v-if="participant.willAttendDay[index]">
              <router-link :to="{name: 'endreRegistrering', params:{id: registration.id} }">
                {{participant.firstName}} {{participant.lastName}}
              </router-link>
                ({{participant.ageGroup == "child" ? "barn" : "meddeltager"}})
            </li>
          </div>
        </div>
      </div>
    </template>

    <h1>Oppdrag</h1>

    <li class="list-group">
      <ul v-for="(wish) in chronologicalWishes" :key="wish.id" class="list-group-item">
        {{wish.isMostRecentEdited}}
        {{wish.created.toDate().toLocaleDateString()}}
        <router-link :to="{name: 'endreWish', params:{id: wish.id} }">
          <em>{{wish.target.address}}</em>: <strong>{{wish.title}}</strong>  for {{wish.target.firstName}} {{wish.target.lastName}}
        </router-link>
        <span class="edited_tag">{{wish.displayEdited}} </span>
        <span v-if="getters.user().uid === constants.adminUid" v-tooltip:top="'Admin-status (intern)'">{{wish.status}}</span>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, setters, constants} from '../store';

  export default {
    beforeCreate() {
      setters.setActiveNav("pameldinger");
    },
    mounted(){
    },
    name: "ListRegistreringer",
    props: ["teamid"],
    data () {
      return {
        registrations: [],
        wishes: [],
        registrationsWithAgentAccess: [],
        teams: [],
        selectedTeamUid: this.teamid || "",
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
      registrationsReadOnly() {
        return this.registrationsWithAgentAccess.filter(r => r.ownerUid !== getters.user().uid);
      },

      chronologicalRegistrations() {
        if (!this || !this.registrations) {
          return;
        }
        // Find most recently edited
        let uidRecentEdit;
        let secondsRecentEdit = 0;
        for(let registration of this.registrations){
          if(registration.edited && registration.edited.seconds > secondsRecentEdit) {
            secondsRecentEdit = registration.edited.seconds;
            uidRecentEdit = registration.id;
          }
        }
        let uidMostRecentEdited = uidRecentEdit;

        let combined = this.registrations.slice().concat(this.registrationsReadOnly.slice());
        let sorted = combined;
        sorted.sort((a, b) => {
          return a.created.seconds - b.created.seconds;
        });

        let copy = [];

        for (let i=0; i < sorted.length; i++) {
          let registration = sorted[i];
          copy.push(registration)

          registration.counter = i+1;
          if (registration.edited.seconds !== registration.created.seconds) {

            let hoursAgo = (Date.now() - registration.edited.toMillis())/1000/60/60/24;
            registration.displayEdited = "(endret " + hoursAgo.toFixed(1) + " dager siden)"; // inserted property

            registration.isMostRecentEdited = registration.id === uidMostRecentEdited // inserted property
                                              ? "->"
                                              : "";
          }
        }
        return copy;
      },

      chronologicalWishes() {
        if (!this || !this.wishes) {
          return;
        }
        // Find most recently edited
        let uidRecentEdit;
        let secondsRecentEdit = 0;
        for(let wish of this.wishes){
          if(wish.edited && wish.edited.seconds > secondsRecentEdit) {
            secondsRecentEdit = wish.edited.seconds;
            uidRecentEdit = wish.id;
          }
        }
        let uidMostRecentEdited = uidRecentEdit;

        
        let copy = [];

        for(let i=0; i < this.wishes.length; i++){
          let wish = this.wishes[i];
          if (!wish.isDiscarded) { //UI also prohibits discarding before un-assigning
              copy.push(wish)
          }
          else{
            continue;
          }

          if(wish.edited.seconds !== wish.created.seconds){
            let hoursAgo = (Date.now() - wish.edited.toMillis())/1000/60/60/24;
            wish.displayEdited = "(endret " + hoursAgo.toFixed(1) + " dager siden)";

            wish.isMostRecentEdited = wish.id === uidMostRecentEdited
                                              ? "->"
                                              : "";
          }
        }
        return copy
        .sort((a, b) => a.created.seconds - b.created.seconds)
        .filter(w => w.agentUid === this.selectedTeamUid);// only agent-assigned? yes 
      },

      myTeamRegistrations() {
        return this.chronologicalRegistrations.filter(r => r.agentUid === this.selectedTeamUid)
      },
      sortedTeams() {
        return this.teams.slice().sort((a, b) => a.teamName.localeCompare(b.teamName))
      },
    },
    firestore () {
        return {
          registrations: db.collection("registrations"),
          wishes: db.collection("wishes"),
          teams: db.collection("teams"),
        };
    },
    watch: {
      selectedTeamUid: function(teamUid) {
        this.$router.replace({ path: '/dash/'+teamUid })
      }
    },
    methods: {
      getRegistrationTeamName(agentUid){
        let teamObject = this.teams.filter(t => t.ownerUid === agentUid)[0];
        let teamName = teamObject && teamObject.teamName || "";
        return teamName;
      },
    }
  }
</script>

<style scoped>
  h1 {
    margin-top: 0.5em;
  }
  .dayTitle{
    margin: 1em 0 0.5em;
  }
  .edited_tag {
    opacity: 0.5;
  }
</style>