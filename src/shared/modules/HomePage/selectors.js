import { createSelector } from 'reselect'

const selectHome = () => (state) => state.get('home')

export const selectUsers = createSelector(
  selectHome(),
  (home) => home.get('users')
)
