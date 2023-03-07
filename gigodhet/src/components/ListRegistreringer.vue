<template>
  <div class="container container_under_nav">

    <div v-if="teams.map(t => t.ownerUid).includes(getters.user().uid)" class="bg-light" style="border: 1px solid silver; border-radius: 4px; padding: 1em">
      <h1 style="margin-top: 0; margin-bottom: 0.5em">Du er gruppeleder</h1>

      <h2>Ditt team</h2>
      <router-link to="/teamreg" class="btn btn-outline-secondary btn_green_outline">
        Send invitasjon
      </router-link>
        - eller -
      <router-link :to="'/registrering/agent/'+getters.user().uid" class="btn btn-outline-secondary btn_green_outline">
        Påmelding direkte
      </router-link>
      
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
    </div>

    <h1>
      Påmeldinger <span v-if="getters.user().uid === constants.adminUid">
        [<router-link to="/dash">Velg team</router-link>]
        </span>
        <small @click="showAll" class="show_removed" v-if="atLeastOneRemoved && !showRemoved">[vis skjulte]</small>
        <small @click="showAll" class="show_removed" v-if="atLeastOneRemoved && showRemoved">[skjul igjen]</small>
    </h1>

    <div v-if="registrations.length" class="alert alert-secondary bg-light mt-3" role="alert">
      <span style="font-size: 1em; float:  left; margin-right: 0.5em;">
        💪
      </span>
      <div class="">Se nedenfor for å lese innsendt påmelding. Send dem inn på nytt ved endring! </div>
    </div>

    <!--div v-for="(tiem, idx) in tiems" :key=idx>      <!- <------------------- disable BEFORE commit !!! ->
      <input type="text" v-model="tiem.teamName" @input="onTiemEdit(tiem.id)" ref="tieminput">
    </div-->
    <li class="list-group">
      <ul class="list-group-item highlight_background_optimistic">
        + <router-link :to="{path: 'registrering'}">
          Lag ny påmelding 
          <span v-if="teams.map(t => t.ownerUid).includes(getters.user().uid)" style="color: hwb(138deg 37% 34%); font-style: italic;">
            (NB: For ditt eget team se knapper over)
          </span>
        </router-link>
      </ul>
      <ul v-for="(registration) in chronologicalRegistrations" :key="registration.id" class="list-group-item" :class="{faded_removed: registration.removedBy}">
        {{registration.isMostRecentEdited}}
        <span class="edited_tag">#{{registration.counter}}</span>
        <span class="dot" v-if="registration.ownerUid === getters.user().uid"></span>
        {{registration.created.toDate().toLocaleDateString()}}
        <span class="hasAgent" v-if="registration.agentUid === getters.user().uid"> I ditt team</span>
        <span class="hasAgent" v-else-if="registration.agentUid"> {{getRegistrationTeamName(registration.agentUid)}} </span>
        <router-link :to="{name: 'endreRegistrering', params:{id: registration.id} }">
          {{registration.primaryPerson.firstName}} {{registration.primaryPerson.lastName}} (+{{registration.participants && registration.participants.length || 0}})
        </router-link>
        <span class="" v-if="registration.removedBy">Fjernet av {{registration.removedBy}} </span>
        <span class="edited_tag">{{registration.displayEdited}} </span>
        <span v-if="getters.user().uid === constants.adminUid" v-tooltip:top="'Intern sekretariat-kommentar'">{{registration.status}}</span>
      </ul>
      <ul v-if="getters.user().uid === constants.adminUid" class="list-group-item">
        <label style="color: #007bff; cursor: pointer;">
          <input type="checkbox" v-model="hideTeams">
          Skjul teamene
        </label>
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
      db.collection('teams') //       <----------  to be replaced in firestore method (tiems) !!! !!! !!!
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
        tiems: [],
        hasQueuedSave: false, // tiems
        whiteTimerId: null, // tiems
        hideTeams: true,
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
      registrationsReadOnly() {
        return this.registrationsWithAgentAccess.filter(r => r.ownerUid !== getters.user().uid);
      },
      atLeastOneRemoved() {
        return this.registrations.some(r => !!r.removedBy) || this.registrationsWithAgentAccess.some(r => !!r.removedBy);
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
          let isVisible = this.showRemoved || !registration.removedBy;
          let isAdmin = this.getters.user().uid === this.constants.adminUid;
          let isIncluded = !isAdmin || !this.hideTeams || !registration.agentUid;
          if (isVisible && isIncluded) {
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
          registrations: db.collection("registrations"),
          // tiems: db.collection("tiems") // disable BEFORE commit
        };
      }
      else if (getters.user().uid) {
        return {
          registrations: db.collection("registrations").where("ownerUid", "==", getters.user().uid),
          registrationsWithAgentAccess: db.collection("registrations").where("agentUid", "==", getters.user().uid)//.where("ownerUid", "!=", getters.user().uid)
          // future note: get tiems data for this scenario
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
      onTiemEdit(tiemId){
        clearTimeout(this.whiteTimerId);
        this.$refs.tieminput[0].style.backgroundColor = "white";

        if(!this.hasQueuedSave){
          this.hasQueuedSave = true;
          setTimeout(() => {
            this.hasQueuedSave = false;
            this.saveTiem(tiemId)
          }, 2000);
        }
      },
      saveTiem(tiemId){
        let that=this;
        db.collection('tiems')
            .doc(tiemId)
            .set(
              {
                teamName: this.tiems.filter(t => t.id == tiemId)[0].teamName,
                ownerUid: this.getters.user().uid // for db write-permission.
              },
              {merge: true})
            .then(() => {
                that.$refs.tieminput[0].style.backgroundColor = "#cfc";
                  this.whiteTimerId = setTimeout(() => {
                    if(!this.hasQueuedSave)
                      that.$refs.tieminput[0].style.backgroundColor = "white";
                  }, 3000);
            })
            .catch(function(error){
              alert("Kunne ikke lagre tiem. ("+error+")")
            });

      }
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
    font-size: 1rem;
    float: right;
    opacity: 0.3;
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
    margin: 0 0.2em;
  }
  .highlight_background_optimistic{
    background-color: #e4ffec;
    border: solid 1px #93d9a8;
  }
  .highlight_background_optimistic a{
    color: black;
  }
  .btn_green_outline {
    border: solid 1px #93d9a8;
    background-color: #cfffdd;
  }
</style>