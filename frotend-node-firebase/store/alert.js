export const  state = () => ({
  visible: false,
  message: '',
  type: 'info'
})

export const mutations = {
  SHOW_ALERT (state, {message, type}) {
    state.visible = true,
    state.message = message,
    state.type = type
  },
  HIDE_ALERT (state) {
    state.visible = false,
    state.message = '',
    state.type = 'info'
  }
}


export const actions = {
  triggerAlert({ commit }, payload) {
    commit('SHOW_ALERT', payload);
    setTimeout(() => {
      commit('HIDE_ALERT');
    }, 3000);
  }
}