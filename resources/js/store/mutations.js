import Vue from "vue";

export default {
  SET_CHART_DATA: (state, { data }) => {
    Vue.set(state, "chartData", data);
  },

  SET_STATE_CHART_CONFIG(state, config) {
    Vue.set(state.chartConfig, 'stateChart', config);
  },

  SET_ADVISORS_CHART_CONFIG(state, config) {
    Vue.set(state.chartConfig, 'advisorsChart', config);
  },

  SET_REGIONWISE_CHART_CONFIG(state, config) {
    Vue.set(state.chartConfig, 'regionswiseChart', config);
  },

  SET_OVERTIME_CHART_CONFIG(state, config) {
    Vue.set(state.chartConfig, 'overtimeChart', config);
  },

  SET_PRODUCT_CHART_CONFIG(state, config) {
    Vue.set(state.chartConfig, 'productChart', config);
  },
};
