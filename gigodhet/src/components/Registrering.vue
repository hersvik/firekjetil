<template>
  <div v-if="!confirmedGeneralRegistration && !agent && !registration.id" class="container container_under_nav">
    <h1>Påmelding</h1>
    <div v-if="!confirmedHasCustomLink">
      Er du med i en <strong>huskirke</strong>? I så fall trenger du din huskirkes egen spesial-lenke for å melde deg på.  <!--Uansett om du allerede har trykket på lenken fra huskirken (før du fikk logget på godhetstavanger.no), må du trykke på lenken nå for å melde deg på.--><br>
      <button class="btn btn-primary" @click="confirmedHasCustomLink=true">Jeg har spesial-lenken fra huskirken</button>
      <br>
      Snakk med "Godhetsagenten" i din huskirke for å eventuelt få en slik lenke.<br>
      <h5 style="margin-top: 1em;">Ikke med i huskirke</h5>
      <button class="btn btn-primary" @click="confirmedGeneralRegistration=true">Start vanlig påmelding, uten huskirke</button>
    </div>
    <div v-else>
       Bra, trykk på den lenken du har fått fra din huskirke (igjen) nå.
    </div>
  </div>
  <div v-else class="container container_under_nav" :class="{readonly: false}">
    <a @click="$router.go(-1)">Tilbake</a>
    <!-- <router-link to="/regs">Tilbake</router-link> -->
    <h1>{{registration.event}}</h1>
    <h3>{{registration.id ? registration.primaryPerson.firstName+ ' + ' +registration.participants.length : "Påmelding"}}</h3>
    <div style="color: #6c757d; margin-bottom: 1em;" v-if="registration.created">Opprettet {{registration.created.toDate().toLocaleDateString()}}</div>
    <div style="color: #6c757d; margin-bottom: 1em;" v-if="registration.lastUpdatedBy">(Sist endret av {{registration.lastUpdatedBy}})</div>
    <em style="margin-bottom: 2em"> {{constants.dataDisclosure}} </em>

    <div v-if="team && team.teamName" class="alert alert-secondary bg-light mt-3" role="alert">
      👉 Dette er en ny påmelding direkte til <em>{{team.teamName || "(Feil med team-navn)"}}</em>. <router-link to="/regs">Til annen påmelding</router-link>
    </div>
    <div v-if="agent && !team" class="alert alert-secondary bg-light mt-3" role="alert">
      🔺 <em>Feil med lenken du brukte. Prøv på nytt eller be om ny lenke.</em>
    </div>

    <form>
      <div v-if="getters.user().uid === constants.adminUid" class="alert alert-dark bg-secondary text-white mt-4">
        <label>
          Intern kommentar (...husk å sende)
        </label>
        <input v-model="registration.status" class="form-control" type="text">
        <div style="color: black">{{ registration.status }}</div> 
        <br>
        <label>
          Team
        </label>
        <select v-model="registration.agentUid" class="custom-select">
          <option value="">-  Uten team -</option>
          <option v-for="(team, idx) in teams" :key="idx" :value="team.ownerUid">{{team.teamName}}</option>
        </select>
        <router-link :to="{name: 'dashTeamid', params:{teamid: registration.agentUid}}" style="background-color: white;">{{teamName}} </router-link>

        
      </div>


      <div v-if="registration && registration.agentUid" class="alert alert-secondary bg-light mt-3" role="alert">
        Tilhørighet: <em>{{teamName || "ikke funnet"}}</em>. 
      </div>
      <div v-if="registration.removedBy" class="alert alert-danger">
        Denne påmeldingen er deaktivert. Send på nytt for å gjennopprette.
      </div>
      <div class="bg-light p-2 mt-3">
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
              Aldersgruppe <span class="text-muted">(Ungdom: se fotnote *)</span>
            </label>
            <select v-model="registration.primaryPerson.ageGroup" class="custom-select">
              <option selected>-  Velg -</option>
              <option value="adult">Voksen</option>
              <option value="child" disabled>Barn (til og med 7. klasse) - se meddeltager under)</option>
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

        <div>
          <label>
            <strong>{{registration.primaryPerson.firstName || "Jeg"}}</strong> ønsker å:
          </label>
          <div class="day-checkbox">
            <input type="checkbox" v-model="registration.primaryPerson.wantDinnerMonday"> Spise på IMI mandag
          </div>
          <div class="day-checkbox">
            <input type="checkbox" v-model="registration.primaryPerson.wantDinnerTuesday"> Spise på IMI tirsdag
          </div>
          <div class="day-checkbox">
            <input type="checkbox" v-model="registration.primaryPerson.wantDinnerWednesday"> Spise på IMI onsdag
          </div>
          <div class="mt-2" style="color: #6c757d">
          "10 kr for pølse. 50kr for middag og ikke mer enn 200kr pr familie"
          </div>
          <div class="day-checkbox" style="margin-top: 1em">
            <input type="checkbox" v-model="registration.primaryPerson.glutenFree"> Trenger glutenfri mat
          </div>
          <div class="day-checkbox">
            <input type="checkbox" v-model="registration.primaryPerson.lactoseFree"> Trenger laktosefri mat
          </div>
          <br>
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input v-model="registration.primaryPerson.phone" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input v-model="registration.primaryPerson.email" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
            <label>
              Bosted /bydel
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
      <div v-if="!agent" class="form-group">
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
      (Noen som skal delta sammen med deg og som vet at du herved melder dem på, uten selvstendig kontaktinfo. For mer utfyllende påmelding, kan du sende inn separate påmeldinger for dem.)
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
          Aldersgruppe <span class="text-muted">(Ungdom: se fotnote *)</span>
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
      <br>
      <div>
          <label>
            <strong>{{participant.firstName || "Denne deltageren"}}</strong> ønsker å:
          </label>
          <div class="day-checkbox">
            <input type="checkbox" v-model="participant.wantDinnerMonday"> Spise på imi mandag
          </div>
          <div class="day-checkbox">
            <input type="checkbox" v-model="participant.wantDinnerTuesday"> Spise på imi tirsdag
          </div>
          <div class="day-checkbox">
            <input type="checkbox" v-model="participant.wantDinnerWednesday"> Spise på imi onsdag
          </div>


          <div class="day-checkbox" style="margin-top: 1em">
            <input type="checkbox" v-model="participant.glutenFree"> Trenger glutenfri mat
          </div>
          <div class="day-checkbox">
            <input type="checkbox" v-model="participant.lactoseFree"> Trenger laktosefri mat
          </div>
          <br>
        </div>

    </div>

    <div class="form-group mb-5">
      <button class="btn btn-light" @click="addParticipant">+ Legg til ny meddeltager</button>
    </div>

    <div class="form-group mt-4 mb-5">
      <label>
        Eventuelt annet / kommentar
      </label>
      <textarea v-model="registration.misc" class="form-control" type="text" rows="3">
      </textarea>
    </div>

    Informasjonen trenger ikke være fullstendig i første omgang 😀 Vi foretrekker tidlig info og evt. en ekstra oppdatering ved behov 👍
    <div v-if="!(agent && !team)" class="form-group"><!-- agent && !team means error with team link, see user warning above-->
      <button v-if="!registration.removedBy" class="btn btn-primary" @click="save" :disabled="!this.isEdited">
        Send
      </button>
      <button v-if="registration.removedBy" @click="save(true)" class="btn btn-primary">
        Gjenopprett og send
      </button>

      <span v-if="id && !registration.removedBy" @click="removeRegistration" class="remove_registration clickable_label">
        [Deaktiver påmelding]
      </span>
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
      if(this.agent){
        db.collection('teams')
        .doc(this.agent)
        .get()
        .then(snapshot => {
          this.team = snapshot.data()
        });
      }
      db.collection('teams').orderBy("teamName", "asc")
      .get()
      .then(querySnapshot => {
        this.teams = querySnapshot.docs.map(doc => doc.data())
      })
    },
    mounted(){
      this.registration.primaryPerson.email = this.registration.primaryPerson.email || this.getters.user().email;
      console.log("Påmelding", this.id, "- åpnet", new Date().toLocaleTimeString());
    },
    beforeUpdate(){
      this.registration.agentUid = this.registration.agentUid || this.agent;
    },
    name: "Registrering",
    props: ["id","agent"],
    data () {
      return {
        registration: {
          lastUpdatedBy: "",
          primaryPerson: {
            firstName: getters.authDisplayNameSplitted().firstName,
            lastName: getters.authDisplayNameSplitted().lastName,
            willAttendDay: new Array(constants.campaignDays.length).fill(false),
          },
          participants: [],
          dailyAttendance: [{}], // add {} for tuesday, etc
          event: "Godhet Stavanger 2024",
          agentUid: "",
        },
        alreadyLoaded: false,
        isEdited: false,
        saveClicked: false,
        watchedRegistration: {},
        watchedStringifiedReg: "",
        confirmedGeneralRegistration: false,
        confirmedHasCustomLink: false,
        team: {},
        teams: [],
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
      teamName(){
        let teamsFiltered = this.teams.filter(t => t.ownerUid === this.registration.agentUid);
        if (teamsFiltered.length !== 1 || !teamsFiltered[0].teamName)
          return null;
        return teamsFiltered[0].teamName;
      },
      stringifiedTimelessReg(){
        let timelessReg = {...this.registration};
        timelessReg.edited = null;
        timelessReg.agentUid = timelessReg.agentUid || this.agent || "";
        return JSON.stringify(timelessReg);
      },
      adultNumberSelection: function() {
        let result= this.registration.participants.filter(el => el.ageGroup == 'adult');
        result.push({});
        if (this.registration.primaryPerson.ageGroup == 'adult') {
          result.push({});
        }
        return result;
      },
      // isReadonly(){
      //   return this.registration.ownerUid !== this.getters.user().uid // agenter blir readonly
      //   && typeof this.registration.ownerUid !== 'undefined' // Nye påmeldinger er ikke readonly.
      //   && this.getters.user().uid !== this.constants.adminUid;
      // }
    },
    watch: {
      registration: function (entry){
        /* Watch for changes through network (shallow object watch, not stringified) */
        entry.edited = null;
        this.watchedRegistration.edited = null;
        if (this.alreadyLoaded
          && JSON.stringify(entry) !== JSON.stringify(this.watchedRegistration) ){
            alert("Opplysningene i skjemaet ble endret utenfra. Les gjennom på nytt!");
        }
        this.alreadyLoaded = true;
        this.watchedRegistration = entry;
      },
      stringifiedTimelessReg: function (newStringified){
        if(this.watchedStringifiedReg === ""){
          this.watchedStringifiedReg = newStringified;
        }
        if(newStringified !== this.watchedStringifiedReg){
          this.setIsEdited();
        }
      },
    },
    methods: {
      setIsEdited() {
         this.isEdited = true;
         console.log("Påmelding", this.id, "- redigert", new Date().toLocaleTimeString());
       },
      addParticipant() {
        this.registration.participants.push({
          willAttendDay: new Array(constants.campaignDays.length).fill(false),
        });
      },
      removeGroupMember(idx) {
        if(confirm("Vil du fjerne meddeltager nummer "+(idx+1)+"? \n\nHusk å også bruke send-knappen nederst i skjema for å bekrefte endringer. ")){
          this.registration.participants.splice(idx, 1);
        }
      },

      save (wantReactivation) {
        if (this.saveClicked) {
          console.log("Skipped repeated send!")
          return;
        }
        this.saveClicked = true;

        if(wantReactivation){
          this.registration.removedBy = "";
        }
        this.alreadyLoaded = false; // Avoids watch alert
        this.registration.ownerUid = this.registration.ownerUid || getters.user().uid;
        this.registration.agentUid = this.registration.agentUid || null;
        this.registration.created = this.registration.created || new Date();
        this.registration.edited = new Date();
        this.registration.lastUpdatedBy = getters.user().displayName;

        if (this.id) {
          // db.collection("registrations").doc(this.id).update({
          //   "primaryPerson.firstName": this.registration.primaryPerson.firstName,
          // })
          const registration= { ...this.registration} // to exclude non-enumerable "id"-property

          db.collection('registrations')
            .doc(this.id)
            .set(registration, {merge: true})
            .then(() => {
              console.log("Påmelding", this.id, "- Lagret OK")
              alert("✅ Lagret!\n\nHvis du vet om noen som blir påvirket av endringene, si gjerne ifra til dem, om du gidder 😃")
              this.$router.back()//.push("/regs")
            })
            .catch(function(error){
              alert("Kunne ikke lagre. ("+error+")")
            });
        }
        else {
          db.collection("registrations").add(this.registration)
            .then(() => {
              this.$router.push("/regs");
              console.log("Påmelding lagt til, lagret OK")
            });
        }

      },
      removeRegistration() {
        if( confirm("Vil du deaktivere påmeldingen? For å gjennopprette etterpå, klikk 'vis deaktiverte' i oversikten. (Administrator kan finne deaktiverte påmeldinger, men du kan tømme innholdet før du sender for å slette innholdet helt).") ){
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

  button.btn.btn-primary:disabled {
     background-color: silver;
     border: silver;
     cursor: not-allowed;
 }
</style>