<template>
  <div class="container container_under_nav">
    <h1>Meld inn oppdrag</h1>

    <div v-if="wishes.length" class="alert alert-secondary bg-light mt-3" role="alert">
      <div class="mb-2"><strong>Takk for innmeldingen, den ligger i listen under og du kan redigere den!</strong></div>
      <span style="font-size: 2em; float:  left; margin-right: 0.5em;">
        🙏
      </span>
      Vi ber om forståelse for at vi ikke rekker over alle innmeldte oppdrag, men må gjøre et utvalg basert på hvor mange frivillige som er med. Vi tar kontakt ifm de oppdragene vi har mulighet til å utføre, og har dessverre ikke mulighet til å holde dere oppdaterte i prosessen med valg av oppdrag.
    </div>

    <li class="list-group">
      <ul class="list-group-item">
        + <router-link :to="{path: 'wish'}">
          Nytt oppdrag
        </router-link>
      </ul>
      <ul v-for="(wish) in chronologicalWishes" :key="wish.id" class="list-group-item" :class="{done: wish.done}">
        {{wish.isMostRecentEdited}}
        <span class="dot" v-if="wish.ownerUid === getters.user().uid"></span>
        {{wish.created.toDate().toLocaleDateString()}}
        <span v-if="wish.done"><strong>Utført </strong></span>
        <router-link :to="{name: 'endreWish', params:{id: wish.id} }">
          <em>{{wish.target.address}}</em>: <strong>{{wish.title}}</strong>  for {{wish.target.firstName}} {{wish.target.lastName}}
        </router-link>
        <span class="edited_tag">{{wish.displayEdited}} </span>
        <span v-if="getters.user().uid === constants.adminUid"><strong>{{getTeamName(wish.ownerUid)}} </strong></span>
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
      setters.setActiveNav("foresporsler");
    },
    created(){
      db.collection('teams') //       <----------  to be replaced in firestore method (tiems) !!! !!! !!!
      .get()
      .then(querySnapshot => {
        this.teams = querySnapshot.docs.map(doc => doc.data())
      })
    },
    name: "ListWishes",
    data () {
      return {
        wishes: [],
        teams: [],
        wishesWithAgentAccess: [],
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

        let combined = this.wishes.slice().concat(this.wishesOnlyAgentAcess.slice());
        let sorted = combined;
        sorted.sort((a, b) => {
          return a.created.seconds - b.created.seconds;
        });

        let copy = [];

        for(let i=0; i < sorted.length; i++){
          let wish = sorted[i];

          copy.push(wish)

          if(wish.edited.seconds !== wish.created.seconds){
            let hoursAgo = (Date.now() - wish.edited.toMillis())/1000/60/60/24;
            wish.displayEdited = "(endret " + hoursAgo.toFixed(1) + " dager siden)";

            wish.isMostRecentEdited = wish.id === uidMostRecentEdited
                                              ? "->"
                                              : "";
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
      getTeamName(agentUid){
        let teamObject = this.teams.filter(t => t.ownerUid === agentUid)[0];
        let teamName = teamObject && teamObject.teamName || "";
        return teamName;
      },
    }
  }
</script>

<style scoped>
  .edited_tag {
    opacity: 0.3;
  }
  .done {
    background-color: #f9f9f9;
  }

  .dot {
    height: 0.8em;
    width: 0.8em;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    margin: 0 0.2em;
  }
</style>