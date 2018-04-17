import React from 'react'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Radio,
} from 'antd'

import Address from './shared/Address'

const { TextArea } = Input
const FormItem = Form.Item
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option
const RadioGroup = Radio.Group

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

class CustomForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.props.onSubmit(values)
        this.props.form.resetFields()
      }
    })
  }
  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = value => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.hr', '.com', '.org', '.net'].map(
        domain => `${value}${domain}`
      )
    }
    this.setState({ autoCompleteResult })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { autoCompleteResult } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    }

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ))

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Naziv">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Morate ispuniti naziv zadatka',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Lokacija">
          {getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: 'Morate ispuniti ime lokacije',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Adresa">
          {getFieldDecorator('address', {
            rules: [
              {
                validator: this.checkConfirm,
              },
            ],
          })(<Address />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Napomena">
          {getFieldDecorator('notes', {
            rules: [{}],
          })(<TextArea rows={4} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Telefon">
          {getFieldDecorator('phone', {
            rules: [{}],
          })(<Input style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Web">
          {getFieldDecorator('website', {
            rules: [],
          })(
            <AutoComplete
              dataSource={websiteOptions}
              onChange={this.handleWebsiteChange}
            >
              <Input />
            </AutoComplete>
          )}
        </FormItem>

        <Form.Item {...formItemLayout} label="Pocetak">
          {getFieldDecorator('status')(
            <RadioGroup>
              <Radio style={radioStyle} value={10}>
                Prvo doci u {this.props.userData.snapshot.data().company_name}
              </Radio>
              <Radio style={radioStyle} value={20}>
                Prvo otići na lokaciju: {getFieldValue('location')}
              </Radio>
            </RadioGroup>
          )}
        </Form.Item>

        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('shouldAddToTemplates', {
            valuePropName: 'shouldAddToTemplates',
          })(<Checkbox>Dodaj u predloske</Checkbox>)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Naruci Zadatak
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(CustomForm)
