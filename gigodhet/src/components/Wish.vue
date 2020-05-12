<template>
  <div class="container container_under_nav">
    <router-link to="/wishes">Tilbake</router-link>
    <h1>Gi forslag til oppdrag</h1>
    <h3>{{wish.event || "Godhet Stavanger 2020"}}</h3>
    <br />
    <em> {{constants.dataDisclosure}} </em>

    <div class="alert alert-secondary" role="alert">
      <span style="font-size: 2em; float:  left; margin-right: 0.5em;">😃</span>Vi holder smittevernregler høyt. <br />Videre vil vi informere om at vi ikke tar de største oppdragene i denne tiden, men meld gjerne inn her under så svarer vi 👍🏼
      <br>Dersom du tilhører en huskirke i IMI-Kirken som skal utføre oppdraget du ønsker å melde inn, trenger du ikke å melde det inn her.
    </div>

    <button v-if="id" class="btn mr-3" :class="isEdited ? 'btn-primary': 'btn-light'" @click="save(true)">Lagre</button>
    <form @input="onFormInput">

      <div v-if="getters.user().uid === constants.adminUid" class="form-group mt-4" style="opacity: 0.5;">
        <label>
          Admin-status (intern)
        </label>
        <input v-model="wish.status" class="form-control" type="text">
      </div>

      <div v-if="getters.user().uid === constants.adminUid" class="form-group mt-4" style="opacity: 0.5;">
        <label>
          Send til epostadresse
        </label>
        <a @click="makeEmail" class="link_look"> Lag epost</a>
        <input v-model="wish.emailSendTo" class="form-control" type="text">
      </div>

      <div class="form-group mt-4">
        <label>
          Kort overskrift
        </label>
        <input v-model="wish.title" class="form-control" type="text">
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
          Utstyr på stedet (f.eks. stige, gressklipper)
        </label>
        <input v-model="wish.equipment" class="form-control" type="text">
      </div>

      <div class="bg-light p-2">
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

      <div class="bg-light p-2 mt-4">
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


      <div v-if="getters.user().uid === constants.adminUid && wish.id" class="form-group">

        <br />
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
      <div v-else-if="getters.user().uid === constants.adminUid && !wish.id">
        <h5>
          Administrer deltagere på dette oppdraget
        </h5>
        Du må lagre dette oppdraget først før du kan legge  til deltagere.
      </div>

    </form>

    <br />
    {{constants.welcomeUnfinishedFormMessage}}
    <div class="form-group">
      <button v-if="id" class="btn mr-3" :class="isEdited ? 'btn-primary': 'btn-light'" @click="save(true)">Lagre</button>
      <button class="btn btn-primary" @click="save">Lagre og lukk</button>
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
          event: "Godhet Stavanger 2020",
          assigneesPerDay: [
            { registrationRefs: [] }
          ],
        },
        registrations: [],
        alreadyLoaded: false,
        isEdited: false,
        watchedWish: {}
      }
    },
    firestore () {
      let result = {};
      if (this.id) {
        result.wish = db.collection("wishes").doc(this.id)
      }
      if (getters.user().uid === constants.adminUid) {
        result.registrations = db.collection("registrations");
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
      emailText() {
        return `%0D%0A
        ${this.wish.status} %0D%0A
        %0D%0A
        Oppdrag hos: ${this.wish.target.firstName} ${this.wish.target.lastName} %0D%0A
        ${this.wish.target.address}%0D%0A
        tlf: ${this.wish.target.phone}%0D%0A
        ${this.wish.target.email}%0D%0A
        %0D%0A
        ${this.wish.description}%0D%0A
        Utstyr på stedet: ${this.wish.equipment}%0D%0A`
      },
    },
    methods: {
      addExtraAssigneeForDay(day) {
        this.wish.assigneesPerDay[day].registrationRefs.push("");
      },
      removeAssigneeForDay(day, ref) {
        if(confirm("Fjerne deltager fra oppdraget \nHusk å klikke lagre i skjemaet for at endringen skal få effekt. \n\n(For å angre, last siden på nytt)") ){
          let filtered = this.wish.assigneesPerDay[day].registrationRefs.filter(el => el !== ref)
          this.wish.assigneesPerDay[day].registrationRefs = filtered;
        }
      },
      onFormInput() {
        this.isEdited = true;
      },
      makeEmail() {
        if (this.isEdited) {
          alert("Du må lagre først for ordens skyld");
        }
        else {
          window.location.href = 'mailto:'+this.wish.emailSendTo+'?cc=stavanger@godhet.no&subject='+this.wish.title+'&body='+this.emailText;
        }
      },

      save(stayOnPage) {
        this.alreadyLoaded = false; // Avoids watch alert

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
              if (!stayOnPage) {
                this.$router.push("/wishes") // Could there be a race condition so that transaction save below is omitted?
              }
            })
            .catch(function(error){ // trenger å verifiseres
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
              this.isEdited = false;
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
        if (this.alreadyLoaded
          && JSON.stringify(entry) !== JSON.stringify(this.watchedWish) ){
            alert("Opplysningene i skjemaet ble endret utenfra og innholdet du ser oppdateres automatisk. \n\nEksisterende innhold i skjemaet blir dermed erstattet nå. \n\n(Når du lagrer, oppdateres visningen umiddelbart hos andre som ser på også)");
        }
        this.alreadyLoaded = true;
        this.watchedWish = entry;
      }
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
  .clickable_tag {
    cursor: pointer !important;
  }
  .link_look {
    color: #007bff;
    cursor: pointer;
  }
</style>