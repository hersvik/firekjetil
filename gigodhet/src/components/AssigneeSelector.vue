<template>

  <select @input="$emit('input', $event.target.value)" class="custom-select">
    <option
      v-for="(registration) in registrations"
      :key="registration.id"
      :value="registration.id"
      :selected="value === registration.id">
        {{otherBusyness[registration.id]}}
        ({{registration.dailyAttendance[0].adult}}/{{registration.participants.length + 1}})
        {{registration.primaryPerson.firstName}}
        {{registration.primaryPerson.lastName}}
    </option>
  </select>

</template>

<script>
  export default {
    name: "AssigneeSelector",
    props: ["value", "registrations", "day", "wishRef", ],
    computed: {
      otherBusyness() {

        let result = {};
        for (let registration of this.registrations) {
          let missions = registration["missionDay"+this.day] || [];
          let otherOnSameDay = missions.filter(el => el !== this.wishRef).length || 0;

          result[registration.id] = "";
          for (let i=0; i<otherOnSameDay; i++) {
            result[registration.id] += "*";
          }
        }
        return result;

      }
    }
  }
</script>