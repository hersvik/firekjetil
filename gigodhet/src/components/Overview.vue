<template>
  <div class="container">
    <h1>Oversikt</h1>

    <li class="list-group">
      <ul class="list-group-item">
        -> <router-link :to="{path: 'registrering'}">
          Ny påmelding
        </router-link>
      </ul>
      <ul v-for="(registration) in registrations" :key="registration.id" class="list-group-item">
        <router-link :to="{name: 'endreRegistrering', params:{id: registration.id} }"> <!--hardcoded id-->
          {{registration.event}}: {{registration.primaryPerson.firstName}} +({{registration.participants && registration.participants.length || 0}})
        </router-link>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, constants} from '../store';

  export default {
    name: "Overview",
    data () {
      return {
        registrations: []
      }
    },
    computed: {
      ...getters,
    },
    firestore () {
      if(this.user.uid === constants.adminUid){
        return {
          registrations: db.collection("registrations")
        };
      }
      else if (this.user.uid) {
        return {
          registrations: db.collection("registrations").where("ownerUid", "==", this.user.uid)
        };
      }
    },
    methods: {

    }
  }
</script>