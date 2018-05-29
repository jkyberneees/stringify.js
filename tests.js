const native = JSON
const s = require('./index')

native.parse(s.stringify('Hello World'))
native.parse(s.stringify(null))
native.parse(s.stringify(undefined))
native.parse(s.stringify(111.1))
native.parse(s.stringify(4))

native.parse(s.stringify([
  0, 1, 3, 1000, 11.5,
  'hello', false, {},
  [true]
]))

native.parse(s.stringify({
  msg: 'Hello JSON',
  faster: true
}))

const bigObject = require('./big-sample.json')
const smallObject = require('./small-sample.json')

const iterations = 500000
console.log(`Running ${iterations} iterations each:`)

let now = new Date()
for (let i = 0; i < iterations; i++) {
  s.stringify(bigObject)
}
console.log('stringify.js (big object) elapsed time: ', (new Date() - now) / iterations, 'ms')

now = new Date()
for (let i = 0; i < iterations; i++) {
  native.stringify(bigObject)
}
console.log('Native JSON (big object) elapsed time: ', (new Date() - now) / iterations, 'ms')

now = new Date()
for (let i = 0; i < iterations; i++) {
  s.stringify(smallObject)
}
console.log('stringify.js (small object) elapsed time: ', (new Date() - now) / iterations, 'ms')

now = new Date()
for (let i = 0; i < iterations; i++) {
  native.stringify(smallObject)
}
console.log('Native JSON (small object) elapsed time: ', (new Date() - now) / iterations, 'ms')

console.log(s.stringify({
  json: 'Rocks!',
  date: new Date()
}))
