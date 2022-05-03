<template>
  <div class="container container_under_nav">
    <template v-if="teams.length > 0"> <!--//avoiding vue error?-->
      <h1>Teams</h1>
      <div v-for="(nVariableNotUsed, dayIndex) in constants.campaignDays.length" :key="dayIndex">

      <h5 class="dayTitle">{{constants.campaignDays[dayIndex]}}</h5>

        <div v-for="(cal) in teamsEachDay[dayIndex]" :key="cal.teamName">
          <router-link to="regs">
            {{cal.adults}} {{cal.teamName}} {{cal.children ? ` + ${cal.children} barn` : ""}}
          </router-link>
          <input type="text" v-model="teams.filter(t => t.ownerUid == cal.agentUid)[0]['noteDay'+dayIndex]" @input="onTeamEdit(cal.agentUid)" ref="teaminput">
        </div>

      </div>
    </template>

    </div>
</template>

<script>
  import { db } from '../main';
  import {getters, constants} from '../store';

  export default {
    beforeCreate() {
    },
    created(){
    },
    name: "ListTeams",
    data () {
      return {
        registrations: [],
        teams: [],
        hasQueuedSave: false, // teams
        whiteTimerId: null, // teams
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
      teamsEachDay() {
        if (!this || !this.registrations || !this.teams) {
          return;
        }
        // let that = this; // not sure why this becomes undefined a few lines down here.

        let calendar = [];
        for (let day=0; day < constants.campaignDays.length; day++){
          calendar[day] = {};//{ agentUid: {adults: 0, childCount: 0} };
        }
        for (let i=0; i < this.registrations.length; i++) {
          let registration = this.registrations[i];
          if (!registration.agentUid || registration.removedBy)
            continue;

          //load teams within firestore(), convert agentUid to teamName
          let primaryAttendArray = registration.primaryPerson.willAttendDay;
          let sumArray = [];
          let sumArrayChildren = [];
          for (let day=0; day < constants.campaignDays.length; day++) {
            sumArray[day] = primaryAttendArray[day] ? 1 : 0;
            sumArrayChildren[day] = 0;
            for (let participant of registration.participants){
              if (participant.ageGroup == "child")
                sumArrayChildren[day] += participant.willAttendDay[day] ? 1 : 0;
              else
                sumArray[day] += participant.willAttendDay[day] ? 1 : 0;
            }
          }
          for (let day=0; day < constants.campaignDays.length; day++) {
            if (sumArray[day]){ // (ignore childern here)
              if (!calendar[day][registration.agentUid]){
                // let team = that.teams.filter(t => t.ownerUid == registration.agentUid)[0]
                calendar[day][registration.agentUid] = {"adults": sumArray[day],
                  "children": sumArrayChildren[day],
                  "teamName": this.getRegistrationTeamName(registration.agentUid),
                  "agentUid": registration.agentUid,
                };
              }
              else{
                calendar[day][registration.agentUid].adults += sumArray[day];
                calendar[day][registration.agentUid].children +=  sumArrayChildren[day];
              }
            }
          }
        }
          // 3 Team-Kjetil hersvik + 2 barn

        return calendar;
      },
    },
    firestore () {
      if(getters.user().uid === constants.adminUid){
        return {
          registrations: db.collection("registrations"),
          teams: db.collection("teams") // disable BEFORE commit
        };
      }
    },
    methods: {
      getRegistrationTeamName(agentUid){
        let teamObject = this.teams.filter(t => t.ownerUid === agentUid)[0];
        let teamName = teamObject && teamObject.teamName || "";
        return teamName;
      },
      onTeamEdit(teamId){
        clearTimeout(this.whiteTimerId);
        this.$refs.teaminput[0].style.backgroundColor = "white";

        if(!this.hasQueuedSave){
          this.hasQueuedSave = true;
          setTimeout(() => {
            this.hasQueuedSave = false;
            this.saveTeam(teamId)
          }, 2000);
        }
      },
      saveTeam(teamId){
        let that=this;
        db.collection('teams')
            .doc(teamId)
            .set(
              {
                noteDay0: this.teams.filter(t => t.id == teamId)[0].noteDay0,
                ownerUid: this.getters.user().uid // for db write-permission.
              },
              {merge: true})
            .then(() => {
                that.$refs.teaminput[0].style.backgroundColor = "#cfc";
                  this.whiteTimerId = setTimeout(() => {
                    if(!this.hasQueuedSave)
                      that.$refs.teaminput[0].style.backgroundColor = "white";
                  }, 3000);
            })
            .catch(function(error){
              alert("Kunne ikke lagre team. ("+error+")")
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