/**
 * DispatcherRecorder(alt: AltInstance): DispatcherInstance
 *
 * > Record and replay your actions at any point in time.
 *
 * This util allows you to record a set of dispatches which you can later
 * replay at your convenience.
 *
 * Good for: Debugging, repeating, logging.
 *
 * Usage:
 *
 * ```js
 * var recorder = new DispatcherRecorder(alt);
 *
 * // start recording
 * recorder.record();
 *
 * // call a series of actions
 *
 * // stop recording
 * recorder.stop();
 *
 * // replay the events that took place
 * recorder.replay();
 * ```
 */
module.exports = DispatcherRecorder

function DispatcherRecorder(alt) {
  this.alt = alt
  this.events = []
  this.dispatchToken = null
}

/**
 * record(): boolean
 * If recording started you get true, otherwise false since there's a recording
 * in progress.
 */
DispatcherRecorder.prototype.record = function () {
  if (this.dispatchToken) {
    return false
  }

  this.dispatchToken = this.alt.dispatcher.register(function (payload) {
    this.events.push(payload)
  }.bind(this))

  return true
}

/**
 * Stops the recording in progress.
 */
DispatcherRecorder.prototype.stop = function () {
  this.alt.dispatcher.unregister(this.dispatchToken)
  this.dispatchToken = null
}

/**
 * Clear all events from memory.
 */
DispatcherRecorder.prototype.clear = function () {
  this.events = []
}

/**
 * Synchronously replay all events that were recorded.
 */
DispatcherRecorder.prototype.replay = function () {
  this.events.forEach(function (payload) {
    this.alt.dispatch(payload.action, payload.data)
  }.bind(this))
}
