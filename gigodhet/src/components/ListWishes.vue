<template>
  <div class="container container_under_nav">
    <h1>Forslag til Godhetsoppdrag</h1>

    <li class="list-group">
      <ul class="list-group-item">
        + <router-link :to="{path: 'wish'}">
          Nytt forslag
        </router-link>
      </ul>
      <ul v-for="(wish) in wishes" :key="wish.id" class="list-group-item">
        <router-link :to="{name: 'endreWish', params:{id: wish.id} }">
          <em>{{wish.submitter.firstName}} {{wish.submitter.lastName}}</em>: <strong>{{wish.title}}</strong>  for {{wish.target.firstName}} {{wish.target.lastName}}
        </router-link>
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
      ...getters,
    },
    firestore () {
      if(this.user.uid === constants.adminUid){
        return {
          wishes: db.collection("wishes")
        };
      }
      else if (this.user.uid) {
        return {
          wishes: db.collection("wishes").where("ownerUid", "==", this.user.uid)
        };
      }
    },
    methods: {

    }
  }
</script>