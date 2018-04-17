import React from 'react'
import currencyJS from 'currency.js'

export const format = price =>
    price
        ? currencyJS(price / 100, {
              separator: '.',
              decimal: ',',
          }).format() + 'kn'
        : ''

const Currency = ({ currency, children }) => {
    return format(children)
}

export default Currency
