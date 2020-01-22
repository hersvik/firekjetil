<template>
  <div class="container">
    <h1>Oversikt</h1>

    <li class="list-group">
      <ul class="list-group-item">
        <router-link :to="{path: 'registrering'}">
          Ny påmelding
        </router-link>
      </ul>
      <ul v-for="(registration) in registrations" :key="registration.id" class="list-group-item">
        <router-link :to="{name: 'endreRegistrering', params:{id: '2VyE4TitKwZXQWvisZsE'} }"> <!--hardcoded id-->
          {{registration.event}}: {{registration.primaryPerson.firstName}} +({{registration.participants.length}})
        </router-link>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';

  export default {
    name: "Overview",
    data () {
      return {
        registrations: []
      }
    },
    firestore () {
      return {
        registrations: db.collection("registrations")
      }
    },
    methods: {

    }
  }
</script>