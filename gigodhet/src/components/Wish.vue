<template>
  <div class="container">
    <router-link to="/">Tilbake</router-link>
    <h1>Forespørsel</h1>
    <h3>{{wish.event || "Godhet Stavanger 2020"}}</h3>

    <form>
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
          <input v-model="wish.submitter.phone" class="form-control" placeholder=" - 8 siffer -" type="number" />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input v-model="wish.submitter.email" class="form-control" placeholder="- xxx@xxx.xx -" type="text" />
        </div>
        <div class="form-group">
            <label>
              Adresse, postnummer og -sted
            </label>
            <input v-model="wish.submitter.address" class="form-control" placeholder=" - Solvegen 99, 4099 -" type="text" />
        </div>

      </div>
    </form>

    <form>
      <div class="bg-light p-2 mt-4">
        <small class="form-text text-muted">Godhetsmottaker</small>
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
          <input v-model="wish.target.phone" class="form-control" placeholder=" - 8 siffer -" type="number" />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input v-model="wish.target.email" class="form-control" placeholder="- xxx@xxx.xx -" type="text" />
        </div>
        <div class="form-group">
            <label>
              Adresse, postnummer og -sted
            </label>
            <input v-model="wish.target.address" class="form-control" placeholder=" - Solvegen 99, 4099 -" type="text" />
        </div>

      </div>
    </form>


    <div class="form-group mt-4">
      <label>
        Forespørsel
      </label>
      <textarea v-model="wish.description" class="form-control" type="text">
      </textarea>
    </div>


    <div class="form-group">
      <label>
        Mandag
      </label>
      <div v-for="(ref, idx) in wish.assigneesPerDay[0].registrationRefs" :key="idx">
        <a @click="removeAssigneeForDay(0, ref)">(-)</a>
        <AssigneeSelector  v-model="wish.assigneesPerDay[0].registrationRefs[idx]" :registrations="sortedRegistrations" />
      </div>
      <a @click="addExtraAssigneeForDay(0)">Legg til en til</a>
    </div>


    <div class="form-group">
      <button class="btn btn-primary" @click="save">Lagre</button>
    </div>

  </div>

</template>

<script>
  import { db } from '../main';
  import firebase from 'firebase/app'

  import { getters, constants } from '../store';

  export default {
    name: "Wish",
    props: ["id"],
    components: {
      AssigneeSelector: () => import("./AssigneeSelector.vue")
    },
    data () {
      return {
        wish: {
          submitter: {},
          target: {},
          event: "Godhet Stavanger 2020",
          assigneesPerDay: [
            { registrationRefs: [] }
          ],
        },
        registrations: [],
      }
    },
    firestore () {
      let result = {};
      if (this.id) {
        result.wish = db.collection("wishes").doc(this.id)
      }
      if (this.user.uid === constants.adminUid) {
        result.registrations = db.collection("registrations")
      }
      return result;
    },
    computed: {
      ...getters,
      sortedRegistrations() {
        if (!this || !this.registrations) {
          return;
        }
        let copy = this.registrations.slice();
        return copy.sort((a, b) => {
          let aFirstName = a.primaryPerson.firstName ||"";
          let bFirstName = b.primaryPerson.firstName ||"";
          return b.participants.length - a.participants.length || aFirstName.localeCompare(bFirstName);
        });
      },
    },
    methods: {
      addExtraAssigneeForDay(day) {
        this.wish.assigneesPerDay[day].registrationRefs.push(this.sortedRegistrations[0].id);
      },
      removeAssigneeForDay(day, ref) {
        let filtered = this.wish.assigneesPerDay[day].registrationRefs.filter(el => el !== ref)
        this.wish.assigneesPerDay[day].registrationRefs = filtered;

      },
      save() {
        const assigneesPerDay = this.wish.assigneesPerDay;
        // Save wish document
        this.wish.ownerUid = this.wish.ownerUid || this.user.uid;
        this.wish.created = this.wish.created || new Date();
        this.wish.edited = new Date();

        if (this.id) {
          const wish= { ...this.wish} // to exclude non-enumerable "id"-property
          delete wish.assigneesPerDay; // saves later in transaction with registration documents

          db.collection('wishes')
            .doc(this.id)
            .set(wish, {merge: true})
            .then(() => {
              this.$router.push("/wishes")
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
        }).then(function() {
            console.log("Transaction successfully committed!");
        }).catch(function(error) {
            console.log("Transaction failed: ", error);
        });
      }
    }
  }

  let updateRegistrations = function(wishId, wishServerData, transaction, wishDocRef, newAssigneesPerDay){
    let registrationReferences = newAssigneesPerDay[0].registrationRefs;
    let uniqueReferences = [...new Set(registrationReferences)];
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