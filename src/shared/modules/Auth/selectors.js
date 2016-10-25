import { createSelector } from 'reselect'

const selectAuth = state => state.get('auth')

export const selectUser = createSelector(
  selectAuth,
  auth => auth.get('user')
)

export const selectLogined = createSelector(
  selectAuth,
  auth => auth.get('logined')
)
