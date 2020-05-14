<template>
  <div class="container container_under_nav">
    <router-link to="/regs">Tilbake</router-link>
    <h1>{{registration.event || "Godhet Stavanger 2020"}}</h1>
    <h3>{{registration.id ? registration.primaryPerson.firstName+ ' + ' +registration.participants.length : "Påmelding"}}</h3>
    <br />
    <em> {{constants.dataDisclosure}} </em>

    <div v-if="!registration.id" class="alert alert-secondary bg-light mt-3" role="alert">
      👉 Av hensyn til smittevernregler kobles man på en leder for en gruppe som har ansvar for gjengen. <br>
      Hvis du er med i en <strong>huskirke</strong> i IMI-kirken som deltar på Godhet skal du i utgangspunktet ikke melde deg på her.
    </div>

    <form>
      <div v-if="getters.user().uid === constants.adminUid" class="alert alert-dark bg-secondary text-white mt-4">
        <label>
          Intern kommentar (...husk å lagre)
        </label>
        <input v-model="registration.status" class="form-control" type="text">

        <a v-for="(ref, idx) in registration.missionDay0" :key="ref" :href="'/wish/'+ref" class="mt-4" style="display: block; color:white;" target="_blank">Åpne tildelt oppdrag nummer {{idx+1}}</a>
      </div>


      <div v-if="registration.removedBy" class="alert alert-danger">
        Denne påmeldingen er deaktivert (fjernet). Lagre på nytt for å gjennopprette.
      </div>
      <div class="bg-light p-2">
        <small class="form-text text-muted">Deltager (enkeltperson eller gruppeleder)</small>
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
              Aldersgruppe*
            </label>
            <select v-model="registration.primaryPerson.ageGroup" class="custom-select">
              <option selected>-  Velg -</option>
              <option value="adult">Voksen</option>
              <option value="child">Barn (til og med 7. klasse)</option>
            </select>
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input v-model="registration.primaryPerson.phone" class="form-control" placeholder="" type="number" />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input v-model="registration.primaryPerson.email" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
            <label>
              Adresse, postnummer og -sted
            </label>
            <input v-model="registration.primaryPerson.address" class="form-control" placeholder="" type="text" />
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
          Tilhørighet (valgfritt)
        </label>
        <input v-model="registration.belonging" class="form-control" placeholder=" ~ Menighet / huskirke / leder(e) / el.l. ~" type="text" />
      </div>
      <div class="form-group">
        <label>
          Kompetanser (valgfritt)
        </label>
        <input v-model="registration.competancies" class="form-control" placeholder=" ~ Eksempelvis: 1 person blomsterspesialist ~" type="text" />
      </div>
    </form>

    <div class="mt-5">
      <h2>Meddeltagere</h2>
    </div>
    <div v-for="(participant, idx) in registration.participants" :key="idx" class="bg-light p-2 mb-2">
      <small class="form-text text-muted" style="display: inline;">Meddeltager {{idx + 1}} </small><small class="clickable_label" @click="removeGroupMember(idx)">[Fjerne]</small>
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
          Aldersgruppe*
        </label>
        <select v-model="participant.ageGroup" class="custom-select">
          <option selected>-  Velg -</option>
          <option value="adult">Voksen</option>
          <option value="child">Barn (til og med 7. klasse)</option>
        </select>
      </div>
    </div>

    <div class="form-group mb-5">
      <button class="btn btn-light" @click="addParticipant">+ Legg til gruppedeltager</button>
    </div>

    <div v-if="constants.hasDailyAttendanceFeature" class="form-row">
      <div class="col">
      </div>
      <div class="col">
        Antall voksne
      </div>
    </div>
    <div v-if="constants.hasDailyAttendanceFeature" class="form-row">
      <div class="col">
        Mandag
      </div>
      <div class="col">
        <select v-model="registration.dailyAttendance[0].adult" class="custom-select">
          <option v-for="(p, idx) in adultNumberSelection" :key="idx">{{idx}}</option>
        </select>
      </div>
    </div>

    Hvilke dager i godhetsuka man ønsker å delta avtales i år primært med godhetslederen i huskirka eller leder for oppdraget du får tildelt, men du kan skrive en kommentar om det her.
    <div class="form-group mt-4 mb-5">
      <label>
        Eventuelt annet / kommentar
      </label>
      <textarea v-model="registration.misc" class="form-control" type="text" rows="3">
      </textarea>
    </div>

    {{constants.welcomeUnfinishedFormMessage}}
    <div class="form-group">
      <button v-if="!registration.removedBy" class="btn btn-primary" @click="save">Lagre og lukk</button>
      <button v-if="registration.removedBy" @click="save(true)" class="btn btn-primary">Lagre og gjenopprett</button>

      <span v-if="id && !registration.removedBy" @click="removeRegistration" class="remove_registration clickable_label">[Fjern påmelding]</span>
    </div>

    *) Deltagere fra 8. klasse og ut videregående skole meldes på via ungdom@imikirken.no (Join)

  </div>

</template>

<script>
  import { db } from '../main';
  import { getters, setters, constants } from '../store';

  export default {
    beforeCreate() {
      setters.setActiveNav("pameldinger");
    },
    name: "Registrering",
    props: ["id"],
    data () {
      return {
        registration: {
          primaryPerson: {
            firstName: getters.authDisplayNameSplitted().firstName,
            lastName: getters.authDisplayNameSplitted().lastName,
          },
          participants: [],
          dailyAttendance: [{}], // add {} for tuesday, etc
          event: "Godhet Stavanger 2020",
        },
        alreadyLoaded: false,
        watchedRegistration: {},
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
      constants() {
        return constants;
      },
      getters(){
        return getters;
      },
      adultNumberSelection: function() {
        let result= this.registration.participants.filter(el => el.ageGroup == 'adult');
        result.push({});
        if (this.registration.primaryPerson.ageGroup == 'adult') {
          result.push({});
        }
        return result;
      }
    },
    watch: {
      registration: function (entry){
        entry.edited = null;
        this.watchedRegistration.edited = null;
        if (this.alreadyLoaded
          && JSON.stringify(entry) !== JSON.stringify(this.watchedRegistration) ){
            alert("Opplysningene i skjemaet ble endret utenfra og innholdet du ser oppdateres automatisk. \n\nEksisterende innhold i skjemaet blir dermed erstattet nå. \n\n(Når du lagrer, oppdateres visningen umiddelbart hos andre som ser på også)");
        }
        this.alreadyLoaded = true;
        this.watchedRegistration = entry;
      }
    },
    methods: {
      updateEnrollment() { // (enrolled)
        // db.collection("enrollment").doc(enrolled.id).update({misc: enrolled.misc})
      },
      addParticipant() {
        this.registration.participants.push({});
      },
      removeGroupMember(idx) {
        if(confirm("Vil du fjerne meddeltager nummer "+(idx+1)+"? \n\nHusk å også bruke lagre-knappen nederst i skjema for å bekrefte endringer. ")){
          this.registration.participants.splice(idx, 1);
        }
      },

      save (wantReactivation) {

        if(wantReactivation){
          this.registration.removedBy = "";
        }
        this.alreadyLoaded = false; // Avoids watch alert
        this.registration.ownerUid = this.registration.ownerUid || getters.user().uid;
        this.registration.created = this.registration.created || new Date();
        this.registration.edited = new Date();

        if (this.id) {
          // db.collection("registrations").doc(this.id).update({
          //   "primaryPerson.firstName": this.registration.primaryPerson.firstName,
          // })
          const registration= { ...this.registration} // to exclude non-enumerable "id"-property

          db.collection('registrations')
            .doc(this.id)
            .set(registration, {merge: true})
            .then(() => {
              this.$router.push("/regs")
            })
            .catch(function(error){ // trenger å verifiseres
              alert("Kunne ikke lagre. ("+error+")")
            });
        }
        else {
          db.collection("registrations").add(this.registration)
            .then(() => {
              this.$router.push("/regs");
            });
        }

      },
      removeRegistration() {
        if( confirm("Vil du fjerne påmeldingen? For å gjennopprette etterpå, klikk 'Inkluder fjernede' i oversikten. (Felter som tømmes kan ikke hentes frem av noen).") ){
          this.alreadyLoaded = false;
          db.collection('registrations').doc(this.id).update({
            removedBy: getters.user().displayName,
            edited: new Date(),
          });
          this.$router.push("/regs");
        }
      },
    }
  }
</script>

<style scoped>
  .remove_registration {
    margin-left: 2em;
    opacity: 0.5;
  }
  .clickable_label {
    cursor: pointer;
  }
</style>