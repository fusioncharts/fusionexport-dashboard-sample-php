import service from "../util/service";

export default {
  FETCH_CHART_DATA: ({ commit, state }) => 
    state.homePageData 
      ? true
      : service
        .get(`/parse-json`)
        .then(response => 
          commit("SET_CHART_DATA", { 
            data: response.data 
          })
        ),
  
  SET_CHART_CONFIG({ commit }, data) {
    switch (data.key) {
      case 'state': 
        commit('SET_STATE_CHART_CONFIG', data.config);
        return;
      case 'advisors':
        commit('SET_ADVISORS_CHART_CONFIG', data.config);
        return;
      case 'regionswise':
        commit('SET_REGIONWISE_CHART_CONFIG', data.config);
        return;
      case 'overtime':
        commit('SET_OVERTIME_CHART_CONFIG', data.config);
        return;
      case 'product':
        commit('SET_PRODUCT_CHART_CONFIG', data.config);
        return;
      default:
        console.log(`No key matched for ${data.key}`);
    }
  },
};