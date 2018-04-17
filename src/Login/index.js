import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Card } from 'antd'

import LoginForm from './LoginForm'
import './login.css'

const { TabPane } = Tabs

const tabList = [
    {
        key: 'tab1',
        tab: 'Prijava',
    },
    {
        key: 'tab2',
        tab: 'Registracija',
    },
]

const contentList = {
    tab1: <LoginForm />,
}

class Login extends Component {
    state = {
        key: 'tab1',
    }

    onTabChange(value, key) {
        this.setState({
            [key]: value,
        })
    }

    render() {
        return (
            <div className="login-page">
                <Card
                    tabList={tabList}
                    onTabChange={key => {
                        this.onTabChange(key, 'key')
                    }}
                >
                    {contentList[this.state.key]}
                </Card>
            </div>
        )
    }
}

Login.propTypes = {}

export default Login
