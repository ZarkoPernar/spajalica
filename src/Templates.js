import React, { Component } from 'react'
import {
  Modal,
  Collapse,
  Table,
  Input,
  Button,
  notification,
  Icon,
  Row,
  Col,
  Tabs,
} from 'antd'
import { pickBy, groupBy, debounce } from 'lodash'
import PropTypes from 'prop-types'

import createContainer from './firestore'
import { format } from './shared/Currency'
import OrderForm from './OrderForm'
import './templates.css'

const Search = Input.Search
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane

const accordionStyle = {
  fontSize: '1.25rem',
  border: 0,
  backgroundColor: 'transparent',
}
const panelStyle = {
  boxShadow: '0 1px 3px rgba(70,70,70,.15)',
  margin: '1rem 0',
  backgroundColor: 'rgb(249, 250, 251)',
}

const columns = [
  {
    title: 'Cijena',
    dataIndex: 'formattedPrice',
    key: 'formattedPrice',
    width: '100px',
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
]

export const sortByCategories = templates => {
  return groupBy(templates, 'category')
}

export const sortInCategory = templates => {
  const locations = pickBy(
    groupBy(templates, 'location'),
    (templates, locationName) => templates.length > 1
  )

  const numberOfCategories = Object.keys(locations).length

  if (numberOfCategories > 4 || numberOfCategories < 2) {
    return templates
  }

  return locations
}

class Templates extends Component {
  static propTypes = {
    templates: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
  }

  static defaultProps = {}

  singleOrderValues = {}

  state = {
    searchValue: '',
    loading: false,
    selectedRowKeys: [],
    selectedTemplate: {},
  }

  openOrderModal = () => {
    this.setState({ loading: true })

    Promise.all([
      this.state.selectedRowKeys
        .map(key => {
          let doc = this.props.templates.snapshot.docs.find(
            item => item.id === key
          )

          if (!doc) {
            doc = this.props.company_templates.snapshot.docs.find(
              item => item.id === key
            )
          }
          const data = doc.data()
          return {
            ...data,
            is_custom: !!data.company_id,
            id: doc.id,
          }
        })
        .map(this.orderSingle),
    ]).then(() => {
      this.openNotification(this.state.selectedRowKeys)
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    })
  }

  openNotification = tasks => {
    notification.open({
      message: `Uspjesno ste narucili ${tasks.length} zadataka`,
      // description:
      //     'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      icon: <Icon type="shopping-cart" style={{ color: '#108ee9' }} />,
    })
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  createSelectTemplate = template => {
    return () => {}
  }

  selectForOrderSingle(selectedTemplate) {
    this.setState({
      isModalVisible: true,
      selectedTemplate,
    })
  }

  orderSingleChange = (value, key) => {
    this.singleOrderValues[key] = value
  }

  orderSingle = (
    { id, ...selectedTemplate },
    { status = 10, notes = '' } = {}
  ) => {
    console.log(selectedTemplate, { status, notes })

    return this.props.tasks.cursor.add({
      ...selectedTemplate,
      status,
      notes,
      created_at: new Date(),
      company_id: this.props.userData.snapshot.data().company_id,
      company_name: this.props.userData.snapshot.data().company_name,
    })
  }

  handleOk = () => {
    this.orderSingle(this.state.selectedTemplate, this.singleOrderValues).then(
      () => {
        this.singleOrderValues = {}
      }
    )

    this.setState({
      isModalVisible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  onChange = e => {
    this.onSearchDebounced(e.target.value)
  }

  search = value => this.setState({ searchValue: value })

  onSearchDebounced = debounce(this.search, 300)

  render() {
    const listColumns = [
      {
        title: 'Cijena',
        dataIndex: 'formattedPrice',
        key: 'formattedPrice',
        width: '100px',
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
        title: '',
        key: 'options',
        render: (text, record) => (
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => this.selectForOrderSingle(record)}>
              Naruci
            </Button>
          </div>
        ),
      },
    ]
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedRowKeys.length > 0

    const templates = (this.props.templates.snapshot
      ? this.props.templates.snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          formattedPrice: format(doc.data().price),
        }))
      : []
    ).concat(
      this.props.company_templates.snapshot
        ? this.props.company_templates.snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            formattedPrice: format(doc.data().price),
          }))
        : []
    )

    const categories = Object.entries(sortByCategories(templates))

    return (
      <div className="Template-list">
        <Modal
          title={this.state.selectedTemplate.name}
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          okText="Posalji"
          cancelText="Otkazi"
        >
          <OrderForm
            onChange={this.orderSingleChange}
            selectedTemplate={this.state.selectedTemplate}
            userData={this.props.userData}
          />
        </Modal>

        <div className="Template-list__row">
          <div className="Template-list__col">
            <div className="Template-list__order">
              <Button
                type="primary"
                icon="shopping-cart"
                onClick={this.openOrderModal}
                disabled={!hasSelected}
                loading={loading}
              >
                Naruci Zadatke
              </Button>

              <div style={{ marginTop: 16 }}>
                {(hasSelected
                  ? selectedRowKeys.map(key =>
                      templates.find(template => template.id === key)
                    )
                  : []
                ).map(template => <div key={template.id}>{template.name}</div>)}
              </div>
            </div>
          </div>
          <div className="Template-list__col Template-list__col--main">
            <Search
              placeholder="Pretrazi predloske"
              onSearch={this.search}
              onChange={this.onChange}
              style={{ width: 300 }}
            />
            {this.state.searchValue === '' ? (
              <Collapse style={accordionStyle}>
                {categories.map(([categoryName, categoryTemplates]) => {
                  const temps = sortInCategory(categoryTemplates)
                  if (Array.isArray(temps)) {
                    return (
                      <Panel
                        key={categoryName}
                        header={categoryName}
                        style={panelStyle}
                      >
                        <Table
                          rowKey="id"
                          rowSelection={rowSelection}
                          dataSource={temps}
                          pagination={false}
                          columns={listColumns}
                        />
                      </Panel>
                    )
                  }

                  const arrTemps = Object.entries(temps)

                  return (
                    <Panel
                      key={categoryName}
                      header={categoryName}
                      style={panelStyle}
                    >
                      <div className="Template-list__tabs">
                        <Tabs>
                          {arrTemps.map(([locationName, locationTemplates]) => {
                            return (
                              <TabPane tab={locationName} key={locationName}>
                                <Table
                                  rowKey="id"
                                  rowSelection={rowSelection}
                                  dataSource={locationTemplates}
                                  pagination={false}
                                  columns={listColumns}
                                />
                              </TabPane>
                            )
                          })}
                        </Tabs>
                      </div>
                    </Panel>
                  )
                })}
              </Collapse>
            ) : (
              <Table
                rowKey="id"
                rowSelection={rowSelection}
                style={{ marginTop: '2rem' }}
                dataSource={templates.filter(template => {
                  const str = (
                    '' +
                    template.name +
                    template.location +
                    template.formattedPrice +
                    template.category
                  ).toLowerCase()

                  return (
                    str.indexOf(this.state.searchValue.toLowerCase()) !== -1
                  )
                })}
                pagination={false}
                columns={columns}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default createContainer(Templates, (db, { userData }) => {
  return {
    templates: db.collection('task_templates').where('company_id', '==', null),
    company_templates: db
      .collection('task_templates')
      .where('company_id', '==', userData.snapshot.data().company_id),
    tasks: db.collection('tasks'),
  }
})
