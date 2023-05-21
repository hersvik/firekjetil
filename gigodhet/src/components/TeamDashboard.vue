<template>
  <div class="container container_under_nav">
    <a @click="$router.go(-1)">Tilbake</a><br><br>

    <div class="filter_checkboxes" style="color: silver">
      Filtre for "Velg team å se på"<br>
      <input type="checkbox" v-model="filterDays[0]"><label>har folk mandag</label><br>
      <input type="checkbox" v-model="filterDays[1]"><label>har folk tirsdag</label><br>
      <input type="checkbox" v-model="filterDays[2]"><label>har folk onsdag</label><br>
      <input type="checkbox" v-model="filterDays[3]"><label>har folk torsdag</label><br>
      <input type="checkbox" v-model="filterDays[4]"><label>har folk fredag</label><br>
      nb, filterne over ignorerer "meddeltagere" og barn<br><br>

      Velg team å se på:
    </div>
    <select v-model="selectedTeamUid" class="custom-select">
      <option value="">-  Velg team -</option>
      <option 
        v-for="(team, idx) in sortedTeams" :key="idx" :value="team.ownerUid" 
        :disabled="
              filterDays[0] && !teamDays[team.ownerUid][0]
          || filterDays[1] && !teamDays[team.ownerUid][1]
          || filterDays[2] && !teamDays[team.ownerUid][2]
          || filterDays[3] && !teamDays[team.ownerUid][3]
          || filterDays[4] && !teamDays[team.ownerUid][4]
        ">
          {{team.teamName}}
        </option>
    </select>

    <h1>Team status/link</h1>
    <a :href="externalUrl" target="_blank">{{ externalUrl }}</a>

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

    <h1>Endre status/link</h1>
    <input type="text" v-model="externalUrl"><button :class="{ saved: isSaved}" @click="saveExternalLink">Lagre link</button>

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
    name: "TeamDashboard",
    props: ["teamid"],
    data () {
      return {
        registrations: [],
        wishes: [],
        teams: [],
        selectedTeamUid: this.teamid || "",
        externalUrl: "",
        isSaved: false,
        filterDays: [false, false, false, false, false],
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,

      teamDays(){
        let hasMember = {};
        for(let team of this.teams){
          hasMember[team.ownerUid] = [];
          for (let i=0; i<5; i++) {
            hasMember[team.ownerUid][i] 
              = this.registrations.some(
                r => r.primaryPerson.willAttendDay[i]
                && r.agentUid == team.ownerUid
              );
          }
        }
        return hasMember;
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

        let shallow = this.registrations.slice();
        let sorted = shallow;
        sorted.sort((a, b) => {
          return a.created.seconds - b.created.seconds;
        });

        let copy = [];

        for (let i=0; i < sorted.length; i++) {
          let registration = sorted[i];
          
          if(!registration.removedBy){

            copy.push(registration)
          }

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
        this.$router.replace({ path: '/dash/'+teamUid });
        this.updateExternalUrl();
      },
      teams: function(){
        this.updateExternalUrl();
      }
    },
    methods: {

      getRegistrationTeamName(agentUid){
        let teamObject = this.teams.filter(t => t.ownerUid === agentUid)[0];
        let teamName = teamObject && teamObject.teamName || "";
        return teamName;
      },

      saveExternalLink () {
        if (this.selectedTeamUid) {

          db.collection('teams')
            .doc(this.selectedTeamUid)
            .set({externalLink: this.externalUrl}, {merge: true})
            .then(() => {
              // alert("Lagret ✅ ")
              this.isSaved = true;
              setTimeout(() => this.isSaved = false, 2000);
            })
            .catch(function(error){
              alert("Kunne ikke lagre. ("+error+")")
            });
        }
      },

      updateExternalUrl(){
        let teamObject = this.teams.filter(t => t.ownerUid === this.selectedTeamUid)[0];
        this.externalUrl = teamObject && teamObject.externalLink || "";
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
  button.saved{
    background-color: rgb(114, 237, 114);
  }
  .filter_checkboxes input[type="checkbox"] {
    margin-right: 0.3em;
  }
</style>