import 'bugsnag-js'

const bugsnag = document.getElementById('bugsnag')
Object.assign(Bugsnag, JSON.parse(bugsnag.innerHTML))
