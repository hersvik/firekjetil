import Vue from 'vue';

const state = Vue.observable({
  user: {},
  activeNav: "",
});

export const getters = {
  user: () => state.user,
  activeNav: () => state.activeNav,
}

export const setters = {
  setUser: (user) => state.user = user,
  setActiveNav: (nav) => state.activeNav = nav,
}

export const constants = {
  adminUid: "M7BpZGRkH4hgut24BPknSOVB2H02",
  hasDailyAttendanceFeature: false,
}