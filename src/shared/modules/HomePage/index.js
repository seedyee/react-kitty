import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Styles from './Home.css'
import { selectUsers } from './selectors'

export function Home({ users }) {
  return (
    <div className={Styles.Home}>
      <Helmet title="Home" />
      <p className={Styles.intro}>
        Produced with ❤️ by <a href="https://github.com/seedyee">seedyee</a>
      </p>
      <hr />
      <h3> Users </h3>
      {users && users.map((user, i) => (<li key={i}> {user} </li>))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  users: selectUsers(state),
})
export default connect(mapStateToProps)(Home)
