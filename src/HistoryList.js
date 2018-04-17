import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as moment from 'moment'
import { Table, Tag } from 'antd'

import createContainer from './firestore'
import { getStatusNameHr, getStatusColor } from './status.utils'

const columns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '100px',
    render: record => {
      return <Tag color={getStatusColor(record)}>{getStatusNameHr(record)}</Tag>
    },
  },
  {
    title: 'Naziv',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Lokacija',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Kategorija',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Dodano',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: 'Zavrseno',
    dataIndex: 'completed_at',
    key: 'completed_at',
  },
]

class HistoryList extends Component {
  render() {
    const tasks = this.props.tasks.snapshot
      ? this.props.tasks.snapshot.docs.map(doc => {
          const task = doc.data()
          return {
            ...task,
            key: doc.id,
            created_at: moment(task.created_at).format('DD.MM.YYYY.'),
          }
        })
      : []

    return (
      <Table
        dataSource={tasks}
        loading={this.props.tasks.loading}
        columns={columns}
      />
    )
  }
}

HistoryList.propTypes = {}

export default createContainer(
  HistoryList,
  (db, { userData, status, startDate, endDate, category }) => {
    let tasks = db
      .collection('tasks')
      .where('company_id', '==', userData.snapshot.data().company_id)
      .orderBy('created_at', 'desc')

    if (status) {
      tasks = tasks.where('status', '==', status)
    }

    if (category) {
      tasks = tasks.where('category', '==', category)
    }

    if (startDate) {
      tasks = tasks.where('created_at', '>=', startDate.toDate())
    }

    if (startDate) {
      tasks = tasks.where('created_at', '<=', endDate.toDate())
    }

    return {
      tasks,
    }
  }
)
