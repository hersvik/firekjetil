<template>
  <div class="container">
    <h1>Forespørsler</h1>

    <li class="list-group">
      <ul class="list-group-item">
        + <router-link :to="{path: 'wish'}">
          Ny forespørsel
        </router-link>
      </ul>
      <ul v-for="(wish) in wishes" :key="wish.id" class="list-group-item">
        <router-link :to="{name: 'endreWish', params:{id: wish.id} }">
          {{wish.event}}: {{wish.submitter.firstName}} +({{wish.target.firstName}})
        </router-link>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, constants} from '../store';

  export default {
    name: "ListWishes",
    data () {
      return {
        wishes: []
      }
    },
    computed: {
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