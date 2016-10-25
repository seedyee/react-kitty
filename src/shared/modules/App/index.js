import React from 'react'
import Helmet from 'react-helmet'
import { camelCase } from 'lodash'
import { Match, Miss } from 'react-router'

import 'normalize.css/normalize.css'
import './Fonts.css'
import './Reset.css'
import Styles from './App.css'

import Nav from '../Nav'
import HomePage from '../HomePage'
import DashboardPage from '../DashboardPage'
import AboutPage from '../AboutPage'
import LoginPage from '../Auth/LoginPage'
import RegisterPage from '../Auth/RegisterPage'
import NotFoundPage from '../NotFoundPage'

const websiteDescription = 'A NodeJS V6 Universal React Boilerplate with an Amazing Developer Experience.'

if (process.env.NODE_ENV === 'development') {
  console.log('ES Modules Supported:', camelCase('hello-world') === 'helloWorld')
}

function App() {
  return (
    <main>
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        titleTemplate="react-kitty - %s"
        defaultTitle=""
        meta={[
          { name: 'description', content: websiteDescription },
        ]}
      />
      <div className={Styles.App}>
        <Nav />
        <Match exactly pattern="/" component={HomePage} />
        <Match pattern="/home" component={HomePage} />
        <Match pattern="/about" component={AboutPage} />
        <Match pattern="/dashboard" component={DashboardPage} />
        <Match pattern="/login" component={LoginPage} />
        <Match pattern="/register" component={RegisterPage} />
        <Miss component={NotFoundPage} />
      </div>
    </main>
  )
}


export default App
