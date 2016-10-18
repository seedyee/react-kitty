import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Markdown from 'react-markdown'
import Styles from './Home.css'

const content = `
# Hello from Markdown

This is a paragraph rendered using Markdown.

* First Argument
* Second Argument
* Third Argument
`

function Home() {
  return (
    <div>
      <Helmet title="Home" />
      <p className={Styles.intro}>
        Produced with ❤️ by <a href="https://github.com/seedyee">seedyee</a>
      </p>
      <Markdown source={content} />
    </div>
  )
}
export default connect()(Home)
