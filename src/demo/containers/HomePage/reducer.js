const initState = {
  user: 'vimniky',
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'SWITCH_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}
