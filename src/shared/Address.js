import React, { Component } from 'react'
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
} from 'react-places-autocomplete'
import PropTypes from 'prop-types'

import getPlaceData from './getPlaceData'

import googleLibService from './googleLibService'

import './address.css'

const classNames = {
  input: 'ant-input',
  root: 'autocomplete-root',
  autocompleteContainer: 'autocomplete-container',
}

export default class Address extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
  }

  state = {
    googleLoaded: false,
    value: this.props.defaultValue,
  }

  componentDidMount() {
    this.setState({
      googleLoaded: Boolean(window.google),
    })
    this.unsubscribe = googleLibService.subscribe(this.googleHasLoaded)
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe()
    }
  }

  googleHasLoaded = () => {
    this.setState({
      googleLoaded: Boolean(window.google),
    })
  }

  onChange = value => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(value, this.props.name)
    } else {
      this.setState({
        value,
      })
    }
  }

  addressChange = (address, placeId) => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(address, this.props.name)
    }

    this.getPlaceData(placeId)
  }

  getPlaceData = placeId => {
    geocodeByPlaceId(placeId)
      .then(this.getPlaceDataSuccess)
      .catch(this.getPlaceDataError)
  }

  getPlaceDataSuccess = results => {
    if (!results.length) return

    const result = results[0]

    // console.log(getPlaceData(result));

    const _selected = getPlaceData(result)

    this.setState({ _selected })

    if (this.props.onSelect !== undefined) {
      this.props.onSelect(_selected)
    }
  }

  getPlaceDataError = error => {
    console.error(error)
  }

  onError = error => {}

  render() {
    // const { value, ...filteredProps } = this.props
    // const selected = getValueFromProps(value)

    return this.renderAddress()
  }

  renderText = inputProps => {
    return <input {...inputProps} />
  }

  renderAddress() {
    const value = this.props.value || this.state.value

    const inputProps = {
      value,
      name: this.props.name,
      id: this.props.id,
      onChange: this.onChange,
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur,
      autoComplete: 'off',
    }

    if (!this.state.googleLoaded) return this.renderText(inputProps)

    return (
      <PlacesAutocomplete
        onError={this.onError}
        onSelect={this.addressChange}
        inputProps={inputProps}
        classNames={classNames}
      />
    )
  }
}
