<template>
  <div class="container container_under_nav">
    <a @click="$router.go(-1)">Tilbake</a>
    <h1>{{ id ? wish.title : "Meld inn oppdrag" }}</h1>
    <h3>{{ wish.event }}</h3>
    <div style="color: #6c757d; margin-bottom: 1em;" v-if="wish.created">
      Opprettet {{ wish.created.toDate().toLocaleDateString() }}
    </div>
    <div style="color: #6c757d; margin-bottom: 1em;" v-if="wish.lastUpdatedBy">
      (Sist endret av {{ wish.lastUpdatedBy }})
    </div>

    <br />
    <em> {{ constants.dataDisclosure }} </em>

    <!--div class="alert alert-secondary bg-light mt-3" role="alert">
      <span style="font-size: 2em; float:  left; margin-right: 0.5em;">❎Innmeldingen av oppdrag er <em><strong>stengt</strong></em> for i år!<br><br>
    </div-->

    <form>
      <div
        v-if="getters.user().uid === constants.adminUid"
        class="alert alert-dark bg-secondary text-white mt-4"
      >
        <div class="form-group mt-3">
          <label>
            Intern status (husk Send)
          </label>
          <input v-model="wish.status" class="form-control" type="text" />
          <div style="color: black">{{ wish.status }}</div>
        </div>

        <div class="form-group">
          <label>
            Lag e-post til
          </label>
          <div class="input-group">
            <input
              v-model="wish.emailSendTo"
              class="form-control"
              type="text"
              :disabled="wish.isDiscarded"
            />
            <div class="input-group-append">
              <button
                @click="makeEmail"
                class="btn btn-primary"
                type="button"
                :disabled="wish.isDiscarded"
              >
                Lag e-post
              </button>
            </div>
          </div>
        </div>
        <pre
          v-if="isShowingEmailPreview"
          style="white-space: pre-wrap;"
        >E-post, emne: {{wish.title}} <br>cc: stavanger@godhet.no
          {{emailTextHtml}}
        </pre>

        <label class="mt-4">
          <strong><em>Team tildeling</em></strong> -
          <span :class="{ fade_confirmation_label: wish.confirmedNonsensitive }"
            >Bekreftet at skjemaet ikke inneholder sensitive opplysninger:
          </span>
          <input
            type="checkbox"
            v-model="wish.confirmedNonsensitive"
            :disabled="wish.confirmedNonsensitive"
          />
        </label>
        <select
          v-model="wish.agentUid"
          class="custom-select"
          :disabled="!wish.confirmedNonsensitive || wish.isDiscarded"
        >
          <option value="">- Uten team -</option>
          <option
            v-for="(team, idx) in teams"
            :key="idx"
            :value="team.ownerUid"
            >{{ team && team.teamName }}</option
          >
        </select>
        <router-link
          :to="{ name: 'dashTeamid', params: { teamid: wish.agentUid } }"
          style="background-color: white"
          >{{ teamName }}
        </router-link>
        <br />
        <br />
        <span style="color: silver"
          >(Sett tilside
          <input
            type="checkbox"
            v-model="wish.isDiscarded"
            :disabled="!!wish.agentUid"
          />)</span
        >
        <br />
        <br />
        <strong>Kun siste endring</strong> (for hvert navn):
        <div v-for="rec in sortedLastEditedEachUser" :key="rec.name">
          {{ rec.time && rec.time.toDate().toLocaleDateString() }},
          {{ rec.time && rec.time.toDate().toLocaleTimeString() }} -
          {{ rec.name }}
        </div>
        <span
          class="dot"
          v-if="sortedLastEditedEachUser.length"
          style="
                              position: relative;
                              bottom: 1.5em;
                              left: -1.2em;"
        />
      </div>

      <div class="form-group mt-5">
        <label>
          Kort overskrift
        </label>
        <input v-model="wish.title" class="form-control" type="text" />
        <span
          style="color: #495057; 
          padding-left: 1em;
          background-color: #f8f9fa !important;
          display: block;"
        >
          {{ wish.target.address }}
        </span>
      </div>

      <div
        :class="{
          done_self: wish.selfTask && getters.user().uid === constants.adminUid,
        }"
        class="mt-4 mb-5"
      >
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="wish.selfTask"
          />
          <label class="form-check-label">
            Dette oppdraget tar vi ansvar for å utføre selv
          </label>
        </div>
      </div>
      <div v-if="wish.agentUid" class="form-group form-check mt-4 mb-5">
        <label class="form-check-label" style="color: grey">
          Dette oppdraget er tildelt:
          <strong>{{ teamName || "ikke funnet" }}</strong>
        </label>
      </div>

      <div
        v-if="
          wish.selfTask ||
            getters.user().uid == wish.agentUid ||
            getters.user().uid === constants.adminUid
        "
        style="
          background-color: #fcfcdd; 
          display: block;
          padding: 1em"
      >
        <label> <strong>Plan arbeidsdager</strong>: </label>
        <div class="day-checkbox">
          <input type="checkbox" v-model="wish.activeMonday" /> Mandag
        </div>
        <div class="day-checkbox">
          <input type="checkbox" v-model="wish.activeTuesday" /> Tirsdag
        </div>
        <div class="day-checkbox">
          <input type="checkbox" v-model="wish.activeWednesday" /> Onsdag
        </div>
        <div class="day-checkbox">
          <input type="checkbox" v-model="wish.activeThursday" /> Torsdag
        </div>
        <div class="day-checkbox">
          <input type="checkbox" v-model="wish.activeFriday" /> Fredag
        </div>
        <br />
        <label> <strong>Ønsker henting</strong>: </label>
        <div class="day-checkbox">
          <input type="checkbox" v-model="wish.bioWednesday" /> Hageavfall
          onsdag
        </div>
        <div class="day-checkbox">
          <input type="checkbox" v-model="wish.bioFriday" /> Hageavfall fredag
        </div>
        <br />
        <div
          :style="[
            isEdited ? { visibility: 'visible' } : { visibility: 'hidden' },
          ]"
          style="color: #495057;"
        >
          🟠 Husk å <em>sende</em> skjemaet ↓
        </div>
      </div>

      <div class="form-group mt-4">
        <label>
          Beskrivelse av arbeid
        </label>
        <textarea
          v-model="wish.description"
          class="form-control"
          type="text"
          rows="4"
        >
        </textarea>
      </div>

      <div class="form-group mt-4">
        <label>
          Utstyr allerede på stedet (f.eks. vaskeutstyr, gressklipper)
        </label>
        <input v-model="wish.equipment" class="form-control" type="text" />
      </div>

      <div class="bg-light p-2 mt-5">
        <small class="form-text text-muted">Innmelder</small>
        <div class="form-group">
          <label>
            Fornavn
          </label>
          <input
            v-model="wish.submitter.firstName"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
        <div class="form-group">
          <label>
            Etternavn
          </label>
          <input
            v-model="wish.submitter.lastName"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input
            v-model="wish.submitter.phone"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input
            v-model="wish.submitter.email"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
        <div class="form-group">
          <label>
            Innmelders kontaktinfo (evt adresse/bydel)
          </label>
          <input
            v-model="wish.submitter.address"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
      </div>

      <div class="bg-light p-2 mt-5 mb-4">
        <small class="form-text text-muted"
          >Person som mottar hjelp (sted for oppdrag)</small
        >
        <div class="form-group">
          <label>
            Fornavn
          </label>
          <input
            v-model="wish.target.firstName"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
        <div class="form-group">
          <label>
            Etternavn
          </label>
          <input
            v-model="wish.target.lastName"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>

        <div class="form-group">
          <label>
            Tlf.
          </label>
          <input
            v-model="wish.target.phone"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
        <div class="form-group">
          <label>
            E-post
          </label>
          <input
            v-model="wish.target.email"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
        <div class="form-group">
          <label>
            Adresse📍 og bydel for oppdraget
          </label>
          <input
            v-model="wish.target.address"
            class="form-control"
            placeholder=""
            type="text"
          />
        </div>
      </div>

      <div
        v-if="false && getters.user().uid === constants.adminUid && wish.id"
        class="form-group mt-5 mb-5"
      >
        <h3>
          Administrer deltagere på dette oppdraget
        </h3>
        <div style="opacity: 0.5;">
          Tegnforklaring når du legger til deltagelse: <br />
          (tall) = antall deltagere på gruppen inkludert leder og alle aldre<br />
          F = deltar på familiegodhet <br />
          * = allerede engasjert på <strong>ett</strong> oppdrag
          <em>utenom</em> dette oppdraget <br />
          ** = allerede engasjert på <strong>to</strong> oppdrag
          <em>utenom</em> dette oppdraget <br />
          (Listen er sortert med største grupper først, deretter alfabetisk
          etter navn på hoveddeltageren. )
        </div>
        <div
          v-for="(ref, idx) in wish.assigneesPerDay[0].registrationRefs"
          :key="idx"
        >
          <span @click="removeAssigneeForDay(0, ref)" class="clickable_tag"
            >(-)</span
          >
          <AssigneeSelector
            v-model="wish.assigneesPerDay[0].registrationRefs[idx]"
            :registrations="sortedRegistrations"
            :day="0"
            :wishRef="wish.id"
          />
          <a v-if="ref" :href="'/registrering/' + ref" target="_blank"
            >Åpne påmeldingen</a
          >
        </div>
        <button
          type="button"
          class="btn btn-secondary"
          @click="addExtraAssigneeForDay(0)"
        >
          Legg til deltagelse
        </button>
      </div>
      <div
        v-else-if="
          false && getters.user().uid === constants.adminUid && !wish.id
        "
      >
        <h5>
          Administrer deltagere på dette oppdraget
        </h5>
        Du må lagre dette oppdraget først før du kan legge til deltagere.
      </div>
    </form>

    <div v-if="this.id" class="form-group form-check mt-4 mb-5">
      <input class="form-check-input" type="checkbox" v-model="wish.done" />
      <label class="form-check-label">
        Dette oppdraget er nå fullført
      </label>
    </div>

    <br />
    Du kan enkelt oppdatere innholdet ved behov etter innsending.
    <div v-if="getters.user().uid === constants.adminUid">
      <strong>Sekretariat: </strong>
      <input
        v-model="adminNick"
        :disabled="!this.isEdited"
        placeholder="Ditt_fornavn kun"
        size="35"
      />
    </div>
    <div class="form-group pb-5">
      <button
        class="btn btn-primary"
        @click="save(false)"
        :disabled="!this.isEdited"
        v-if="adminNick || getters.user().uid !== constants.adminUid"
      >
        Send
        <span v-if="getters.user().uid == constants.adminUid">(Ctrl-S)</span>
      </button>
      <span v-if="!this.isEdited">(Ingen endringer å sende)</span>
    </div>
  </div>
</template>

<script>
import { db } from "../main";
import firebase from "firebase/app";

import { getters, setters, constants } from "../store";

export default {
  beforeCreate() {
    setters.setActiveNav("foresporsler");
  },
  created() {
    db.collection("teams")
      .orderBy("teamName", "asc")
      .get()
      .then((querySnapshot) => {
        this.teams = querySnapshot.docs.map((doc) => doc.data());
      });
    const savedName = localStorage.getItem("savedName");
    if (savedName) {
      this.adminNick = savedName;
    }
  },
  mounted() {
    console.log("Oppdrag", this.id, "- åpnet", new Date().toLocaleTimeString());
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeDestroyed() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  name: "Wish",
  props: ["id"],
  components: {
    AssigneeSelector: () => import("./AssigneeSelector.vue"),
  },
  data() {
    return {
      wish: {
        submitter: {
          firstName: getters.authDisplayNameSplitted().firstName,
          lastName: getters.authDisplayNameSplitted().lastName,
        },
        target: {},
        event: "Godhet Stavanger 2025",
        assigneesPerDay: [{ registrationRefs: [] }],
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
      adminNick: "",
    };
  },
  firestore() {
    let result = {};
    if (this.id) {
      result.wish = db.collection("wishes").doc(this.id);
    }
    if (getters.user().uid === constants.adminUid) {
      result.registrations = db.collection("registrations"); //unused for now?
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
    sortedLastEditedEachUser() {
      let obj = this.wish.lastEditedEachUser || {};
      let arr = Object.keys(obj).map((key) => ({ name: key, time: obj[key] }));

      return arr.toSorted((a, b) => a.time - b.time);
    },
    sortedRegistrations() {
      if (!this || !this.registrations) {
        return;
      }
      let copy = this.registrations.slice();
      copy = copy.filter((r) => !r.removedBy);

      return copy.sort((a, b) => {
        let aName = a.primaryPerson.firstName || "";
        let bName = b.primaryPerson.firstName || "";
        if (a.primaryPerson.lastName) {
          aName += " " + a.primaryPerson.lastName;
        }
        if (b.primaryPerson.lastName) {
          bName += " " + b.primaryPerson.lastName;
        }
        return (
          b.participants.length - a.participants.length ||
          aName.localeCompare(bName)
        );
      });
    },
    stringifiedTimelessWish() {
      let timelessWish = { ...this.wish };
      timelessWish.edited = null;
      return JSON.stringify(timelessWish);
    },
    teamName() {
      let teamsFiltered = this.teams.filter(
        (t) => t.ownerUid === this.wish.agentUid
      );
      if (teamsFiltered.length !== 1 || !teamsFiltered[0].teamName) return null;
      return teamsFiltered[0].teamName;
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
Utstyr på stedet: ${this.wish.equipment}%0D%0A`;
    },
    emailTextHtml() {
      return this.emailText.replace(/%0D%0A/g, "");
    },
  },
  methods: {
    setIsEdited() {
      this.isEdited = true;
      console.log(
        "Påmelding",
        this.id,
        "- redigert",
        new Date().toLocaleTimeString()
      );
    },
    addExtraAssigneeForDay(day) {
      this.wish.assigneesPerDay[day].registrationRefs.push("");
    },
    removeAssigneeForDay(day, ref) {
      if (
        confirm(
          "Fjerne deltager fra oppdraget \n\nHusk å klikke lagre i skjemaet for at endringen skal få effekt. "
        )
      ) {
        let filtered = this.wish.assigneesPerDay[day].registrationRefs.filter(
          (el) => el !== ref
        );
        this.wish.assigneesPerDay[day].registrationRefs = filtered;
      }
    },
    makeEmail() {
      if (this.isEdited) {
        alert("Du må lagre først for ordens skyld");
      } else {
        this.isShowingEmailPreview = true;
        alert(
          "Epost-forslaget vil nå forhåpentligvis åpnes i din e-post app.\n\nHusk å fjerne sensitiv informasjon før du sender eposten!"
        );
        window.location.href =
          "mailto:" +
          this.wish.emailSendTo +
          "?cc=stavanger@godhet.no&subject=" +
          this.wish.title +
          "&body=" +
          this.emailText;
      }
    },
    whenAllSaved(isStaying) {
      this.isEdited = false;

      if (!isStaying) {
        this.$router.back(); //.push("/wishes");
      }
    },

    save(isStaying) {
      if (this.saveClicked) {
        console.log("Skipped repeated send!");
        return;
      }
      this.saveClicked = true;

      this.suppressWatchOnce = true;

      const assigneesPerDay = this.wish.assigneesPerDay;
      // Save wish document
      this.wish.ownerUid = this.wish.ownerUid || getters.user().uid;
      this.wish.created = this.wish.created || new Date();
      this.wish.edited = new Date();
      this.wish.lastUpdatedBy = getters.user().displayName;

      let lastEditedEachUser = this.wish.lastEditedEachUser || {};
      let adminNick =
        this.adminNick && "-" + this.adminNick.toLowerCase().trim();
      lastEditedEachUser[getters.user().displayName + adminNick] = new Date();
      this.wish.lastEditedEachUser = lastEditedEachUser;

      if (this.id) {
        const wish = { ...this.wish }; // to exclude non-enumerable "id"-property
        delete wish.assigneesPerDay; // saves later in transaction with registration documents

        db.collection("wishes")
          .doc(this.id)
          .set(wish, { merge: true })
          .then(() => {
            this.doneSavePart1 = true;
            this.suppressWatchOnce = true;
            alert(
              "✅ Lagret!\n\nHvis du vet om noen som blir påvirket av endringene, si gjerne ifra til dem, om du gidder 😃"
            );
            if (this.doneSavePart2) {
              this.whenAllSaved(isStaying);
            }
          })
          .catch(function(error) {
            alert("Kunne ikke lagre. (" + error + ")");
          });
      } else {
        db.collection("wishes")
          .add(this.wish)
          .then(() => {
            this.$router.push("/wishes");
          });
      }

      // Save ref. in registrations (need wish-id so not possible on first wish create)
      if (this.id) {
        let wishDocRef = db.collection("wishes").doc(this.id);
        let wishId = this.id;

        return db
          .runTransaction(function(transaction) {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(wishDocRef).then(function(wishDoc) {
              if (!wishDoc.exists) {
                throw "Document does not exist!";
              }

              let wishServerData = wishDoc.data();
              updateRegistrations(
                wishId,
                wishServerData,
                transaction,
                wishDocRef,
                assigneesPerDay
              );
            });
          })
          .then(() => {
            console.log("Transaction successfully committed!");
            this.doneSavePart2 = true;
            this.suppressWatchOnce = true;
            if (this.doneSavePart1) {
              this.whenAllSaved(isStaying);
            }
          })
          .catch(function(error) {
            console.log("Transaction failed: ", error);
          });
      }
    }, //(end save)

    handleKeyDown(e) {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isSaveShortcut =
        (isMac && e.metaKey && e.key === "s") ||
        (!isMac && e.ctrlKey && e.key === "s");

      if (
        isSaveShortcut &&
        this.adminNick &&
        getters.user().uid == constants.adminUid
      ) {
        e.preventDefault();
        this.customSaveFunction();
      }
    },
    customSaveFunction() {
      this.save();
    },
  },
  watch: {
    wish: function(entry) {
      entry.edited = null;
      this.watchedWish.edited = null;
      if (
        !this.suppressWatchOnce &&
        JSON.stringify(entry) !== JSON.stringify(this.watchedWish)
      ) {
        alert(
          "Opplysningene i skjemaet ble endret utenfra. Les gjennom på nytt!"
        );
      }
      this.suppressWatchOnce = false; // enable next watch
      this.watchedWish = entry;
    },
    stringifiedTimelessWish: function(newStringified) {
      if (!this.id) {
        this.setIsEdited(); // new reg.
        return;
      }
      if (this.watchedStringifiedWish === "") {
        this.watchedStringifiedWish = newStringified;
      }
      if (newStringified !== this.watchedStringifiedWish) {
        this.setIsEdited();
      }
    },
    adminNick: function(newAdminNick) {
      localStorage.setItem("savedName", newAdminNick);
    },
  },
};

let updateRegistrations = function(
  wishId,
  wishServerData,
  transaction,
  wishDocRef,
  newAssigneesPerDay
) {
  let registrationReferences = newAssigneesPerDay[0].registrationRefs;
  let uniqueReferences = [...new Set(registrationReferences)];
  uniqueReferences = uniqueReferences.filter((r) => !!r);
  newAssigneesPerDay[0].registrationRefs = uniqueReferences;
  transaction.update(wishDocRef, {
    assigneesPerDay: newAssigneesPerDay,
  });

  // update registrations (wish refs on missionDay[0] ..)
  // (update removed refs)
  let day = 0;
  let missionDayKey = "missionDay" + day;
  for (let assignee of wishServerData.assigneesPerDay[0].registrationRefs) {
    let registrationDocRef = db.collection("registrations").doc(assignee);
    transaction.update(registrationDocRef, {
      [missionDayKey]: firebase.firestore.FieldValue.arrayRemove(wishId), //optimization: only remove needed?
    });
  }
  // (add refs)
  for (let assignee of newAssigneesPerDay[0].registrationRefs) {
    let registrationDocRef = db.collection("registrations").doc(assignee);
    transaction.update(registrationDocRef, {
      [missionDayKey]: firebase.firestore.FieldValue.arrayUnion(wishId),
    });
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
.fade_confirmation_label {
  opacity: 50%;
}
.day-checkbox {
  margin-top: 0.3em;
}
.dot {
  height: 0.8em;
  width: 0.8em;
  background-color: rgb(148, 207, 252);
  border-radius: 50%;
  display: inline-block;
  margin: 0 0.2em;
}

.done_self {
  background-color: #fff6ff;
  padding: 4px;
  border-color: #ecd8ec;
  border-style: dotted;
  border-radius: 10px;
}
</style>
