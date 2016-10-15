import React from 'react'
import Markdown from 'react-markdown'
import Helmet from 'react-helmet'

import Styles from './About.css'

const content = `
# Hello from Markdown

This is a paragraph rendered using Markdown.

* First Argument
* Second Argument
* Third Argument
`

function About() {
  return (
    <article>
      <Helmet title="About" />
      <p className={Styles.intro}>
        Produced with ❤️ by <a href="https://github.com/seedyee">seedyee</a>
      </p>
      <Markdown source={content} />
    </article>
  )
}

export default About
