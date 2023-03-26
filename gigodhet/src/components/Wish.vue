<template>
  <div class="container container_under_nav">
    <a @click="$router.go(-1)">Tilbake</a>
    <h1>{{id ? wish.title : 'Meld inn oppdrag'}}</h1>
    <h3>{{wish.event}}</h3>
    <br />
    <em> {{constants.dataDisclosure}} </em>

    <!--div class="alert alert-secondary bg-light mt-3" role="alert">
      <span style="font-size: 2em; float:  left; margin-right: 0.5em;">❎Innmeldingen av oppdrag er <em><strong>stengt</strong></em> for i år!<br><br>
    </div-->

    <form>

      <div v-if="getters.user().uid === constants.adminUid" class="alert alert-dark bg-secondary text-white mt-4">
        
        <div class="form-group mt-3">
          <label>
            Intern status (husk Send)
          </label>
          <input v-model="wish.status" class="form-control" type="text">
        </div>

        <div class="form-group">
          <label>
            Lag e-post til
          </label>
          <div class="input-group">
            <input v-model="wish.emailSendTo" class="form-control" type="text">
            <div class="input-group-append">
              <button @click="makeEmail" class="btn btn-primary" type="button">Lag e-post</button>
            </div>
          </div>
        </div>
        <pre v-if="isShowingEmailPreview" style="white-space: pre-wrap;">E-post, emne: {{wish.title}} <br>cc: stavanger@godhet.no
          {{emailTextHtml}}
        </pre>

        <label class="mt-4">
          <strong><em>Team tildeling</em></strong> - <span :class="{fade_confirmation_label: wish.confirmedNonsensitive}">Bekreftet at skjemaet ikke inneholder sensitive opplysninger: </span> <input type="checkbox" v-model="wish.confirmedNonsensitive" :disabled="wish.confirmedNonsensitive">
        </label>
        <select v-model="wish.agentUid" class="custom-select" :disabled="!wish.confirmedNonsensitive">
          <option value="">-  Uten team -</option>
          <option v-for="(team, idx) in teams" :key="idx" :value="team.ownerUid">{{team && team.teamName}}</option>
        </select>

      </div>


      <div class="form-group mt-5">
        <label>
          Kort overskrift
        </label>
        <input v-model="wish.title" class="form-control" type="text">
      </div>

      <div v-if="!wish.agentUid" class="form-group form-check mt-4 mb-5">
        <input class="form-check-input" type="checkbox" v-model="wish.selfTask">
        <label class="form-check-label">
          Dette oppdraget tar vi ansvar for å utføre selv
        </label>
      </div>
      <div v-if="wish.agentUid" class="form-group form-check mt-4 mb-5">
        <label class="form-check-label" style="color: grey">
          Dette oppdraget er tildelt <strong>{{ teams.filter(t => t.ownerUid == wish.agentUid)[0].teamName }}</strong>
        </label>
      </div>

      <div class="form-group mt-4">
        <label>
          Beskrivelse av arbeid
        </label>
        <textarea v-model="wish.description" class="form-control" type="text" rows="4">
        </textarea>
      </div>

      <div class="form-group mt-4">
        <label>
          Utstyr allerede på stedet (f.eks. vaskeutstyr, gressklipper)
        </label>
        <input v-model="wish.equipment" class="form-control" type="text">
      </div>

      <div class="bg-light p-2 mt-5">
        <small class="form-text text-muted">Innmelder</small>
        <div class="form-group">
            <label>
              Fornavn
            </label>
            <input v-model="wish.submitter.firstName" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
            <label>
              Etternavn
            </label>
            <input v-model="wish.submitter.lastName" class="form-control" placeholder="" type="text" />
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input v-model="wish.submitter.phone" class="form-control" placeholder="" type="number" />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input v-model="wish.submitter.email" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
            <label>
              Adresse, postnummer og -sted
            </label>
            <input v-model="wish.submitter.address" class="form-control" placeholder="" type="text" />
        </div>

      </div>

      <div class="bg-light p-2 mt-5 mb-4">
        <small class="form-text text-muted">Person som mottar hjelp (sted for oppdrag)</small>
        <div class="form-group">
            <label>
              Fornavn
            </label>
            <input v-model="wish.target.firstName" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
            <label>
              Etternavn
            </label>
            <input v-model="wish.target.lastName" class="form-control" placeholder="" type="text" />
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input v-model="wish.target.phone" class="form-control" placeholder="" type="number" />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input v-model="wish.target.email" class="form-control" placeholder="" type="text" />
        </div>
        <div class="form-group">
            <label>
              Adresse, postnummer og -sted
            </label>
            <input v-model="wish.target.address" class="form-control" placeholder="" type="text" />
        </div>

      </div>


      <div v-if="false && getters.user().uid === constants.adminUid && wish.id" class="form-group mt-5 mb-5">

        <h3>
          Administrer deltagere på dette oppdraget
        </h3>
        <div style="opacity: 0.5;">
        Tegnforklaring når du legger til deltagelse:  <br />
        (tall) = antall deltagere på gruppen inkludert leder og alle aldre<br />
        F = deltar på familiegodhet <br />
        * = allerede engasjert på <strong>ett</strong> oppdrag <em>utenom</em> dette oppdraget <br />
        ** = allerede engasjert på <strong>to</strong> oppdrag <em>utenom</em> dette oppdraget <br />
        (Listen er sortert med største grupper først, deretter alfabetisk etter navn på hoveddeltageren. )
        </div>
        <div v-for="(ref, idx) in wish.assigneesPerDay[0].registrationRefs" :key="idx">
          <span @click="removeAssigneeForDay(0, ref)" class="clickable_tag">(-)</span>
          <AssigneeSelector  v-model="wish.assigneesPerDay[0].registrationRefs[idx]" :registrations="sortedRegistrations" :day="0" :wishRef="wish.id" />
          <a v-if="ref" :href="'/registrering/'+ref" target="_blank">Åpne påmeldingen</a>
        </div>
        <button type="button" class="btn btn-secondary" @click="addExtraAssigneeForDay(0)">
          Legg til deltagelse
        </button>


      </div>
      <div v-else-if="false && getters.user().uid === constants.adminUid && !wish.id">
        <h5>
          Administrer deltagere på dette oppdraget
        </h5>
        Du må lagre dette oppdraget først før du kan legge  til deltagere.
      </div>

    </form>

    <div v-if="this.id" class="form-group form-check mt-4 mb-5">
      <input class="form-check-input" type="checkbox" v-model="wish.done">
      <label class="form-check-label">
        Dette oppdraget er nå fullført
      </label>
    </div>

    <br />
    Du kan enkelt oppdatere innholdet ved behov etter innsending.
    <div class="form-group pb-5">
      <button class="btn btn-primary" @click="save(false)" :disabled="!this.isEdited">Send</button>
    </div>

  </div>

</template>

<script>
  import { db } from '../main';
  import firebase from 'firebase/app'

  import { getters, setters, constants } from '../store';

  export default {
    beforeCreate() {
      setters.setActiveNav("foresporsler");
    },
    created() {
      db.collection('teams').orderBy("teamName", "asc")
      .get()
      .then(querySnapshot => {
        this.teams = querySnapshot.docs.map(doc => doc.data())
      })
    },
    mounted(){
      console.log("Oppdrag", this.id, "- åpnet", new Date().toLocaleTimeString());
    },
    name: "Wish",
    props: ["id"],
    components: {
      AssigneeSelector: () => import("./AssigneeSelector.vue")
    },
    data () {
      return {
        wish: {
          submitter: {
            firstName: getters.authDisplayNameSplitted().firstName,
            lastName: getters.authDisplayNameSplitted().lastName,
          },
          target: {},
          event: "Godhet Stavanger 2022",
          assigneesPerDay: [
            { registrationRefs: [] }
          ],
          agentUid: "",
          confirmedNonsensitive: false,
        },
        registrations: [],
        suppressWatchOnce: true,
        isEdited: false,
        watchedStringifiedWish: "",
        saveClicked: false,
        doneSavePart1: false,
        doneSavePart2: false,
        isShowingEmailPreview: false,
        watchedWish: {},
        teams: [],
      }
    },
    firestore () {
      let result = {};
      if (this.id) {
        result.wish = db.collection("wishes").doc(this.id)
      }
      if (getters.user().uid === constants.adminUid) {
        result.registrations = db.collection("registrations");//unused for now?
      }
      return result;
    },
    computed: {
      getters() {
        return getters;
      },
      constants() {
        return constants;
      },
      sortedRegistrations() {
        if (!this || !this.registrations) {
          return;
        }
        let copy = this.registrations.slice();
        copy = copy.filter(r => !r.removedBy);

        return copy.sort((a, b) => {
          let aName = a.primaryPerson.firstName ||"";
          let bName = b.primaryPerson.firstName ||"";
          if (a.primaryPerson.lastName) {
            aName += " "+a.primaryPerson.lastName;
          }
          if (b.primaryPerson.lastName) {
            bName += " "+b.primaryPerson.lastName;
          }
          return b.participants.length - a.participants.length || aName.localeCompare(bName);
        });
      },
      stringifiedTimelessWish(){
        let timelessWish = {...this.wish};
        timelessWish.edited = null;
        return JSON.stringify(timelessWish);
      },
      emailText() {
        return `%0D%0A
%0D%0A
Oppdrag hos: ${this.wish.target.firstName} ${this.wish.target.lastName} %0D%0A
${this.wish.target.address}%0D%0A
tlf: ${this.wish.target.phone}%0D%0A
${this.wish.target.email}%0D%0A
%0D%0A
"${this.wish.description}"%0D%0A
%0D%0A
Utstyr på stedet: ${this.wish.equipment}%0D%0A`
      },
      emailTextHtml() {
        return this.emailText.replace(/%0D%0A/g,'');
      },
    },
    methods: {
      setIsEdited() {
         this.isEdited = true;
         console.log("Påmelding", this.id, "- redigert", new Date().toLocaleTimeString());
       },
      addExtraAssigneeForDay(day) {
        this.wish.assigneesPerDay[day].registrationRefs.push("");
      },
      removeAssigneeForDay(day, ref) {
        if(confirm("Fjerne deltager fra oppdraget \n\nHusk å klikke lagre i skjemaet for at endringen skal få effekt. ") ){
          let filtered = this.wish.assigneesPerDay[day].registrationRefs.filter(el => el !== ref)
          this.wish.assigneesPerDay[day].registrationRefs = filtered;
        }
      },
      makeEmail() {
        if (this.isEdited) {
          alert("Du må lagre først for ordens skyld");
        }
        else {
          this.isShowingEmailPreview = true;
          alert("Epost-forslaget vil nå forhåpentligvis åpnes i din e-post app.\n\nHusk å fjerne sensitiv informasjon før du sender eposten!");
          window.location.href = 'mailto:'+this.wish.emailSendTo+'?cc=stavanger@godhet.no&subject='+this.wish.title+'&body='+this.emailText;
        }
      },
      whenAllSaved(isStaying){
        this.isEdited = false;

        if (!isStaying) {
          this.$router.back();//.push("/wishes");
        }
      },

      save(isStaying) {
        if (this.saveClicked) {
          console.log("Skipped repeated send!")
          return;
        }
        this.saveClicked = true;

        this.suppressWatchOnce = true;

        const assigneesPerDay = this.wish.assigneesPerDay;
        // Save wish document
        this.wish.ownerUid = this.wish.ownerUid || getters.user().uid;
        this.wish.created = this.wish.created || new Date();
        this.wish.edited = new Date();

        if (this.id) {
          const wish= { ...this.wish} // to exclude non-enumerable "id"-property
          delete wish.assigneesPerDay; // saves later in transaction with registration documents

          db.collection('wishes')
            .doc(this.id)
            .set(wish, {merge: true})
            .then(() => {
              this.doneSavePart1 = true;
              this.suppressWatchOnce = true;
              alert("Lagret ✅ Tusen takk!\n\nSi gjerne ifra, til dem som blir påvirket av disse endringene, hvis du har mulighet 😃")
              if (this.doneSavePart2) {
                this.whenAllSaved(isStaying);
              }
            })
            .catch(function(error){
              alert("Kunne ikke lagre. ("+error+")")
            });
        }
        else {
          db.collection("wishes").add(this.wish)
            .then(() => {
              this.$router.push("/wishes");
            });
        }

        // Save ref. in registrations (need wish-id so not possible on first wish create)
        if (this.id) {
          let wishDocRef = db.collection("wishes").doc(this.id)
          let wishId = this.id;

          return db.runTransaction(function(transaction) {
              // This code may get re-run multiple times if there are conflicts.
              return transaction.get(wishDocRef).then(function(wishDoc) {
                  if (!wishDoc.exists) {
                      throw "Document does not exist!";
                  }

                  let wishServerData = wishDoc.data();
                  updateRegistrations(wishId, wishServerData, transaction, wishDocRef, assigneesPerDay)
              });
          }).then(() => {
              console.log("Transaction successfully committed!");
              this.doneSavePart2 = true;
              this.suppressWatchOnce = true;
              if (this.doneSavePart1) {
                this.whenAllSaved(isStaying)
              }
          }).catch(function(error) {
              console.log("Transaction failed: ", error);
          });
        }
      } //(end save)

    },
     watch: {
      wish: function (entry){
        entry.edited = null;
        this.watchedWish.edited = null;
        if (!this.suppressWatchOnce
          && JSON.stringify(entry) !== JSON.stringify(this.watchedWish) ){
            alert("Opplysningene i skjemaet ble endret utenfra. Les gjennom på nytt!");
        }
        this.suppressWatchOnce = false; // enable next watch
        this.watchedWish = entry;
      },
      stringifiedTimelessWish: function (newStringified){
        if(!this.id) {
          this.setIsEdited(); // new reg.
          return;
        }
        if(this.watchedStringifiedWish === ""){
          this.watchedStringifiedWish = newStringified;
        }
        if(newStringified !== this.watchedStringifiedWish){
          this.setIsEdited();
        }
      },
     },
  }

  let updateRegistrations = function(wishId, wishServerData, transaction, wishDocRef, newAssigneesPerDay){
    let registrationReferences = newAssigneesPerDay[0].registrationRefs;
    let uniqueReferences = [...new Set(registrationReferences)];
    uniqueReferences = uniqueReferences.filter(r => !!r);
    newAssigneesPerDay[0].registrationRefs = uniqueReferences;
    transaction.update(wishDocRef, {
      assigneesPerDay: newAssigneesPerDay
    });

    // update registrations (wish refs on missionDay[0] ..)
    // (update removed refs)
    let day = 0;
    let missionDayKey = "missionDay"+day;
    for (let assignee of wishServerData.assigneesPerDay[0].registrationRefs) {
      let registrationDocRef = db.collection("registrations").doc(assignee);
      transaction.update(registrationDocRef, {
        [missionDayKey]: firebase.firestore.FieldValue.arrayRemove(wishId) //optimization: only remove needed?
      })
    }
    // (add refs)
    for (let assignee of newAssigneesPerDay[0].registrationRefs) {
      let registrationDocRef = db.collection("registrations").doc(assignee);
      transaction.update(registrationDocRef, {
        [missionDayKey]: firebase.firestore.FieldValue.arrayUnion(wishId)
      })

    }
  };
</script>

<style scoped>
  /* input, button, textarea { /* for blocking wish form for users * /
    pointer-events: none;
    background-color: silver;
  } */
  .clickable_tag {
    cursor: pointer !important;
  }
  button.btn.btn-primary:disabled {
     background-color: silver;
     border: silver;
     cursor: not-allowed;
 }
 .fade_confirmation_label{
  opacity: 50%;
 }
</style>