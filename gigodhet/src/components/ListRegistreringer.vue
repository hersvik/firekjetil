<template>
  <div class="container container_under_nav">
    <h1>Påmeldinger</h1>

    <li class="list-group">
      <ul class="list-group-item">
        + <router-link :to="{path: 'registrering'}">
          Ny påmelding
        </router-link>
        <small @click="showAll" class="show_removed" v-if="!showRemoved">[Inkluder fjernede]</small>
        <small @click="showAll" class="show_removed" v-if="showRemoved">[Skjul fjernede]</small>
      </ul>
      <ul v-for="(registration) in chronologicalRegistrations" :key="registration.id" class="list-group-item" :class="{faded_removed: registration.removedBy}">
        {{registration.isMostRecentEdited}}
        {{registration.created.toDate().toLocaleDateString()}}
        <router-link :to="{name: 'endreRegistrering', params:{id: registration.id} }">
          {{registration.primaryPerson.firstName}} {{registration.primaryPerson.lastName}} +({{registration.participants && registration.participants.length || 0}})
        </router-link>
        <span class="" v-if="registration.removedBy">Fjernet av {{registration.removedBy}} </span>
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
        registrations: [],
        showRemoved: false,
      }
    },
    computed: {
      getters: () => getters,
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

        // Copy of registrations list
        let copy = [];

        for (let i=0; i < this.registrations.length; i++) {
          let registration = this.registrations[i];
          if (this.showRemoved || !registration.removedBy) {
              copy.push(registration)
          }

          if (registration.edited.seconds !== registration.created.seconds) {

            let hoursAgo = (Date.now() - registration.edited.toMillis())/1000/60/60/24;
            registration.displayEdited = "(endret " + hoursAgo.toFixed(1) + " dager siden)"; // inserted property

            registration.isMostRecentEdited = registration.id === uidMostRecentEdited // inserted property
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
          registrations: db.collection("registrations")
        };
      }
      else if (getters.user().uid) {
        return {
          registrations: db.collection("registrations").where("ownerUid", "==", getters.user().uid)
        };
      }
    },
    methods: {
      showAll(){
        this.showRemoved = !this.showRemoved;
      }
    }
  }
</script>

<style scoped>
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
</style>