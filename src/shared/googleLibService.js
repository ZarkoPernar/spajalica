const subscribers = []

const service = {
    subscribe(fn) {
        const index = subscribers.push(fn) - 1

        return function unsubscribe() {
            subscribers.splice(index, 1)
        }
    },

    notify() {
        subscribers.forEach(cb => {
            cb(window.google)
        })
    },
}

if (window.google) {
    service.notify()
} else {
    window._googleLoaded = function() {
        service.notify()
    }
}

export default service
