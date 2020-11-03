import React from 'react'

import { sitesUrls } from 'common'

import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          3rd Party Cookies Test Site A
        </a>
        <a href={sitesUrls.siteB} target="_blank">
          Go to Site B
        </a>
      </header>
    </div>
  )
}

export default App
