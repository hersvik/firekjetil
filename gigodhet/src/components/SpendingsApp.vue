<template>
  <div class="container container_under_nav">
    <h1>SpendingsApp</h1>

    <li class="list-group">
      <ul>
        <input v-model="newSpending.amount" class="form-control" placeholder="Amount spent" type="number" />
        <input v-model="newSpending.text" class="form-control" placeholder="Optional note" type="text" />
        <button @click="save">Save</button>
      </ul>
      <ul>
        <span class="light_text">Daily budget:</span>
          {{dailyAllowance}}
          <span v-if="!isNaN(dailyAllowance)" class="light_text">(~ {{dailyAllowance * 30}} monthly)</span>
      </ul>
      <ul v-for="(spending) in spendingsWithBalance" :key="spending.id" class="list-group-item">
        {{spending.created && spending.created.toDate().toLocaleDateString()}}
        <span style="opacity: 0.5">{{spending.text}}</span>
        {{spending.amount}}
        <span class="float_right">{{spending.balance}}</span>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, setters, constants} from '../store';

  export default {
    beforeCreate() {
      setters.setActiveNav("pameldinger");
    },
    name: "SpendingsApp",
    data () {
      return {
        dailyAllowance: this.$route.query.daily || "add this to the website URL: ?daily=<your budget number>&text=<optional>",
        spendings: [],
        newSpending: {
          text: this.$route.query.text || "",
        },
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
      spendingsWithBalance() {
        if (!this.spendings[0])
          return;

        let spendings = this.spendings.slice();
        spendings.sort((a, b) => a.created.toDate() - b.created.toDate() );

        let result = [];
        let dailyAllowance =  this.dailyAllowance;

        let firstTimestamp = spendings[0].created;
        let totalSpending = 0;

        let daysStarted = (millisecondsElapsed) => 1 + Math.floor(millisecondsElapsed / 1000 / 60 / 60 / 24);

        for (let spending of spendings) {
          totalSpending += spending.amount;
          let elapsed = spending.created.toDate() - firstTimestamp.toDate();

          spending.balance = daysStarted(elapsed) * dailyAllowance - totalSpending;
          result.unshift(spending);
        }

        let elapsed = new Date() - firstTimestamp.toDate();
        let statusNow = {
          text: `Balance today`,
          balance: daysStarted(elapsed) * dailyAllowance - totalSpending,
        }
        result.unshift(statusNow);

        return result;
      }
    },
    firestore () {
      if (getters.user().uid) {
        return {
          spendings: db.collection("spendings").where("ownerUid", "==", getters.user().uid)
        };
      }
    },
    methods: {
      save () {
        if (!this.newSpending.amount) {
          return;
        }

        debugger
        this.alreadyLoaded = false; // Avoids watch alert
        this.newSpending.ownerUid = getters.user().uid;
        this.newSpending.created = new Date();
        this.newSpending.amount = Number(this.newSpending.amount);

        db.collection("spendings").add(this.newSpending)
          .then(() => {
            this.newSpending.amount = "";
            this.newSpending.text = this.$route.query.text;
            // this.$router.push("/regs");
          });

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