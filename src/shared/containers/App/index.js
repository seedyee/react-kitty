import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { camelCase } from 'lodash-es'
import 'normalize.css/normalize.css'
import './Fonts.css'
import Styles from './App.css'
import Nav from '../Nav'

const websiteDescription = 'A NodeJS V6 Universal React Redux Boilerplate with an Amazing Developer Experience.'

console.log('ES Modules Supported:', camelCase('hello-world') === 'helloWorld')

function App({ children }) {
  return (
    <main>
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        titleTemplate="react-kitty - %s"
        defaultTitle="react-kitty"
        meta={[
          { name: 'description', content: websiteDescription },
        ]}
      />
      <div className={Styles.App}>
        <Nav />
        <div>
          {children}
        </div>
      </div>
    </main>
  )
}

App.propTypes = {
  children: PropTypes.node,
}

export default App
