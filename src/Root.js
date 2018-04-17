import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as firebase from 'firebase'
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

import App from './App'
import AuthRoutes from './Authroutes'
import './print.css'

firebase.initializeApp({
  apiKey: 'AIzaSyAMdiKFMYQaHQmvBT151V9zuri-hl5-qPY',
  authDomain: 'spajalica.firebaseapp.com',
  projectId: 'firebase-spajalica',
  // databaseURL: 'https://spajalica.firebaseio.com',
})

class Root extends Component {
  auth = firebase.auth()
  state = {
    isLoaded: false,
    currentUser: this.auth.currentUser,
  }

  componentDidMount() {
    this.auth.onAuthStateChanged(currentUser => {
      this.setState({
        isLoaded: true,
        currentUser,
      })
    })
  }

  render() {
    if (!this.state.isLoaded) return null

    return (
      <Router>
        {this.state.currentUser ? (
          <Route
            path=""
            render={history => {
              return (
                <App
                  user={this.state.currentUser}
                  location={history.location}
                />
              )
            }}
          />
        ) : (
          <Route path="" component={AuthRoutes} />
        )}
      </Router>
    )
  }
}

Root.propTypes = {}

export default Root
