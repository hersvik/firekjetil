<template>
  <div class="container container_under_nav">
    <h1>Oppdrag 
      <span v-if="getters.user().uid === constants.adminUid">
        <router-link to="/teams">{Teamene}</router-link>
      </span>
    </h1>

    <div v-if="wishes.length" class="alert alert-secondary bg-light mt-3" role="alert">
      <div class="mb-2"><strong>Takk for innmeldingen, den ligger i listen under og du kan redigere den!</strong></div>
      <span style="font-size: 2em; float:  left; margin-right: 0.5em;">
        🙏
      </span>
      Vi ber om forståelse for at vi ikke rekker over alle innmeldte oppdrag, men må gjøre et utvalg basert på hvor mange frivillige som er med. Vi tar kontakt ifm de oppdragene vi har mulighet til å utføre, og har dessverre ikke mulighet til å holde dere oppdaterte i prosessen med valg av oppdrag.
    </div>

    <li class="list-group">
      <ul class="list-group-item">
        <router-link tag="button" class="btn btn-primary" :to="{path: '/wish'}">
          Foreslå nytt oppdrag
        </router-link>
      </ul>
      <ul v-if="getters.user().uid === constants.adminUid" class="list-group-item">
        <label style="color: #007bff; cursor: pointer;">
          <input type="radio" value="unassigned" v-model="statusesFilter">
          Vis ledige oppdrag
        </label><br>
        <label style="color: #007bff; cursor: pointer;">
          <input type="radio" value="assigned" v-model="statusesFilter">
          Vis fordelte oppdrag
        </label><br>
        <label style="color: #007bff; cursor: pointer;">
          <input type="radio" value="all" v-model="statusesFilter">
          Vis begge deler
        </label><br>
        <label style="opacity: 1; color: #007bff; cursor: pointer;">
          <input type="radio" value="discarded" v-model="statusesFilter">
          Satt tilside
        </label>
      </ul>
      <ul v-for="(wish) in chronologicalWishes" :key="wish.id" class="list-group-item" :class="{done: wish.done}">
        <span class="dot" v-if="wish.isMostRecentEdited"></span>
        {{wish.created.toDate().toLocaleDateString()}}<span v-if="wish.ownerUid === getters.user().uid">.</span>
        <span v-if="wish.done"><strong> Utført </strong></span>
        <router-link :to="{name: 'endreWish', params:{id: wish.id} }">
          <em> {{wish.target.address || "ingen adresse"}}</em>: <strong>{{wish.title || "(mangler overskrift)"}}</strong>   {{wish.target.firstName || wish.target.lastName ? "for " + (wish.target.firstName || "") + " " + (wish.target.lastName || "") : ""}}
        </router-link>
        <span class="edited_tag">{{wish.displayEdited}} </span>

        <span v-if="getters.user().uid === constants.adminUid" v-tooltip:top="'Admin-status (intern)'">{{wish.status}}</span>
        <div style="text-align: right">
          <span v-if="getters.user().uid === constants.adminUid"><strong><router-link :to="{name: 'dashTeamid', params:{teamid: wish.agentUid}}" style="color: black">{{getTildeltTeamName(wish.agentUid)}} </router-link> </strong></span>
          <span v-if="getters.user().uid === wish.agentUid"><strong> Tildelt Ditt team </strong></span>
        </div>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, setters, constants} from '../store';
  import router from '../router';

  export default {
    beforeCreate() {
      setters.setActiveNav("foresporsler");
    },
    created(){
      this.statusesFilter = this.statuses;
      db.collection('teams') //       <----------  to be replaced in firestore method (tiems) !!! !!! !!!
      .get()
      .then(querySnapshot => {
        this.teams = querySnapshot.docs.map(doc => doc.data())
      })
    },
    name: "ListWishes",
    props: ["statuses"],
    data () {
      return {
        wishes: [],
        teams: [],
        wishesWithAgentAccess: [],
        statusesFilter: undefined,
      }
    },
    computed: {
      constants(){
        return constants;
      },
      getters: () => getters,
      wishesOnlyAgentAcess() {
        return this.wishesWithAgentAccess.filter(r => r.ownerUid !== getters.user().uid);
      },
      chronologicalWishes() {
        if (!this || !this.wishes) {
          return;
        }

        let combined = this.wishes.slice().concat(this.wishesOnlyAgentAcess.slice());
        let sorted = combined;
        sorted.sort((a, b) => {
          return a.created.seconds - b.created.seconds;
        });

        // Find most recently edited
        let uidRecentEdit;
        let secondsRecentEdit = 0;
        for(let wish of combined){
          if(wish.edited && wish.edited.seconds > secondsRecentEdit) {
            secondsRecentEdit = wish.edited.seconds;
            uidRecentEdit = wish.id;
          }
        }
        let uidMostRecentEdited = uidRecentEdit;

        let copy = [];

        for(let i=0; i < sorted.length; i++){
          let wish = sorted[i];
          let isIncluded = this.statusesFilter === "all" 
                        || this.statusesFilter === "assigned" && wish.agentUid 
                        || this.statusesFilter === "unassigned" && !wish.agentUid;
          if (!wish.isDiscarded && isIncluded || this.statusesFilter === "discarded" && wish.isDiscarded) {
              copy.push(wish)
          }
          else{
            continue;
          }

          if(wish.edited.seconds !== wish.created.seconds){
            let hoursAgo = (Date.now() - wish.edited.toMillis())/1000/60/60/24;
            wish.displayEdited = "(endret " + hoursAgo.toFixed(1) + " dager siden av "+ wish.lastUpdatedBy +")";

            wish.isMostRecentEdited = wish.id === uidMostRecentEdited;
          }
        }
        return copy.sort((a, b) => {
          return a.created.seconds - b.created.seconds;
        });
      },
    },
    firestore () {
      if(getters.user().uid === constants.adminUid){
        return {
          wishes: db.collection("wishes")
        };
      }
      else if (getters.user().uid) {
        return {
          wishes: db.collection("wishes").where("ownerUid", "==", getters.user().uid),
          wishesWithAgentAccess: db.collection("wishes").where("agentUid", "==", getters.user().uid)
        };
      }
    },
    methods: {
      getTildeltTeamName(agentUid){
        let teamObject = this.teams.filter(t => t.ownerUid === agentUid)[0];
        let teamName = teamObject && teamObject.teamName || "";
        if(!teamName) return "";
        return "tildelt " + teamName;
      },
    },
    watch: {
      statusesFilter: function(activeStatuses) {
        
        if (activeStatuses === this.statuses)
          return;
        
        if (activeStatuses === "all") {
          router.replace("/wishes");
        }
        else if (activeStatuses === "assigned") {
          router.replace("/wishes/assigned");
        }
        else if (activeStatuses === "unassigned") {
          router.replace("/wishes/unassigned");
        }
        else if (activeStatuses === "discarded") {
          router.replace("/wishes/discarded");
        }
      },
    },
  }
</script>

<style scoped>
  .edited_tag {
    opacity: 0.3;
  }
  .done {
    background-color: #fff6ff;
  }

  .dot {
    height: 0.8em;
    width: 0.8em;
    background-color: rgb(148, 207, 252);
    border-radius: 50%;
    display: inline-block;
    margin: 0 0.2em;
  }
</style>