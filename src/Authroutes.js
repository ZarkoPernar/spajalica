import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Link,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

import Login from './Login'

class AuthRoutes extends Component {
  isAuthRoute() {
    return ['/login', '/register', '/forgetpass'].includes(
      this.props.location.pathname
    )
  }

  render() {
    return (
      <div>
        {this.isAuthRoute() ? null : <Redirect to="/login" />}
        <Route component={Login} path="/login" />
      </div>
    )
  }
}

AuthRoutes.propTypes = {}

export default AuthRoutes
