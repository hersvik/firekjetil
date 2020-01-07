<template>
  <div>
    <h1>Registrering  for giGodhet</h1>
    <div v-for="(enrolled, idx) in enrollment" :key="idx">
      {{ enrolled.misc }}
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
    }
  }
</script>