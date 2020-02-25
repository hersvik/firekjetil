<template>
  <div class="container">
    <router-link to="/">Tilbake</router-link>
    <h1>{{registration.event || "Godhet Stavanger 2020"}}</h1>

    <form>
      <div class="bg-light p-2">
        <small class="form-text text-muted">Deltager og kontaktperson (i løpet av Godhet)</small>
        <div class="form-group">
            <label>
              Fornavn
            </label>
            <input v-model="registration.primaryPerson.firstName" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
            <label>
              Etternavn
            </label>
            <input v-model="registration.primaryPerson.lastName" class="form-control" placeholder="" type="text" />
        </div>

        <div class="form-group">
            <label>
              Aldersgruppe
            </label>
            <select v-model="registration.primaryPerson.ageGroup" class="custom-select">
              <option selected>-  Velg -</option>
              <option value="adult">Voksen</option>
              <option value="childUnder10">Barn under 10</option>
            </select>
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input v-model="registration.primaryPerson.phone" class="form-control" placeholder=" - 8 siffer -" type="number" />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input v-model="registration.primaryPerson.email" class="form-control" placeholder="- xxx@xxx.xx -" type="text" />
        </div>
        <div class="form-group">
            <label>
              Adresse, postnummer og -sted
            </label>
            <input v-model="registration.primaryPerson.address" class="form-control" placeholder=" - Solvegen 99, 4099 -" type="text" />
        </div>

      </div>

      <div class="form-group form-check mt-4 mb-5">
        <input class="form-check-input" type="checkbox" v-model="registration.familiegodhet">
        <label class="form-check-label">
          Familiegodhet (for barnefamilier)
        </label>
      </div>
      <div class="form-group">
        <label>
          (Evt.) Tilhørighet
        </label>
        <input v-model="registration.belonging" class="form-control" placeholder=" - Menighet / huskirke / ledere(e) / el.l. -" type="text" />
      </div>
      <div class="form-group">
        <label>
          (Evt.) kompetanser
        </label>
        <input v-model="registration.competancies" class="form-control" placeholder=" - Eks. 1 person blomsterspesialist -" type="text" />
      </div>
    </form>

    <div>
      <h2>Meddeltagere</h2>
    </div>
    <div v-for="(participant, idx) in registration.participants" :key="idx" class="bg-light p-2 mb-2">
      <small class="form-text text-muted">Meddeltager {{idx + 1}}</small>
      <div class="form-group">
          <label>
            Fornavn
          </label>
          <input v-model="participant.firstName" class="form-control" placeholder=" - Fornavn -" type="text" />
      </div>
      <div class="form-group">
        <label>
          Etternavn
        </label>
        <input v-model="participant.lastName" class="form-control" placeholder=" - Etternavn -" type="text" />
      </div>
      <div class="form-group">
        <label>
          Aldersgruppe
        </label>
        <select v-model="participant.ageGroup" class="custom-select">
          <option selected>-  Velg -</option>
          <option value="adult">Voksen</option>
          <option value="childUnder10">Barn under 10</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <button class="btn btn-light" @click="addParticipant">+ Legg til gruppedeltager</button>
    </div>

    <div class="form-row">
      <div class="col">
      </div>
      <div class="col">
        Antall voksne
      </div>
    </div>
    <div class="form-row">
      <div class="col">
        Mandag
      </div>
      <div class="col">
        <select v-model="registration.dailyAttendance[0].adult" class="custom-select">
          <option v-for="(p, idx) in adultNumberSelection" :key="idx">{{idx}}</option>
        </select>
      </div>
    </div>

    <div class="form-group mt-4">
      <label>
        (Evt.) annet / kommentar
      </label>
      <textarea v-model="registration.misc" class="form-control" type="text">
      </textarea>
    </div>

    <div class="form-group">
      <button class="btn btn-primary" @click="save">Lagre</button>
    </div>

  </div>

</template>

<script>
  import { db } from '../main';
  import { getters } from '../store';

  export default {
    name: "Registrering",
    props: ["id"],
    data () {
      return {
        registration: {
          primaryPerson: {},
          participants: [],
          dailyAttendance: [{}], // add {} for tuesday, etc
          event: "Godhet Stavanger 2020",
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
    computed: {
      ...getters,
      adultNumberSelection: function() {
        let result= this.registration.participants.filter(el => el.ageGroup == 'adult');
        result.push({});
        if (this.registration.primaryPerson.ageGroup == 'adult') {
          result.push({});
        }
        return result;
      }
    },
    // watch: {
    //   registration: function (){//(newReg) {

    //   }
    // },
    methods: {
      updateEnrollment() { // (enrolled)
        // db.collection("enrollment").doc(enrolled.id).update({misc: enrolled.misc})
      },
      addParticipant() {
        this.registration.participants.push({});
      },
      save() {

        this.registration.ownerUid = this.registration.ownerUid || this.user.uid;

        if (this.id) {
          // db.collection("registrations").doc(this.id).update({
          //   "primaryPerson.firstName": this.registration.primaryPerson.firstName,
          // })
          const registration= { ...this.registration} // to exclude non-enumerable "id"-property

          db.collection('registrations')
            .doc(this.id)
            .set(registration)
            .then(() => {
              this.$router.push("/")
            })
            .catch(function(error){ // trenger å verifiseres
              alert("Kunne ikke lagre. ("+error+")")
            });
        }
        else {
          db.collection("registrations").add(this.registration)
            .then(() => {
              this.$router.push("/");
            });
        }

      }
    }
  }
</script>