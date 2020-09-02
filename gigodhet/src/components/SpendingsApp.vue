<template>
  <div class="container container_under_nav">
    <h1>SpendingsApp</h1>

    <li class="list-group">
      <ul>
        <input v-model="newSpending.amount" class="form-control" placeholder="" type="number" />
        <input v-model="newSpending.text" class="form-control" placeholder="" type="text" />
        <button @click="save">Save</button>
      </ul>
      <ul v-for="(spending) in spendingsWithBalance" :key="spending.id" class="list-group-item">
        {{spending.created.toDate().toLocaleDateString()}}
        <span style="opacity: 0.5">;{{spending.text}}</span>
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
        let result = [];
        let monthlyAllowance = 9000;
        let dailyAllowance = monthlyAllowance / 30;

        if (!this.spendings[0])
          return;

        let firstDate = this.spendings[0].created;
        let totalSpending = 0;

        for (let spending of this.spendings) {
          totalSpending += spending.amount;
          let millisecondsSinceFirst = spending.created.toDate() - firstDate.toDate();
          let fullDaysEllapsed = Math.floor(millisecondsSinceFirst / 1000 / 60 / 60 / 24);

          spending.balance = fullDaysEllapsed*dailyAllowance - totalSpending;
          result.push(spending);
        }

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
        this.alreadyLoaded = false; // Avoids watch alert
        this.newSpending.ownerUid = getters.user().uid;
        this.newSpending.created = new Date();
        this.newSpending.amount = Number(this.newSpending.amount);

        db.collection("spendings").add(this.newSpending)
          .then(() => {
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