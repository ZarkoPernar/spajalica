import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Select } from 'antd'
import * as moment from 'moment'

import createContainer from './firestore'
import HistoryList from './HistoryList'
import { sortByCategories } from './Templates'

const { RangePicker } = DatePicker
const Option = Select.Option

const filtersStyles = {
  padding: '1rem 0',
}

class History extends Component {
  state = {
    startDate: null,
    endDate: null,
    status: '',
    category: '',
  }

  onDateFilterChange = ([start, end]) => {
    if (!start || !end) {
      this.setState({
        startDate: null,
        endDate: null,
      })
    } else {
      this.setState({
        startDate: start.startOf('day'),
        endDate: end.endOf('day'),
      })
    }
  }

  handleStatusFilterChange = status => {
    this.setState({
      status: parseInt(status),
    })
  }

  handleCategoryFilterChange = category => {
    this.setState({
      category,
    })
  }

  render() {
    const templates = (this.props.templates.snapshot
      ? this.props.templates.snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))
      : []
    ).concat(
      this.props.company_templates.snapshot
        ? this.props.company_templates.snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))
        : []
    )
    const categories = Object.keys(sortByCategories(templates))

    return (
      <Fragment>
        <div style={filtersStyles}>
          <h2 />

          <RangePicker onChange={this.onDateFilterChange} />

          <Select
            style={{ marginLeft: '2rem', width: 200 }}
            placeholder="Odaberi status"
            optionFilterProp="children"
            onChange={this.handleStatusFilterChange}
          >
            <Option value="0">Svi</Option>
            <Option value="10">Stvoreno</Option>
            <Option value="20">Preuzeto</Option>
            <Option value="30">Na Obradi</Option>
            <Option value="40">Zavrseno</Option>
          </Select>

          <Select
            style={{ marginLeft: '2rem', width: 200 }}
            placeholder="Odaberi kategoriju"
            optionFilterProp="children"
            onChange={this.handleCategoryFilterChange}
          >
            <Option value="">Sve</Option>
            {categories.map(cat => (
              <Option value={cat} key={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </div>
        <HistoryList userData={this.props.userData} {...this.state} />
      </Fragment>
    )
  }
}

export default createContainer(History, (db, { userData }) => {
  return {
    templates: db.collection('task_templates').where('company_id', '==', null),
    company_templates: db
      .collection('task_templates')
      .where('company_id', '==', userData.snapshot.data().company_id),
  }
})
