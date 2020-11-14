import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { NoteTaker } from './note-taker'


export function App() {
    return <Router><Switch>
        <Route path="/cookies/:useStorageAccessAPI?" render={() => <NoteTaker storage="cookies" />} />
        <Route path="/local-storage/:useStorageAccessAPI?" render={() => <NoteTaker storage="localStorage" />} />
        <Redirect to="/cookies" />
    </Switch>
    </Router>
}



