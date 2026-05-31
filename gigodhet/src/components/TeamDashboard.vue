<template>
  <div class="container container_under_nav">
    <a href="#" @click="$router.go(-1)">Tilbake </a>
    <span v-if="getters.user().uid === constants.adminUid">
      <span style="color: grey">|</span>
      <router-link to="/teams"><strong> Alle team</strong></router-link> </span
    ><br /><br />

    <div class="filter_checkboxes" style="color: silver">
      <p>
        <em>Valgfrie filter for <strong> listen</strong> av team </em>
      </p>
      <input type="checkbox" v-model="filterDays[0]" /><label
        >har folk mandag</label
      ><br />
      <input type="checkbox" v-model="filterDays[1]" /><label
        >har folk tirsdag</label
      ><br />
      <input type="checkbox" v-model="filterDays[2]" /><label
        >har folk onsdag</label
      ><br />
      <input type="checkbox" v-model="filterDays[3]" /><label
        >har folk torsdag</label
      ><br />
      <input type="checkbox" v-model="filterDays[4]" /><label
        >har folk fredag</label
      ><br />
      NB: filterne over ignorerer "meddeltagere" og barn<br />
      <!-- <hr style="border: solid 1px white" /> -->
      <h2
        style="
    color: white;
    text-shadow: 0px 0px 18px black;"
      >
        Vis team (filtrerbar liste):
      </h2>
      <select v-model="selectedTeamUid" class="custom-select">
        <option value="">- Velg team -</option>
        <option
          v-for="(team, idx) in sortedTeams"
          :key="idx"
          :value="team.ownerUid"
          :disabled="
            (filterDays[0] && !teamDays[team.ownerUid][0]) ||
              (filterDays[1] && !teamDays[team.ownerUid][1]) ||
              (filterDays[2] && !teamDays[team.ownerUid][2]) ||
              (filterDays[3] && !teamDays[team.ownerUid][3]) ||
              (filterDays[4] && !teamDays[team.ownerUid][4])
          "
        >
          <span
            v-if="
              !(
                (filterDays[0] && !teamDays[team.ownerUid][0]) ||
                (filterDays[1] && !teamDays[team.ownerUid][1]) ||
                (filterDays[2] && !teamDays[team.ownerUid][2]) ||
                (filterDays[3] && !teamDays[team.ownerUid][3]) ||
                (filterDays[4] && !teamDays[team.ownerUid][4])
              )
            "
            >⏹️ </span
          >{{ team.teamName }}
        </option>
      </select>
    </div>
    <br />
    <br />
    <h1>{{ getRegistrationTeamName(teamid) }}</h1>
    <br />
    <h2>Team status</h2>
    {{ externalUrl }}
    <hr class="sectionSeparator" />

    <template>
      <h2>Deltagere</h2>
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
    </template>
    <hr class="sectionSeparator" />

    <h2>Oppdrag</h2>

    <li class="list-group">
      <ul
        v-for="wish in chronologicalWishes"
        :key="wish.id"
        class="list-group-item"
      >
        <!-- {{
          wish.isMostRecentEdited
        }}
        {{
          wish.created.toDate().toLocaleDateString()
        }} -->
        <router-link :to="{ name: 'endreWish', params: { id: wish.id } }">
          <em>{{ wish.target.address }} </em>
          <strong>{{ wish.title || "(mangler tittel på oppdraget)" }}</strong>
          {{ wish.target.firstName }}
          {{ wish.target.lastName }}
        </router-link>
        <!-- <span class="edited_tag">{{ wish.displayEdited }} </span> -->
        <!-- <span
          v-if="getters.user().uid === constants.adminUid"
          v-tooltip:top="'Admin-status (intern)'"
          >{{ wish.status }}</span
        > -->
      </ul>
    </li>
    <!-- <pre>    {{ JSON.stringify(this.wishes, null, 2) }}</pre> -->
    <li class="list-group">
      <ul
        v-for="(kobling, idx) in koblinger"
        :key="idx"
        class="list-group-item"
      >
        <router-link
          :to="{ name: 'endreWish', params: { id: kobling.wishId } }"
        >
          {{ kobling.confirmed ? "" : "💥" }}
          {{ getAddress(kobling) }},
          <strong>{{
            kobling.wishTitle || "(mangler tittel på oppdraget)"
          }}</strong>
        </router-link>
        <button
          type="button"
          @click="toggleKoblingConfirmed(kobling.id, !kobling.confirmed)"
        >
          {{ kobling.confirmed ? "🤝" : "merk som bekreftet" }}</button
        >&nbsp;
        <button
          type="button"
          @click="deleteKobling(kobling.id, kobling.wishTitle)"
        >
          ✘ fjern kobling
        </button>

        <!-- <span
          v-if="getters.user().uid === constants.adminUid"
          v-tooltip:top="'Admin-status (intern)'"
          >{{ wishes.filter((w) => w.id === kobling.wishId).status }}</span
        > -->
      </ul>
    </li>
    <hr class="sectionSeparator" />
    <h2>Alle innsendte påmeldinger for dette teamet</h2>

    <li class="list-group">
      <ul
        v-for="registration in myTeamRegistrations"
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
          <span class="hasAgent" v-if="registration.agentUid">
            <router-link
              :to="{
                name: 'dashTeamid',
                params: { teamid: registration.agentUid },
              }"
              style="color: black;"
              >{{ getRegistrationTeamName(registration.agentUid) }}
            </router-link>
          </span>
        </div>
      </ul>
    </li>

    <hr class="sectionSeparator" />
    <h2>Endre status</h2>
    <textarea rows="5" cols="26" type="text" v-model="externalUrl" /><br />
    <button :class="{ saved: isSaved }" @click="saveExternalLink">
      Lagre status
    </button>
  </div>
</template>

<script>
import { db } from "../main";
import { getters, setters, constants } from "../store";

export default {
  beforeCreate() {
    setters.setActiveNav("teams");
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  name: "TeamDashboard",
  props: ["teamid"],
  data() {
    return {
      registrations: [],
      wishes: [],
      teams: [],
      koblinger: [],
      selectedTeamUid: this.teamid || "",
      externalUrl: "",
      isSaved: false,
      filterDays: [false, false, false, false, false],
    };
  },
  computed: {
    getters: () => getters,
    constants: () => constants,

    teamDays() {
      let hasMember = {};
      for (let team of this.teams) {
        hasMember[team.ownerUid] = [];
        for (let i = 0; i < 5; i++) {
          hasMember[team.ownerUid][i] = this.registrations.some(
            (r) =>
              r.primaryPerson.willAttendDay[i] && r.agentUid == team.ownerUid,
          );
        }
      }
      return hasMember;
    },

    chronologicalRegistrations() {
      if (!this || !this.registrations) {
        return;
      }
      // Find most recently edited
      let uidRecentEdit;
      let secondsRecentEdit = 0;
      for (let registration of this.registrations) {
        if (
          registration.edited &&
          registration.edited.seconds > secondsRecentEdit
        ) {
          secondsRecentEdit = registration.edited.seconds;
          uidRecentEdit = registration.id;
        }
      }
      let uidMostRecentEdited = uidRecentEdit;

      let shallow = this.registrations.slice();
      let sorted = shallow;
      sorted.sort((a, b) => {
        return a.created.seconds - b.created.seconds;
      });

      let copy = [];

      for (let i = 0; i < sorted.length; i++) {
        let registration = sorted[i];

        if (!registration.removedBy) {
          copy.push(registration);
        }

        registration.counter = i + 1;
        if (registration.edited.seconds !== registration.created.seconds) {
          let hoursAgo =
            (Date.now() - registration.edited.toMillis()) / 1000 / 60 / 60 / 24;
          registration.displayEdited =
            "(endret " + hoursAgo.toFixed(1) + " dager siden)"; // inserted property

          registration.isMostRecentEdited =
            registration.id === uidMostRecentEdited // inserted property
              ? "->"
              : "";
        }
      }
      return copy;
    },

    chronologicalWishes() {
      if (!this || !this.wishes) {
        return;
      }
      // Find most recently edited
      let uidRecentEdit;
      let secondsRecentEdit = 0;
      for (let wish of this.wishes) {
        if (wish.edited && wish.edited.seconds > secondsRecentEdit) {
          secondsRecentEdit = wish.edited.seconds;
          uidRecentEdit = wish.id;
        }
      }
      let uidMostRecentEdited = uidRecentEdit;

      let copy = [];

      for (let i = 0; i < this.wishes.length; i++) {
        let wish = this.wishes[i];
        if (!wish.isDiscarded) {
          //UI also prohibits discarding before un-assigning
          copy.push(wish);
        } else {
          continue;
        }

        if (wish.edited.seconds !== wish.created.seconds) {
          let hoursAgo =
            (Date.now() - wish.edited.toMillis()) / 1000 / 60 / 60 / 24;
          wish.displayEdited =
            "(endret " + hoursAgo.toFixed(1) + " dager siden)";

          wish.isMostRecentEdited = wish.id === uidMostRecentEdited ? "->" : "";
        }
      }
      return copy
        .sort((a, b) => a.created.seconds - b.created.seconds)
        .filter((w) => w.agentUid === this.selectedTeamUid); // only agent-assigned? yes
    },

    myTeamRegistrations() {
      return this.chronologicalRegistrations.filter(
        (r) => r.agentUid === this.selectedTeamUid,
      );
    },
    sortedTeams() {
      return this.teams
        .slice()
        .sort((a, b) => a.teamName.localeCompare(b.teamName));
    },
  },
  firestore() {
    let koblinger;
    if (this.selectedTeamUid && getters.user().uid === constants.adminUid) {
      koblinger = db
        .collection("koblinger")
        .where("teamId", "==", this.selectedTeamUid);
    }
    return {
      registrations: db.collection("registrations"),
      wishes: db.collection("wishes"),
      teams: db.collection("teams"),
      koblinger: koblinger,
    };
  },
  watch: {
    selectedTeamUid: {
      immediate: true,
      async handler(teamUid) {
        // Existing logic
        // this.doSomething();

        // VueFire rebinding logic
        if (!teamUid || getters.user().uid !== constants.adminUid) {
          this.koblinger = [];
          return;
        }
        const ref = db.collection("koblinger").where("teamId", "==", teamUid);
        await this.$bind("koblinger", ref);

        this.$router.replace({ path: "/dash/" + teamUid });
        this.updateExternalUrl();
      },
    },
    teams: function() {
      this.updateExternalUrl();
    },
  },
  methods: {
    getRegistrationTeamName(agentUid) {
      let teamObject = this.teams.filter((t) => t.ownerUid === agentUid)[0];
      let teamName = (teamObject && teamObject.teamName) || "";
      return teamName;
    },

    saveExternalLink() {
      if (this.selectedTeamUid) {
        db.collection("teams")
          .doc(this.selectedTeamUid)
          .set({ externalLink: this.externalUrl }, { merge: true })
          .then(() => {
            // alert("Lagret ✅ ")
            this.isSaved = true;
            setTimeout(() => (this.isSaved = false), 2000);
          })
          .catch(function(error) {
            alert("Kunne ikke lagre. (" + error + ")");
          });
      }
    },

    updateExternalUrl() {
      let teamObject = this.teams.filter(
        (t) => t.ownerUid === this.selectedTeamUid,
      )[0];
      this.externalUrl = (teamObject && teamObject.externalLink) || "";
    },
    handleKeyDown(e) {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isSaveShortcut =
        (isMac && e.metaKey && e.key === "s") ||
        (!isMac && e.ctrlKey && e.key === "s");

      if (
        isSaveShortcut &&
        // this.adminNick && //kun på wish
        getters.user().uid == constants.adminUid // kun admin fortsatt
      ) {
        e.preventDefault();
        this.saveExternalLink();
      }
    },
    toggleKoblingConfirmed(id, value) {
      if (id) {
        db.collection("koblinger")
          .doc(id)
          .set({ confirmed: value }, { merge: true })
          .then(() => {
            // alert("Lagret kobling ✅ ");
          })
          .catch(function(error) {
            alert("Kunne ikke lagre kobling. (" + error + ")");
          });
      }
    },
    deleteKobling(id, wishTitle) {
      if (confirm("Slette kobling til " + wishTitle + "?")) {
        db.collection("koblinger")
          .doc(id)
          .delete();
      }
    },
    getAddress(kobling) {
      const wish = this.wishes.find((w) => w.id === kobling.wishId);
      return wish
        ? wish.target.address || "(gateadresse manglet)"
        : "(fant ikke oppdraget)";
    },
  },
};
</script>

<style scoped>
h2 {
  margin-top: 0.5em;
}
.dayTitle {
  margin: 1em 0 0.5em;
}
.edited_tag {
  opacity: 0.5;
}
button.saved {
  background-color: rgb(114, 237, 114);
}
.filter_checkboxes input[type="checkbox"] {
  margin-right: 0.3em;
}
.filter_checkboxes {
  color: white !important;
  background-color: #666;
  padding: 1em;
  padding-bottom: 0;
  border-radius: 4px;
}
hr.sectionSeparator {
  width: 20%;
  border: dashed 1px silver;
  margin-left: 0;
}
</style>
