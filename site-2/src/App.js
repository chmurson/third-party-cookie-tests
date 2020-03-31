import React from 'react'
import logo from './logo.svg'
import './App.css'
import { sitesUrls } from 'common/sites-urls'

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
          Third Party Cookies Test Site B
        </a>
        <a href={sitesUrls.siteA} target="_blank">
          Go to Site A
        </a>
      </header>
    </div>
  )
}

export default App
