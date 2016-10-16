export const selectLocationState = () => { // eslint-disable-line
  let prevRoutingState
  let prevRoutingStateJS

  return (state) => {
    const routingState = state.get('routing') // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }

    return prevRoutingStateJS
  }
}
