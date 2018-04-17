import React, { Component } from 'react'
import { notification, Icon } from 'antd'

import CustomForm from './CustomForm'
import createContainer from './firestore'

const style = {
  maxWidth: '46em',
}
class Custom extends Component {
  static propTypes = {}

  onSubmit = ({
    shouldAddToTemplates,
    // default optional fields
    status = 10,
    phone = '',
    notes = '',
    website = '',
    address = '',
    ...mandatoryTaskFields
  } = {}) => {
    if (shouldAddToTemplates) {
      this.addTemplate({
        phone,
        notes,
        website,
        address,
        ...mandatoryTaskFields,
        company_id: this.props.userData.snapshot.data().company_id,
        company_name: this.props.userData.snapshot.data().company_name,
        category: this.props.userData.snapshot.data().company_name,
        created_at: new Date(),
      })
    }

    this.addTask({
      status,
      phone,
      notes,
      website,
      address,
      ...mandatoryTaskFields,
      company_id: this.props.userData.snapshot.data().company_id,
      company_name: this.props.userData.snapshot.data().company_name,
      category: this.props.userData.snapshot.data().company_name,
      created_at: new Date(),
      is_custom: true,
    })
  }

  addTask(task) {
    this.props.tasks.cursor.add(task).then(() => {
      this.openNotification()
    })
  }

  addTemplate(template) {
    if (newTemplateHasIssues(template)) {
      // show validation failure message
      return
    }

    this.props.templates.cursor.add(template).then(() => {
      // show add template success message
    })
  }

  openNotification = () => {
    notification.open({
      message: `Uspjesno ste narucili zadatak`,
      duration: 3,
      // description:
      //     'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      icon: <Icon type="shopping-cart" style={{ color: '#108ee9' }} />,
    })
  }

  render() {
    return (
      <div style={style}>
        <CustomForm onSubmit={this.onSubmit} userData={this.props.userData} />
      </div>
    )
  }
}

export default createContainer(Custom, db => {
  return {
    templates: db.collection('task_templates'),
    tasks: db.collection('tasks'),
  }
})

function newTemplateHasIssues(template) {}
