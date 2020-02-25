import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BASEAPI,
  timeout: 10000,
  auth: {
    username: process.env.VUE_APP_USERAUTH,
    password: process.env.VUE_APP_PASSAUTH
  }
})

const state = {
  boardList: null
}

const mutations = {
  update_board(state, newData) {
    state.boardList = newData
  }
}

const actions = {
  getEmployees() {
    return new Promise((resolve, reject) => {
      try {
        const response = apiClient.get('/employees')
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  },
  getEmployeesById(ctx, payload) {
    return new Promise((resolve, reject) => {
      try {
        const response = apiClient.get('/employees/' + payload)
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  },
  postEmployees(ctx, payload) {
    return new Promise((resolve, reject) => {
      try {
        const response = apiClient.post('/employees', payload)
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  },
  putEmployees(ctx, payload) {
    return new Promise((resolve, reject) => {
      try {
        const response = apiClient.put('/employees/' + payload.id, payload.body)
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  },
  deleteEmployees(ctx, payload) {
    return new Promise((resolve, reject) => {
      try {
        const response = apiClient.delete('/employees/' + payload)
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
