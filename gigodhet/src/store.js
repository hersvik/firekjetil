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
  hasDailyAttendanceFeature: false,
  dataDisclosure: "Ved bruk av dette skjema samtykker du til at opplysningene lagres en periode og håndteres av arrangementets sekretariat samt utvalgte nødvendige samarbeidspersoner - aktsomt og ut fra rimelig behov.",
  welcomeUnfinishedFormMessage: "Dersom skjemaet er uferdig kan du legge inn en kommentar om det og likevel lagre.",
}