<template>
  <div class="container container_under_nav">
    <a @click="$router.go(-1)">Tilbake</a><br /><br />

    <p style="color: silver">
      Liste-forklaring: dato team opprettet, <strong>Antall oppdrag</strong>,
      lenke til teamets info
    </p>
    <div
      v-for="team in chronologicalTeams"
      :key="team.ownerUid"
      style="margin: 0.5em"
    >
      {{ team.created && team.created.toDate().toLocaleDateString() }}
      <strong>{{ relatedWishesCount(team.ownerUid) }}</strong>
      <span
        v-for="kobling in unconfirmedKoblinger.filter(
          (k) => k.teamId === team.ownerUid,
        )"
        :key="kobling.id"
        @click="confirmLink(kobling.id, kobling.teamName, kobling.wishTitle)"
        style="cursor: pointer;"
        class="koblingClickable"
      >
        💥
      </span>
      &nbsp;
      <router-link
        :to="{ name: 'dashTeamid', params: { teamid: team.ownerUid } }"
        @click.native="handleClickTeam(team.ownerUid)"
        :class="{ last_opened: team.ownerUid === lastOpenedTeam }"
        >{{ team.teamName }}</router-link
      >
      <div v-if="team.externalLink">{{ team.externalLink }}</div>
    </div>
  </div>
</template>

<script>
import { db } from "../main";
import { getters, setters, constants } from "../store";

export default {
  beforeCreate() {
    setters.setActiveNav("teams");
  },
  created() {
    const storageTeam = localStorage.getItem("lastOpenedTeam");
    if (storageTeam) {
      this.lastOpenedTeam = storageTeam;
    }
  },
  mounted() {},
  name: "TeamsChronologically",
  props: [],
  data() {
    return {
      teams: [],
      wishes: [],
      koblinger: [],
      lastOpenedTeam: "",
    };
  },
  computed: {
    getters: () => getters,
    constants: () => constants,
    chronologicalTeams() {
      let copy = this.teams.slice();
      return copy.sort(
        (a, b) =>
          ((a.created && a.created.seconds) || 0) -
          ((b.created && b.created.seconds) || 0),
      );
    },
    unconfirmedKoblinger() {
      return this.koblinger.filter((k) => !k.confirmed);
    },
  },
  firestore() {
    return {
      teams: db.collection("teams").orderBy("teamName", "asc"),
      wishes: db.collection("wishes"),
      koblinger: db.collection("koblinger"),
    };
  },
  watch: {},
  methods: {
    relatedWishesCount(teamId) {
      let mainAssigns =
        (this.wishes &&
          this.wishes.filter((w) => w.agentUid === teamId).length) ||
        0;
      let extraAssigns =
        (this.koblinger &&
          this.koblinger.filter((k) => k.teamId == teamId).length) ||
        0;
      return mainAssigns + extraAssigns;
    },
    handleClickTeam(teamId) {
      localStorage.setItem("lastOpenedTeam", teamId);
    },
    // getRegistrationTeamName(agentUid){
    //   let teamObject = this.teams.filter(t => t.ownerUid === agentUid)[0];
    //   let teamName = teamObject && teamObject.teamName || "";
    //   return teamName;
    // },
    confirmLink(koblingId, teamName, wishTitle) {
      if (
        confirm(
          "Bekrefte kobling? mellom " +
            teamName +
            " og oppdrag '" +
            wishTitle +
            "' (dvs. skjul 💥-merket)",
        )
      ) {
        if (koblingId) {
          db.collection("koblinger")
            .doc(koblingId)
            .set({ confirmed: true }, { merge: true })
            .then(() => {
              // alert("Lagret kobling ✅ ");
            })
            .catch(function(error) {
              alert("Kunne ikke lagre kobling. (" + error + ")");
            });
        }
      }
    },
  },
};
</script>

<style scoped>
h1 {
  margin-top: 0.5em;
}
.last_opened {
  text-decoration: underline;
}

.koblingClickable:hover {
  border: solid 2px orange;
}
.koblingClickable {
  border-radius: 3px;
  border: solid 2px transparent;
}
</style>
