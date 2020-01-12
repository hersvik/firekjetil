<template>
  <div>
    <h1>Registrering  for giGodhet</h1>
    <div v-for="(enrolled, idx) in enrollment" :key="enrolled.id">
      {{ enrolled.misc }}
      <input v-model="enrollment[idx].misc" @change="updateEnrollment(enrolled)"/>
    </div>
  </div>
</template>

<script>
  import { db } from '../main';

  export default {
    name: "Registrering",
    data () {
      return {
        enrollment: []
      }
    },
    firestore () {
      return {
        enrollment: db.collection('enrollment')
      }
    },
    methods: {
      updateEnrollment(enrolled) {

        db.collection("enrollment").doc(enrolled.id).update({misc: enrolled.misc})
      }
    }
  }
</script>