<template>
  <div class="container container_under_nav">
    <h1>SpendingsApp</h1>

    <li class="list-group">
      <ul>
        <input v-model="newSpending.amount" class="form-control" placeholder="Cost (amount)" type="number" />
        <input v-model="newSpending.text" class="form-control" placeholder="Name or Description" type="text" />
        <button @click="save">Save</button>
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
        spendings: [],
        newSpending: {
          text: this.$route.query.text,
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
        let monthlyAllowance = 9000;                // User input <-- (monthly allowance)
        let dailyAllowance = monthlyAllowance / 30; // Conversion to daily allowance

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
        let hoursElapsed = elapsed/1000/60/60;
        let completedDays = daysStarted(elapsed) - 1;
        let hoursSinceAllowance = hoursElapsed - 24 * completedDays;
        let nextAllowanceHours = (24 - hoursSinceAllowance).toFixed(0);
        let statusNow = {
          text: `Balance now, next allowance in ${nextAllowanceHours} hours`,
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
        debugger
        if (!this.newSpending.amount) {
          return;
        }

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
  .edited_tag {
    opacity: 0.5;
  }
  .float_right {
    float: right;
  }
</style>