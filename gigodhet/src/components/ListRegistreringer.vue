<template>
  <div class="container container_under_nav">
    <template v-if="teams.map(t => t.ownerUid).includes(getters.user().uid)">
      <h1>Deltagere</h1>
      <router-link :to="'/registrering/agent/'+getters.user().uid">
        Direkte påmelding
      </router-link>
      -
      <router-link to="/teamreg">
        Send lenke
      </router-link>
      <h2>Ditt A-team</h2>
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


    <h1>Påmeldinger</h1>
    <li class="list-group">
      <ul class="list-group-item">
        + <router-link :to="{path: 'registrering'}">
          Ny påmelding
        </router-link>
        <small @click="showAll" class="show_removed" v-if="!showRemoved">[vis skjulte]</small>
        <small @click="showAll" class="show_removed" v-if="showRemoved">[skjul igjen]</small>
      </ul>
      <ul v-for="(registration) in chronologicalRegistrations" :key="registration.id" class="list-group-item" :class="{faded_removed: registration.removedBy}">
        {{registration.isMostRecentEdited}}
        <span class="edited_tag">#{{registration.counter}}</span>
        <span class="dot" v-if="registration.ownerUid === getters.user().uid"></span>
        {{registration.created.toDate().toLocaleDateString()}}
        <span class="hasAgent" v-if="registration.agentUid === getters.user().uid"> A</span>
        <span class="hasAgent" v-else-if="registration.agentUid"> {{getRegistrationTeamName(registration.agentUid)}} </span>
        <router-link :to="{name: 'endreRegistrering', params:{id: registration.id} }">
          {{registration.primaryPerson.firstName}} {{registration.primaryPerson.lastName}} (+{{registration.participants && registration.participants.length || 0}})
        </router-link>
        <span class="" v-if="registration.removedBy">Fjernet av {{registration.removedBy}} </span>
        <span class="edited_tag">{{registration.displayEdited}} </span>
        <span v-if="getters.user().uid === constants.adminUid" v-tooltip:top="'Intern sekretariat-kommentar'">{{registration.status}}</span>
      </ul>
    </li>

    <!--<div style="opacity: 0.1;">{{getters.user().uid}}</div>Temporary show Uid-->
  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, setters, constants} from '../store';

  export default {
    beforeCreate() {
      setters.setActiveNav("pameldinger");
    },
    created(){
      db.collection('teams')
      .get()
      .then(querySnapshot => {
        this.teams = querySnapshot.docs.map(doc => doc.data())
      })
    },
    name: "ListRegistreringer",
    data () {
      return {
        registrations: [],
        registrationsWithAgentAccess: [],
        showRemoved: false,
        teams: [],
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
          if (this.showRemoved || !registration.removedBy) {
              copy.push(registration)
          }
          else{
            continue;
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
      myTeamRegistrations() {
        return this.chronologicalRegistrations.filter(r => r.agentUid === this.getters.user().uid)
      },
    },
    firestore () {
      if(getters.user().uid === constants.adminUid){
        return {
          registrations: db.collection("registrations")
        };
      }
      else if (getters.user().uid) {
        return {
          registrations: db.collection("registrations").where("ownerUid", "==", getters.user().uid),
          registrationsWithAgentAccess: db.collection("registrations").where("agentUid", "==", getters.user().uid)//.where("ownerUid", "!=", getters.user().uid)
        };
      }
    },
    methods: {
      showAll(){
        this.showRemoved = !this.showRemoved;
      },
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
  .show_removed {
    float: right;
    opacity: 0.5;
    cursor: pointer;
  }
  .faded_removed {
    opacity: 0.4;
  }
  .hasAgent{
    font-weight: bold;
  }
  .dot {
    height: 0.8em;
    width: 0.8em;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    margin: 0 0.2em
;
  }
</style>