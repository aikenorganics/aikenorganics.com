try {
  // In IE11, Date#toLocaleString does not support the timeZone option.
  new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
} catch (error) {
  const DatePrototype = Date.prototype
  const {toLocaleString} = DatePrototype
  DatePrototype.toLocaleString = function (locale, options) {
    if (options) delete options.timeZone
    return toLocaleString.call(this, locale, options)
  }
}
