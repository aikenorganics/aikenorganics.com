import assign from 'object-assign'
import bugsnag from 'bugsnag-js'
import store from './store'
import env from 'env/NODE_ENV'
import key from 'env/BUGSNAG_CLIENT_KEY'

assign(bugsnag, {
  apiKey: key,
  releaseStage: env,
  notifyReleaseStages: ['production']
})

bugsnag.beforeNotify = (payload, meta) => {
  const {currentUser} = store.getState()
  const {email, id, name} = currentUser || {}

  meta.user = {email, id, name}
}
