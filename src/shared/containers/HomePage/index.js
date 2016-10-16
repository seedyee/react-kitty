import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { hello } from './actions'

function Home({ hello: sayHello }) {
  return (
    <article>
      <Helmet title="Home" />
      <p onClick={sayHello}>
        Home Component
      </p>
    </article>
  )
}
export default connect(null, { hello })(Home)
