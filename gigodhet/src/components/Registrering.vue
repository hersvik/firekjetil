<template>
  <div class="container">
    <router-link to="/">Tilbake</router-link>
    <h1>{{registration.event || "Godhet Stavanger 2020"}}</h1>

    <form>
      <div class="form-group">
          <label>
            Fornavn
          </label>
          <input v-model="registration.primaryPerson.firstName" class="form-control" placeholder=" - Fornavn -" type="text" />
          <small class="form-text text-muted">Deltager og kontaktperson</small>
      </div>
    </form>
    <!-- <div v-for="(enrolled, idx) in enrollment" :key="enrolled.id">
      Test enrollmemnt
      <input v-model="enrollment[idx].misc" @change="updateEnrollment(enrolled)"/>
    </div> -->

    <button @click="save">Lagre</button>
  </div>
</template>

<script>
  import { db } from '../main';

  export default {
    name: "Registrering",
    props: ["id"],
    data () {
      return {
        registration: {
          primaryPerson: ""
        }
      }
    },
    firestore () {
      if (this.id) {
        return {
          registration: db.collection("registrations").doc(this.id)
        }
      }
    },
    watch: {
      registration: function (){//(newReg) {

      }
    },
    methods: {
      updateEnrollment() { // (enrolled)
        // db.collection("enrollment").doc(enrolled.id).update({misc: enrolled.misc})
      },
      save() {
        db.collection("registrations").doc(this.id).update({
          "primaryPerson.firstName": this.registration.primaryPerson.firstName
        })
        .then(function(){
          alert("Lagret OK")
        })
        .catch(function(error){ // trenger å verifiseres
          alert("Kunne ikke lagre. ("+error+")")
        })
      }
    }
  }
</script>