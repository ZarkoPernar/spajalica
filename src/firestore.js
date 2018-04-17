import * as React from 'react'
import * as firebase from 'firebase'

export default function createContainer(WrappedComponent, queryMapFn) {
    return class extends React.Component {
        constructor(props) {
            super(props)

            this.state = this.getResults(props)
        }

        getResults(props) {
            this._db = firebase.firestore()
            let queryMap = queryMapFn(this._db, props)

            return Object.keys(queryMap).reduce((acc, key) => {
                const result = {
                    cursor: queryMap[key],
                    loading: true,
                    promise: queryMap[key].get(),
                    snapshot: null,
                    unsubscribe: queryMap[key].onSnapshot(snapshot => {
                        this.setState(state => ({
                            [key]: {
                                ...state[key],
                                snapshot: snapshot,
                            },
                        }))
                    }),
                }

                result.promise.then(snapshot => {
                    this.setState(state => ({
                        [key]: {
                            ...state[key],
                            loading: false,
                            snapshot: snapshot,
                        },
                    }))
                })

                return Object.assign(acc, {
                    [key]: result,
                })
            }, {})
        }

        componentWillReceiveProps(nextProps) {
            this.setState(this.getResults(nextProps))
        }

        componentWillUnmount() {
            for (var key in this.results) {
                this.results[key].unsubscribe()
            }
        }

        render() {
            return React.createElement(WrappedComponent, {
                ...this.state,
                ...this.props,
            })
        }
    }
}
