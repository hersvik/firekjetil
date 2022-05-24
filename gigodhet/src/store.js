import Vue from 'vue';

const state = Vue.observable({
  user: {},
  activeNav: "",
});

export const getters = {
  user: () => state.user,
  activeNav: () => state.activeNav,
  authDisplayNameSplitted() {
    let nameParts = getters.user().displayName.split(" ");
    let result = {};
    result.firstName = nameParts[0] || "";
    if(nameParts.length > 1){
      result.lastName = nameParts.slice(-1)[0];
    }
    else {
      result.lastName = "";
    }
    return result;
  },
}

export const setters = {
  setUser: (user) => state.user = user,
  setActiveNav: (nav) => state.activeNav = nav,
}

export const constants = {
  campaignDays: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag'],
  adminUid: "M7BpZGRkH4hgut24BPknSOVB2H02",
  dataDisclosure: "Ved bruk av dette skjema samtykker du til at opplysningene lagres i 3 måneder og håndteres av arrangementets sekretariat samt utvalgte nødvendige samarbeidspersoner - aktsomt og ut fra rimelig behov.",
}