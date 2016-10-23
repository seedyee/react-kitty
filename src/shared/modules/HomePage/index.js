import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Markdown from 'react-markdown'
import Styles from './Home.css'
import { selectUsers } from './selectors'

const content = `
# Hello from Markdown

This is a paragraph rendered using Markdown.

* First Argument
* Second Argument
* Third Argument
`

function Home({ users }) {
  return (
    <div className={Styles.Home}>
      <Helmet title="Home" />
      <p className={Styles.intro}>
        Produced with ❤️ by <a href="https://github.com/seedyee">seedyee</a>
      </p>
      <Markdown source={content} />
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
