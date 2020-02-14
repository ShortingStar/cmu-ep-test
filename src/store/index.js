import Vue from 'vue'
import Vuex from 'vuex'
import employee from './employee'

Vue.use(Vuex)

const state = {}

const mutations = {}

const actions = {}

const modules = { employee }

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules
})
