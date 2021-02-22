<template>
  <div class="container container_under_nav">

    <li class="list-group">
      <ul style="margin-bottom: 1.5em;">
        {{estimate && estimate.toLocaleTimeString("no-NO", {weekday: "long", hour: '2-digit', minute:'2-digit'})}}
        ...<span class="light_text">({{ estimateHoursAndMinutes }})</span>
      </ul>
      <ul>
        <button @click="preSave = true" v-if="preSave == false">Add now</button>
        <button @click="save" v-if="preSave == true" style="float: right">Confirm</button>
      </ul>
      <ul style="margin-bottom: 1em;">
        <span class="light_text">{{ new Date().toLocaleTimeString("no-NO", {weekday: "long", hour: '2-digit', minute:'2-digit'})}} - </span>
        <span style="color: black">{{dailyGobs[1] > 2 ? 2 - dailyGobs[0] : 3 - dailyGobs[0]}} left</span>
      </ul>
      <ul v-for="(gob, idx) in sortedGobs.slice(0, 3)" :key="gob.id" class="list-group-item no_background">
        <span class="dot" v-if="gob.time.toDate().toDateString() == (new Date()).toDateString()" />
        {{gob.time && gob.time.toDate().toLocaleTimeString("no-NO", {weekday: "long", hour: '2-digit', minute:'2-digit'})}}
        <span class="light_text">{{idx === 0
          ? ((newDate - gob.time.toDate())/1000/60/60).toFixed(1) + "h ago"
          : ((sortedGobs[idx-1].time.toDate() - gob.time.toDate())/1000/60/60).toFixed(1) + "h before"}}</span>
      </ul>
      <ul v-for="(numGobs, idx) in dailyGobs.slice(0, 3)" :key="idx" class="list-group-item" :class="{'strong_border': idx === 0}">
        {{numGobs}}
        <span class="float_right">-</span>
      </ul>
      <ul>
        <span class="light_text">{{average.numDays}}-day average:</span>
          {{average.value.toFixed(2)}} per day
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
    created() {
      setInterval( () => {
        this.newDate = new Date();
      }, 1000)
    },
    name: "CycleApp",
    data () {
      return {
        gobs: [],
        newDate: new Date(),
        preSave: false,
      }
    },
    watch: {
      newDate() {

        let hoursRemaining = (this.estimate - this.newDate)/1000/60/60;

        let color = ""
        if (hoursRemaining < -2)
          color = "#f9a";//red
        else if (hoursRemaining < 0)
          color = "#fdb";//"orange"
        else if (hoursRemaining < 2)
          color = "#ffa";//yellow
         else
           color = "white";//older: "#9f9";//"green";

        document.querySelector('body').style.backgroundColor = color;      }
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
        let numDays = 4;
        let dayTo = this.dailyGobs.length > numDays+1 ? numDays+1 : this.dailyGobs.length;
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
        let hoursDecimal = (this.estimate - this.newDate )/1000/60/60;
        let sign = hoursDecimal/Math.abs(hoursDecimal);
        hoursDecimal = Math.abs(hoursDecimal);
        let wholeHours = hoursDecimal - hoursDecimal % 1;
        let minutes = (hoursDecimal - wholeHours) * 60;
        let minutesStr = (minutes < 10 ? "0":"") + Math.floor(minutes);
        let seconds = (minutes % 1) * 60;
        let secondsStr = Math.floor(seconds);
        return (sign < 0 ? "-":"") + wholeHours + "h " + minutesStr + "m " + secondsStr;
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
        this.preSave = false;

        let that = this;
        db.collection("gobs").add({
          time: new Date(),
          ownerUid: getters.user().uid,
        })
          .then(() => {
            let timerDateTime = new Date();
            let alarmDateTime = new Date(that.estimate.getTime());
            alarmDateTime.setTime(alarmDateTime.getTime() - 1000*60 * 30) // alarm 30 minutes before estimate.
            let alarmHour = alarmDateTime.getHours();

            if(alarmHour >= 22 || alarmHour < 7) {
              if(that.dailyGobs[0] + that.dailyGobs[1] < 5) {
                timerDateTime.setHours(22, 0, 0);
              }
              else {
                timerDateTime.setHours(24 + 7, 0, 0);
              }
            }
            else {
              timerDateTime = new Date(that.estimate.getTime());
              timerDateTime.setTime(timerDateTime.getTime() - 1000*60 * 30); // alarm 30 minutes before estimate.
            }
            let timerMinutes = (timerDateTime - new Date())/1000/60;

            window.location.assign("shortcuts://run-shortcut?name=minutes_remaining&input="+(timerMinutes));
          });

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
  ul {
    margin-bottom: 0.5em;
  }
  .light_text {
    opacity: 0.5;
  }
  .float_right {
    float: right;
  }
  .strong_border {
    border: solid 2px #666;
  }
  .no_background {
    background: transparent;
  }
  .dot {
  height: 12px;
  width: 12px;
  background-color: #8af;
  border-radius: 50%;
  display: inline-block;
  margin:2px;
}
</style>