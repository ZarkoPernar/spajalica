import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio } from 'antd'

const { TextArea } = Input
const RadioGroup = Radio.Group

const OrderForm = props => {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    }

    return (
        <Form>
            <p>
                <strong>Lokacija:</strong> {props.selectedTemplate.location}
            </p>
            <p>
                <strong>Kategorija:</strong> {props.selectedTemplate.category}
            </p>

            <Form.Item>
                <RadioGroup
                    onChange={e => props.onChange(e.target.value, 'status')}
                >
                    <Radio style={radioStyle} value={10}>
                        Prvo doci u{' '}
                        {props.userData.snapshot.data().company_name}
                    </Radio>
                    <Radio style={radioStyle} value={20}>
                        Prvo otići na lokaciju:{' '}
                        {props.selectedTemplate.location}
                    </Radio>
                </RadioGroup>
            </Form.Item>

            <Form.Item label="Napomena">
                {
                    <TextArea
                        rows={4}
                        onChange={e => props.onChange(e.target.value, 'notes')}
                    />
                }
            </Form.Item>
        </Form>
    )
}

OrderForm.propTypes = {
    selectedTemplate: PropTypes.object,
}

export default OrderForm
