<template>
  <div class="container container_under_nav">
    <div
      v-if="isTeamLead"
      class="bg-light"
      style="margin-top:1em; margin-bottom: 2em; border: 0px solid #eee;box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; border-radius: 4px; padding: 1em"
    >
      <h1 style="margin-top: 0; margin-bottom: 0.5em">Du er teamleder</h1>
      Du vil se dine deltagere her umiddelbart etter at de bruker den
      påmeldings-lenken du sender ut i invitasjon.
      <h2>Ditt team</h2>
      <router-link
        to="/teamreg"
        class="btn btn-outline-secondary btn_green_outline"
      >
        Lag invitasjon
      </router-link>
      - eller -
      <router-link
        :to="'/registrering/agent/' + getters.user().uid"
        class="btn btn-outline-secondary btn_green_outline"
      >
        Meld på noen til ditt team
      </router-link>

      <div
        v-for="(nVariableNotUsed, index) in constants.campaignDays.length"
        :key="index"
      >
        <h5 class="dayTitle">{{ constants.campaignDays[index] }}</h5>

        <div v-for="registration in myTeamRegistrations" :key="registration.id">
          <li v-if="registration.primaryPerson.willAttendDay[index]">
            <router-link
              :to="{
                name: 'endreRegistrering',
                params: { id: registration.id },
              }"
            >
              {{ registration.primaryPerson.firstName }}
              {{ registration.primaryPerson.lastName }}
            </router-link>
          </li>
          <div
            v-for="participant in registration.participants"
            :key="participant.firstName + participant.lastName"
          >
            <li v-if="participant.willAttendDay[index]">
              <router-link
                :to="{
                  name: 'endreRegistrering',
                  params: { id: registration.id },
                }"
              >
                {{ participant.firstName }} {{ participant.lastName }}
              </router-link>
              ({{ participant.ageGroup == "child" ? "barn" : "meddeltager" }})
            </li>
          </div>
        </div>
      </div>
    </div>

    <span v-if="isSentralAdmin">
      Gå til liste ➡️
      <router-link to="/teams"><strong>Alle team</strong></router-link>
    </span>
    <h1>
      Påmeldinger
      <small
        @click="showAll"
        class="show_removed"
        v-if="atLeastOneRemoved && !showRemoved"
        >[vis deaktiverte]</small
      >
      <small
        @click="showAll"
        class="show_removed"
        v-if="atLeastOneRemoved && showRemoved"
        >[skjul dem igjen]</small
      >
    </h1>
    I rekkefølge etter første gang sendt inn.
    <div
      v-if="registrations.length"
      class="alert alert-secondary bg-light mt-3"
      role="alert"
      style="clear: both"
    >
      <span style="font-size: 1em; float:  left; margin-right: 0.5em;">
        💪
      </span>
      <div class="">
        Takk for påmeldingen! Se nedenfor for å lese innsendt påmelding. Gjerne
        gjør endringer ved å sende inn på nytt! 😃 Du vil bli kontaktet når
        godhetsuken nærmer seg.
      </div>
    </div>

    <!--div v-for="(tiem, idx) in tiems" :key=idx>      <!- <------------------- disable BEFORE commit !!! ->
      <input type="text" v-model="tiem.teamName" @input="onTiemEdit(tiem.id)" ref="tieminput">
    </div-->
    <li class="list-group">
      <ul class="list-group-item">
        <router-link
          tag="button"
          class="btn btn-primary"
          :to="{ path: '/registrering' }"
        >
          Ny påmelding
        </router-link>
        <span v-if="isTeamLead">
          - for deg å melde på andre utenfor teamet ditt.
          <span style="color: hwb(138deg 37% 34%); font-style: italic;">
            Se også grønne knapper øverst, "Ditt team"
          </span>
        </span>
      </ul>
      <ul v-if="isSentralAdmin" class="list-group-item">
        <label style="color: #007bff; cursor: pointer;">
          <input type="checkbox" v-model="showHavingTeam" />
          Vis dem som <em>har team</em> også
        </label>
      </ul>
      <ul
        v-for="registration in chronologicalRegistrations"
        :key="registration.id"
        class="list-group-item"
        :class="{ faded_removed: registration.removedBy }"
      >
        <span class="edited_tag">#{{ registration.counter }}</span>
        <span class="dot" v-if="registration.isMostRecentEdited"></span>
        {{
          registration.created.toDate().toLocaleDateString()
        }}<span v-if="registration.ownerUid === getters.user().uid">.</span>
        <router-link
          :to="{ name: 'endreRegistrering', params: { id: registration.id } }"
        >
          {{ registration.primaryPerson.firstName }}
          {{ registration.primaryPerson.lastName }} (+{{
            (registration.participants && registration.participants.length) ||
              0
          }})
        </router-link>
        <span class="" v-if="registration.removedBy"
          >Fjernet av {{ registration.removedBy }}
        </span>
        <span class="edited_tag">{{ registration.displayEdited }} </span>

        <div style="text-align: right">
          <span v-if="registration.agentUid === getters.user().uid">
            Er i ditt team
            <a
              href="#"
              @click.prevent="
                detachFromTeam(
                  registration.id,
                  `${registration.primaryPerson.firstName} ${
                    registration.primaryPerson.lastName
                  }`
                )
              "
              v-if="registration.ownerUid === getters.user().uid"
              >Løsriv</a
            >
          </span>
          <span class="hasAgent" v-else-if="registration.agentUid">
            <router-link
              :to="{
                name: 'dashTeamid',
                params: { teamid: registration.agentUid },
              }"
              style="color: black;"
              >{{ getRegistrationTeamName(registration.agentUid) }}
            </router-link>
          </span>
          <span v-else-if="isTeamLead">
            <!--har tilgang på tross av agenrollen, v-else-if, se over-->
            Ikke med i teamet ditt
            <a
              href="#"
              @click.prevent="
                attachToTeam(
                  registration.id,
                  `${registration.primaryPerson.firstName} ${
                    registration.primaryPerson.lastName
                  }`
                )
              "
              >Ta med</a
            >
          </span>
        </div>

        <span
          v-if="isSentralAdmin"
          v-tooltip:top="'Intern sekretariat-kommentar'"
          >{{ registration.status }}</span
        >
      </ul>
    </li>
    <router-link to="/countregs" v-if="isSentralAdmin"
      >Antall middag og antall påmeldte</router-link
    ><br /><br />
    <router-link to="/participantemails" v-if="isSentralAdmin"
      >Liste epost-adresser til deltagere</router-link
    ><br /><br />
    <!--<div style="opacity: 0.1;">{{getters.user().uid}}</div>Temporary show Uid-->
  </div>
</template>

<script>
import { db } from "../main";
import router from "../router";
import { getters, setters, constants } from "../store";

export default {
  beforeCreate() {
    setters.setActiveNav("pameldinger");
  },
  created() {
    this.showHavingTeam = this.includeHasTeam;

    db.collection("teams") //       <----------  to be replaced in firestore method (tiems) !!! !!! !!!
      .get()
      .then((querySnapshot) => {
        this.teams = querySnapshot.docs.map((doc) => doc.data());
      });
  },
  name: "ListRegistreringer",
  props: ["includeHasTeam"],
  data() {
    return {
      registrations: [],
      registrationsWithAgentAccess: [],
      showRemoved: false,
      teams: [],
      tiems: [],
      hasQueuedSave: false, // tiems
      whiteTimerId: null, // tiems
      showHavingTeam: undefined,
    };
  },
  computed: {
    getters: () => getters,
    constants: () => constants,
    isSentralAdmin() {
      return this.getters.user().uid === this.constants.adminUid;
    },
    isTeamLead() {
      return (
        this.teams &&
        this.teams.map((t) => t.ownerUid).includes(getters.user().uid)
      );
    },
    registrationsReadOnly() {
      return this.registrationsWithAgentAccess.filter(
        (r) => r.ownerUid !== getters.user().uid
      );
    },
    atLeastOneRemoved() {
      return (
        this.registrations.some((r) => !!r.removedBy) ||
        this.registrationsWithAgentAccess.some((r) => !!r.removedBy)
      );
    },
    chronologicalRegistrations() {
      if (!this || !this.registrations) {
        return;
      }

      let combined = this.registrations
        .slice()
        .concat(this.registrationsReadOnly.slice());
      let sorted = combined;
      sorted.sort((a, b) => {
        return a.created.seconds - b.created.seconds;
      });

      // Find most recently edited
      let uidRecentEdit;
      let secondsRecentEdit = 0;
      for (let registration of combined) {
        if (
          registration.edited &&
          registration.edited.seconds > secondsRecentEdit
        ) {
          secondsRecentEdit = registration.edited.seconds;
          uidRecentEdit = registration.id;
        }
      }
      let uidMostRecentEdited = uidRecentEdit;

      let copy = [];

      for (let i = 0; i < sorted.length; i++) {
        let registration = sorted[i];
        let isVisible = this.showRemoved || !registration.removedBy;
        let isAdmin = this.getters.user().uid === this.constants.adminUid;
        let isIncluded =
          !isAdmin || this.showHavingTeam || !registration.agentUid;
        if (isVisible && isIncluded) {
          copy.push(registration);
        } else {
          continue;
        }
        registration.counter = i + 1;
        if (registration.edited.seconds !== registration.created.seconds) {
          let hoursAgo =
            (Date.now() - registration.edited.toMillis()) / 1000 / 60 / 60 / 24;
          registration.displayEdited =
            "(endret " +
            hoursAgo.toFixed(1) +
            " dager siden av " +
            registration.lastUpdatedBy +
            ")"; // inserted property

          registration.isMostRecentEdited =
            registration.id === uidMostRecentEdited; // inserted property
        }
      }
      return copy;
    },
    myTeamRegistrations() {
      return this.chronologicalRegistrations.filter(
        (r) => r.agentUid === this.getters.user().uid
      );
    },
  },
  firestore() {
    if (this.isSentralAdmin) {
      return {
        registrations: db.collection("registrations"),
        // tiems: db.collection("tiems") // disable BEFORE commit
      };
    } else if (getters.user().uid) {
      return {
        registrations: db
          .collection("registrations")
          .where("ownerUid", "==", getters.user().uid),
        registrationsWithAgentAccess: db
          .collection("registrations")
          .where("agentUid", "==", getters.user().uid),
        // future note: get tiems data for this scenario
      };
    }
  },
  methods: {
    showAll() {
      this.showRemoved = !this.showRemoved;
    },
    getRegistrationTeamName(agentUid) {
      let teamObject = this.teams.filter((t) => t.ownerUid === agentUid)[0];
      let teamName = (teamObject && teamObject.teamName) || "";
      return teamName;
    },
    attachToTeam(regId, regDisplayName) {
      db.collection("registrations")
        .doc(regId)
        .update({ agentUid: this.getters.user().uid })
        .then(() => {
          console.log("Påmelding", regId, "- attached OK");
          alert(
            "Du la til påmeldingen fra " +
              regDisplayName +
              " i teamet ditt. Du kan endre tilbake i listen Påmeldinger her"
          );
        })
        .catch(function(error) {
          alert("Kunne ikke lagre. (" + error + ")");
        });
    },
    detachFromTeam(regId, regDisplayName) {
      db.collection("registrations")
        .doc(regId)
        .update({ agentUid: "" })
        .then(() => {
          console.log("Påmelding", regId, "- detached OK");
          alert(
            "Du løsrev påmeldingen fra " +
              regDisplayName +
              " fra teamet ditt. Du kan endre tilbake i listen Påmeldinger her"
          );
        })
        .catch(function(error) {
          alert("Kunne ikke lagre. (" + error + ")");
        });
    },
    onTiemEdit(tiemId) {
      clearTimeout(this.whiteTimerId);
      this.$refs.tieminput[0].style.backgroundColor = "white";

      if (!this.hasQueuedSave) {
        this.hasQueuedSave = true;
        setTimeout(() => {
          this.hasQueuedSave = false;
          this.saveTiem(tiemId);
        }, 2000);
      }
    },
    saveTiem(tiemId) {
      let that = this;
      db.collection("tiems")
        .doc(tiemId)
        .set(
          {
            teamName: this.tiems.filter((t) => t.id == tiemId)[0].teamName,
            ownerUid: this.getters.user().uid, // for db write-permission.
          },
          { merge: true }
        )
        .then(() => {
          that.$refs.tieminput[0].style.backgroundColor = "#cfc";
          this.whiteTimerId = setTimeout(() => {
            if (!this.hasQueuedSave)
              that.$refs.tieminput[0].style.backgroundColor = "white";
          }, 3000);
        })
        .catch(function(error) {
          alert("Kunne ikke lagre tiem. (" + error + ")");
        });
    },
  },
  watch: {
    showHavingTeam: function(shouldShow) {
      if (this.includeHasTeam === this.showHavingTeam) return; // no change, loading etc.

      if (shouldShow) router.replace("/regs/all");
      else router.replace("/regs");
    },
  },
};
</script>

<style scoped>
h1 {
  margin-top: 0.5em;
}
.dayTitle {
  margin: 1em 0 0.5em;
}
.edited_tag {
  opacity: 0.5;
}
.show_removed {
  font-size: 1rem;
  float: right;
  opacity: 0.3;
  cursor: pointer;
  line-height: 2em;
}
.faded_removed {
  opacity: 0.4;
}
.hasAgent {
  font-weight: bold;
}
.dot {
  height: 0.8em;
  width: 0.8em;
  background-color: rgb(148, 207, 252);
  border-radius: 50%;
  display: inline-block;
  margin: 0 0.2em;
}
.highlight_background_optimistic {
  background-color: #e4ffec;
  border: solid 1px #93d9a8;
}
.highlight_background_optimistic a {
  color: black;
}
.btn_green_outline {
  border: solid 1px #93d9a8;
  background-color: #cfffdd;
}
.btn_green_outline:hover {
  background-color: silver;
}
</style>
