<template>
  <div class="container container_under_nav">
    <h1>Gi forslag til Godhetsoppdrag</h1>

    <li class="list-group">
      <ul class="list-group-item">
        + <router-link :to="{path: 'wish'}">
          Nytt forslag
        </router-link>
      </ul>
      <ul v-for="(wish) in chronologicalWishes" :key="wish.id" class="list-group-item">
        {{wish.isMostRecentEdited}}
        {{wish.created.toDate().toLocaleDateString()}}
        <router-link :to="{name: 'endreWish', params:{id: wish.id} }">
          <em>{{wish.submitter.firstName}} {{wish.submitter.lastName}}</em>: <strong>{{wish.title}}</strong>  for {{wish.target.firstName}} {{wish.target.lastName}}
        </router-link>
        <span class="edited_tag">{{wish.displayEdited}} </span>
        <span v-if="true || user.uid === constants.adminUid" v-tooltip:top="'Admin-status'">{{wish.status}}</span>
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
    name: "ListWishes",
    data () {
      return {
        wishes: []
      }
    },
    computed: {
      constants(){
        return constants;
      },
      getters: () => getters,
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

        // Sort a list copy, insert .dispayEdited and .isMostRecentEdited
        let copy = this.wishes.slice();
        for(let wish of copy){
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
          wishes: db.collection("wishes").where("ownerUid", "==", getters.user().uid)
        };
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  .edited_tag {
    opacity: 0.3;
  }
</style>