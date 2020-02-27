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
      <AssigneeSelector v-for="(ref, idx) in wish.assigneesPerDay[0].registrationRefs" :key="idx" v-model="wish.assigneesPerDay[0].registrationRefs[idx]" :registrations="sortedRegistrations" />
      <a @click="addExtraAssigneeForDay(0)">Legg til en til</a>
    </div>


    <div class="form-group">
      <button class="btn btn-primary" @click="save">Lagre</button>
    </div>

  </div>

</template>

<script>
  import { db } from '../main';
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
      save() {

        this.wish.ownerUid = this.wish.ownerUid || this.user.uid;
        this.wish.created = this.wish.created || new Date();
        this.wish.edited = new Date();

        if (this.id) {
          const wish= { ...this.wish} // to exclude non-enumerable "id"-property

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

      }
    }
  }
</script>