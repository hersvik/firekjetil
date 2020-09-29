<template>
  <div class="container container_under_nav">
    <h1>CycleApp</h1>

    <li class="list-group">
      <ul>
        {{estimate && estimate.toLocaleTimeString()}}
        <span class="light_text">({{ estimateHoursAndMinutes }})</span>
      </ul>
      <ul>
        <button @click="save">Save</button>
      </ul>
      <ul>
        <span class="light_text">{{average.numDays}}-day average:</span>
          {{average.value.toFixed(2)}} per day
      </ul>
      <ul v-for="(numGobs, idx) in dailyGobs.slice(0, 3)" :key="idx" class="list-group-item">
        {{numGobs}}
        <span class="float_right">-</span>
      </ul>
      <ul v-for="(gob) in sortedGobs" :key="gob.id" class="list-group-item">
        {{gob.time && gob.time.toDate().toLocaleDateString()}} {{gob.time && gob.time.toDate().toLocaleTimeString()}}
        <span class="float_right">:D</span>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {
    getters,
    // setters,
    constants
  } from '../store';

  export default {
    beforeCreate() {
      // setters.setActiveNav("pameldinger");
    },
    name: "CycleApp",
    data () {
      return {
        gobs: [],
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
      dailyGobs() {

        let dateToday = new Date()
        dateToday.setHours(3,0,0,0);

        let msToday00 = dateToday.getTime();

        return this.gobs.reduce(
          (out, entry) => {
            let ms = entry.time.toDate().getTime();
            let daysAgo = Math.ceil((msToday00 - ms)/1000/60/60/24);

            if (!out[daysAgo])
              out[daysAgo] = 0;

            out[daysAgo]++;
            return out;
          }
        , [])

      },
      average() {
        let dayTo = this.dailyGobs.length > 11 ? 11 : this.dailyGobs.length;
        let sum = 0;

        for (let i=1; i<dayTo; i++) {
          sum += this.dailyGobs[i] || 0;
        }
        let average = sum / (dayTo - 1);

        return {
          numDays: dayTo - 1,
          value: average,
        }
      },
      sortedGobs() {
        return this.gobs.slice().sort( (a, b) => (b.time.toDate() - a.time.toDate()) );
      },
      estimate() {
        if (this.sortedGobs.length < 2)
          return;
        let ms0 = this.sortedGobs[0].time.toMillis();
        let ms1 = this.sortedGobs[1].time.toMillis();

        if (this.sortedGobs.length < 3) {
          return new Date(ms0 * 0.5 + ms1 * 0.5 + 1000*60*60 * 36/2.5);
        }

        let ms2 = this.sortedGobs[2].time.toMillis();
        let result = new Date(ms0 * 0.4 + ms1 * 0.4 + ms2 * 0.2 + 1000*60*60 * 17.28)
        return result;
      },
      estimateHoursAndMinutes() {
        if(!this.estimate)
          return "";
        let hoursDecimal = (this.estimate - new Date() )/1000/60/60;
        let sign = hoursDecimal/Math.abs(hoursDecimal);
        hoursDecimal = Math.abs(hoursDecimal);
        let wholeHours = hoursDecimal - hoursDecimal % 1;
        let minutes = (hoursDecimal - wholeHours) * 60;
        let minutesStr = (minutes < 10 ? "0":"") + Math.floor(minutes);
        return (sign < 0 ? "-":"") + wholeHours + "h " + minutesStr + "m";
      },
    },
    firestore () {
      if (getters.user().uid) {
        return {
          gobs: db.collection("gobs")
                  .where("ownerUid", "==", getters.user().uid)
                  // .orderBy("time")
        };
      }
    },
    methods: {
      save () {
        if (!confirm("Bekreft"))
          return

        db.collection("gobs").add({
          time: new Date(),
          ownerUid: getters.user().uid,
        })
          .then(() => {});

        let idsToDelete = this.gobs.slice().filter(gob => gob.time.seconds + 60*60*24*15 < Date.now()/1000)
                                            .map(gob => gob.id);
        for(let idToDelete of idsToDelete) {
          db.collection("gobs").doc(idToDelete).delete()
          .then(function() {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });
        }
      },
    }
  }
</script>

<style scoped>
  .light_text {
    opacity: 0.5;
  }
  .float_right {
    float: right;
  }
</style>