import { messages } from 'cucumber-messages'
import { doesNotHaveValue } from './value_checker'

export const NANOSECONDS_IN_MILLISECOND = 1e6
export const MILLISECONDS_IN_SECOND = 1e3
export const NANOSECONDS_IN_SECOND = 1e9

let previousTimestamp

const methods: any = {
  beginTiming() {
    previousTimestamp = getTimestamp()
  },
  clearInterval: clearInterval.bind(global),
  clearTimeout: clearTimeout.bind(global),
  Date,
  endTiming() {
    return getTimestamp() - previousTimestamp
  },
  setInterval: setInterval.bind(global),
  setTimeout: setTimeout.bind(global),
}

if (typeof setImmediate !== 'undefined') {
  methods.setImmediate = setImmediate.bind(global)
  methods.clearImmediate = clearImmediate.bind(global)
}

function getTimestamp(): number {
  return new methods.Date().getTime()
}

export function addDurations(
  a: messages.IDuration,
  b: messages.IDuration
): messages.IDuration {
  if (doesNotHaveValue(b)) {
    return a
  }
  let seconds = (a.seconds as number) + (b.seconds as number)
  let nanos = a.nanos + b.nanos
  if (nanos > NANOSECONDS_IN_SECOND) {
    seconds += 1
    nanos -= NANOSECONDS_IN_SECOND
  }
  return new messages.Duration({ seconds, nanos })
}

// TODO use TimeConversion methods in cucumber-messages
//   dependent on https://github.com/cucumber/cucumber/pull/832
export function millisecondsToDuration(
  milliseconds: number
): messages.IDuration {
  const seconds = Math.floor(milliseconds / MILLISECONDS_IN_SECOND)
  const nanos =
    (milliseconds - seconds * MILLISECONDS_IN_SECOND) *
    NANOSECONDS_IN_MILLISECOND
  return new messages.Duration({ seconds, nanos })
}

export function durationToMilliseconds(duration: messages.IDuration): number {
  return (
    (duration.seconds as number) * MILLISECONDS_IN_SECOND +
    duration.nanos / NANOSECONDS_IN_MILLISECOND
  )
}

export function durationToNanoseconds(duration: messages.IDuration): number {
  return (duration.seconds as number) * NANOSECONDS_IN_SECOND + duration.nanos
}

export function getZeroDuration(): messages.IDuration {
  return new messages.Duration({ seconds: 0, nanos: 0 })
}

export default methods
