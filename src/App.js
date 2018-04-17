import React from 'react'
import 'antd/dist/antd.css'
import { message, Layout, Menu, Icon, Button } from 'antd'
import * as firebase from 'firebase'
import 'firebase/firestore'
import {
  Link,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

import './App.css'
import History from './History'
import Templates from './Templates'
import Custom from './Custom'
import createContainer from './firestore'

const { Header, Sider, Content } = Layout

class App extends React.Component {
  state = {
    collapsed: false,
  }

  toggle = () => {
    this.setState(state => ({
      collapsed: !state.collapsed,
    }))
  }

  logout = () => {
    firebase.auth().signOut()
  }

  isAppRoute() {
    return ['/', '/user', '/custom', '/templates', '/logout'].includes(
      this.props.location.pathname
    )
  }

  render() {
    const userData = {}
    return (
      <div className="App">
        {this.isAppRoute() ? null : <Redirect to="/" />}

        <Layout>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="App-logo">
              <a className="App-logo__link">Spajalica</a>
            </div>
            <Route
              path="*"
              render={props => {
                return (
                  <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[props.location.pathname]}
                    defaultSelectedKeys={['1']}
                  >
                    <Menu.Item key="/user">{userData.company_name}</Menu.Item>
                    <Menu.Item key="/">
                      <Link to="/">
                        <Icon type="calendar" />
                        <span>Povijest</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/custom">
                      <Link to="/custom">
                        <Icon type="edit" />
                        <span>Vlastiti Zadatak</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/templates">
                      <Link to="/templates">
                        <Icon type="copy" />
                        <span>Predlosci</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/logout">
                      <a onClick={this.logout}>
                        <Icon type="poweroff" />
                        <span>Logout</span>
                      </a>
                    </Menu.Item>
                  </Menu>
                )
              }}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                background: '#fff',
                padding: 0,
                paddingLeft: '16px',
              }}
            >
              <Button onClick={this.toggle}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                />
              </Button>
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
                minHeight: 280,
              }}
            >
              <Route
                render={() => {
                  return this.props.userData.loading ? null : (
                    <History userData={this.props.userData} />
                  )
                }}
                path="/"
                exact
              />
              <Route
                render={() =>
                  this.props.userData.loading ? null : (
                    <Custom userData={this.props.userData} />
                  )
                }
                path="/custom"
              />
              <Route
                render={() =>
                  this.props.userData.loading ? null : (
                    <Templates userData={this.props.userData} />
                  )
                }
                path="/templates"
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }

  // render() {

  //     return (
  //         <div className="App">
  //             <Menu activeKey="1" style={{ width: '280px' }}>
  //                 <Menu.Item key="1">Menu</Menu.Item>
  //                 <Menu.Item key="2">SubMenuItem</Menu.Item>
  //             </Menu>
  //             <div className="App-body">
  //                 {/* <LocaleProvider locale={frFR}> */}
  //                 <div style={{ width: 400, margin: '100px auto' }}>
  //                     <DatePicker
  //                         onChange={value => this.handleChange(value)}
  //                     />
  //                     <div style={{ marginTop: 20 }}>
  //                         Date: {this.state.date.toString()}
  //                     </div>
  //                 </div>
  //                 {/* </LocaleProvider> */}
  //             </div>
  //         </div>
  //     )
  // }
}

export default createContainer(App, (db, props) => {
  return {
    userData: db.collection('users').doc(props.user.uid),
  }
})
