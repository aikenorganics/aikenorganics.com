import 'bugsnag-js'

const bugsnag = document.getElementById('bugsnag')
Object.assign(window.Bugsnag, JSON.parse(bugsnag.innerHTML))
