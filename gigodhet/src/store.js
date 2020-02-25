import Vue from 'vue';

const state = Vue.observable({
  user: {},
});

export const getters = {
  user: () => state.user,
}

export const setters = {
  setUser: (user) => state.user = user,
}

export const constants = {
  adminUid: "M7BpZGRkH4hgut24BPknSOVB2H02",
}