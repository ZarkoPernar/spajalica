import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import * as firebase from 'firebase'
const FormItem = Form.Item

const errorMessages = {
  'auth/user-not-found': 'Korisnik sa ovom email adresom ne postoji',
  'auth/wrong-password': 'Password nije ispravan za ovog korisnika',
}

class LoginForm extends React.Component {
  state = {
    isLoading: false,
  }
  handleSubmit = e => {
    this.setState({
      isLoading: true,
    })
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.login(values)
        console.log('Received values of form: ', values)
      }
    })
  }

  login({ userName, password }) {
    const auth = firebase.auth()

    auth
      .signInWithEmailAndPassword(userName, password)
      .then(res => {
        this.setState({
          error: null,
          isLoading: false,
        })
      })
      .catch(error => {
        console.log(error)

        this.setState({
          error: errorMessages[error.code],
          isLoading: false,
        })
      })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: 'Please input your username!',
              },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your Password!',
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          <div>
            <a className="login-form-forgot" href="">
              Zaboravili ste password?
            </a>
          </div>
          <div>
            <Button
              loading={this.state.isLoading}
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Prijava
            </Button>
          </div>
          <div>
            Ili <a href="">registrirajte novi racun!</a>
          </div>
        </FormItem>

        {!this.state.error ? null : (
          <div style={{ color: 'red' }}>{this.state.error}</div>
        )}
      </Form>
    )
  }
}

const WrappedLoginForm = Form.create()(LoginForm)

export default WrappedLoginForm
