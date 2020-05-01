<template>
  <div class="container container_under_nav">
    <h1>Påmeldinger</h1>

    <li class="list-group">
      <ul class="list-group-item">
        + <router-link :to="{path: 'registrering'}">
          Ny påmelding
        </router-link>
      </ul>
      <ul v-for="(registration) in chronologicalRegistrations" :key="registration.id" class="list-group-item">
        {{registration.isMostRecentEdited}}
        {{registration.created.toDate().toLocaleDateString()}}
        <router-link :to="{name: 'endreRegistrering', params:{id: registration.id} }">
          {{registration.primaryPerson.firstName}} {{registration.primaryPerson.lastName}} +({{registration.participants && registration.participants.length || 0}})
        </router-link>
        <span class="edited_tag">{{registration.displayEdited}}</span>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, setters, constants} from '../store';

  export default {
    beforeCreate() {
      setters.setActiveNav("pameldinger");
    },
    name: "ListRegistreringer",
    data () {
      return {
        registrations: []
      }
    },
    computed: {
      ...getters,
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

        // Sort a list copy, insert .dispayEdited and .isMostRecentEdited
        let copy = this.registrations.slice();
        for(let registration of copy){
          if(registration.edited.seconds !== registration.created.seconds){
            let hoursAgo = (Date.now() - registration.edited.toMillis())/1000/60/60/24;
            registration.displayEdited = "(endret " + hoursAgo.toFixed(1) + " dager siden)";

            registration.isMostRecentEdited = registration.id === uidMostRecentEdited
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

<style scoped>
  .edited_tag {
    opacity: 0.3;
  }
</style>