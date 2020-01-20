<template>
  <div class="container">
    <h1>Registrering  for giGodhet</h1>

    <form>
      <div class="form-group">
          <label>
            Fornavn
          </label>
          <input class="form-control" placeholder="Fornavn" type="text" v-model="registration.primaryPerson.firstName" />
          <small class="form-text text-muted">Deltager og kontaktperson</small>
      </div>
    </form>
    <!-- <div v-for="(enrolled, idx) in enrollment" :key="enrolled.id">
      Test enrollmemnt
      <input v-model="enrollment[idx].misc" @change="updateEnrollment(enrolled)"/>
    </div> -->

  </div>
</template>

<script>
  import { db } from '../main';

  export default {
    name: "Registrering",
    data () {
      return {
        // enrollment: []
        registration: {}
      }
    },
    firestore () {
      return {
        // enrollment: db.collection('enrollment')
        registration: db.collection("registrations").doc("2VyE4TitKwZXQWvisZsE")
      }
    },
    watch: {
      registration: function (){//(newReg) {

      }
    },
    methods: {
      updateEnrollment() { // (enrolled)
        // db.collection("enrollment").doc(enrolled.id).update({misc: enrolled.misc})
      }
    }
  }
</script>