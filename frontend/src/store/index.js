import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: null
  },
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.user
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  actions: {
    login({ commit }, { user, token }) {
      commit('setUser', user);
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  modules: {}
})