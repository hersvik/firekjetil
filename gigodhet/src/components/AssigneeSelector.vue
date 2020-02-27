<template>

  <select @input="$emit('input', $event.target.value)" class="custom-select">
    <option
      v-for="(registration) in registrations"
      :key="registration.id"
      :value="registration.id"
      :selected="value === registration.id">
        ({{registration.participants.length + 1}})
        {{registration.primaryPerson.firstName}}
        {{registration.primaryPerson.lastName}}
    </option>
  </select>

</template>

<script>
  export default {
    name: "AssigneeSelector",
    props: ["value", "registrations", ]
  }
</script>