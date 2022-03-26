<template>
  <div v-if="!confirmedGeneralRegistration && !agent && !registration.id" class="container container_under_nav">
    <h1>Påmelding</h1>
    Er du med i en <strong>huskirke</strong>? Da må du kun melde deg på via spesial-lenke som du mottar fra din egen huskirke. Hvis du trykket på lenken fra huskirken før du fikk logget på godhetstavanger.no må du trykke en gang til nå for å melde deg på. <br>

    <br>
    <button class="btn btn-primary" @click="confirmedGeneralRegistration=true">Start påmelding - (<em>uten</em> huskirke)</button>
  </div>
  <div v-else class="container container_under_nav" :class="{readonly: isReadonly}">
    <router-link to="/regs">Tilbake</router-link>
    <h1>{{registration.event}}</h1>
    <h3>{{registration.id ? registration.primaryPerson.firstName+ ' + ' +registration.participants.length : "Påmelding"}}</h3>
    <br />
    <em> {{constants.dataDisclosure}} </em>

    <div v-if="team && team.teamName" class="alert alert-secondary bg-light mt-3" role="alert">
      👉 Du melder deg på via <em>{{team.teamName}}</em>
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
        Denne påmeldingen er deaktivert (skjult). Lagre på nytt for å gjennopprette.
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

        <div>
          <label>
            <strong>{{registration.primaryPerson.firstName || "Jeg"}}</strong> ønsker å delta:
          </label>
          <div v-for="(nVariableNotUsed, index) in constants.campaignDays.length" :key="index" class="day-checkbox">
            <input type="checkbox" v-model="registration.primaryPerson.willAttendDay[index]"> {{constants.campaignDays[index]}}
          </div>
          <br>
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input v-model="registration.primaryPerson.phone" class="form-control" placeholder="" type="number" />
        </div>
        <div v-if="!agent" class="form-group">
          <label>
            E-post
          </label>
          <input v-model="registration.primaryPerson.email" class="form-control" placeholder="" type="text" />
        </div>
        <div v-if="!agent" class="form-group">
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
      (Noen som skal delta sammen med deg og som vet at du herved melder dem på)
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
      <div>
        <label>
          <strong>{{participant.firstName || "Denne deltageren"}}</strong> ønsker å delta:
        </label>
        <div v-for="(nVariableNotUsed, index) in constants.campaignDays.length" :key="index" class="day-checkbox">
        <input type="checkbox" v-model="participant.willAttendDay[index]"> {{constants.campaignDays[index]}}
        </div>
      </div>
    </div>

    <div class="form-group mb-5">
      <button class="btn btn-light" @click="addParticipant">+ Legg til meddeltager</button>
    </div>

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

      <span v-if="id && !registration.removedBy" @click="removeRegistration" class="remove_registration clickable_label">[Skjul påmelding]</span>
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
    created(){
      db.collection('teams')
      .doc(this.agent)
      .get()
      .then(snapshot => {
        this.team = snapshot.data()
      })
    },
    name: "Registrering",
    props: ["id","agent"],
    data () {
      return {
        registration: {
          primaryPerson: {
            firstName: getters.authDisplayNameSplitted().firstName,
            lastName: getters.authDisplayNameSplitted().lastName,
            willAttendDay: new Array(constants.campaignDays.length).fill(false),
          },
          participants: [],
          dailyAttendance: [{}], // add {} for tuesday, etc
          event: "Godhet Stavanger 2021",
        },
        alreadyLoaded: false,
        watchedRegistration: {},
        confirmedGeneralRegistration: false,
        team: {},
      }
    },
    firestore () {
      if (this.id) {
        return {
          registration: db.collection("registrations").doc(this.id),
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
      },
      isReadonly(){
        return this.registration.ownerUid !== this.getters.user().uid
        && typeof this.registration.ownerUid !== 'undefined' // Nye påmeldinger er ikke readonly.
        && this.getters.user().uid !== this.constants.adminUid;
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
        this.registration.participants.push({willAttendDay: new Array(constants.campaignDays.length).fill(false)});
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
        this.registration.agentUid = this.agent || this.registration.agentUid || null;
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
            .catch(function(error){
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
        if( confirm("Vil du skjule påmeldingen? For å gjennopprette etterpå, klikk 'vis skjulte' i oversikten. (Administrator kan finne skjulte påmeldinger, men du kan tømme innholdet før du lagrer for å slette innholdet helt).") ){
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

  .readonly input, .readonly button, .readonly textarea, .readonly select {
    pointer-events: none;
    background-color: rgb(236, 236, 236);
  }
  .readonly .clickable_label {
    pointer-events: none;
  }
  .day-checkbox{
    margin-top: 0.3em;
  }
</style>