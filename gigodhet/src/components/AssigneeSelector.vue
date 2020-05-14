<template>

  <select @input="$emit('input', $event.target.value)" class="custom-select">
    <option value="" />
    <option
      v-for="(registration) in registrations"
      :key="registration.id"
      :value="registration.id"
      :selected="value === registration.id">
        {{otherBusyness[registration.id]}}
        (<!--{{registration.dailyAttendance[0].adult}}/ [[comment: if hasDailyAttendanceFeature]]-->{{registration.participants.length + 1}}){{registration.familiegodhet ? "F" : ""}} -
        {{registration.primaryPerson.firstName}}
        {{registration.primaryPerson.lastName}}
        - [{{registration.status.substr(0, 40)}}{{registration.status.length > 40 ? "..." : ""}}]
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