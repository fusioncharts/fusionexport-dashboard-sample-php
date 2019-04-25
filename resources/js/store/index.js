import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex);

export default function createStore() {
  return new Vuex.Store({
    state: {
      chartConfig: {
        stateChart: {},
        advisorsChart: {},
        regionswiseChart: {},
        overtimeChart: {},
        productChart: {},
      }
    },
    actions,
    mutations,
    getters
  });
}
