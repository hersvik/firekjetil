<template>
  <div>
    <button>Registrering  for giGodhet</button>
    <div>
      <div>
        Deltakende kontaktperson
      </div>
      <div>
        Fornavn: <input type="text" v-model="registration.primaryPerson.firstName" />
      </div>
    </div>
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