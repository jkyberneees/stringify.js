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

const bigObject = require('./sample.json')
const smallObject = {
  name: 'Hello World!',
  v: 1.0
}

const iterations = 500000

let now = new Date()
for (let i = 0; i < iterations; i++) {
  s.stringify(bigObject)
}
console.log('stringify.js elapsed time: ', new Date() - now)

now = new Date()
for (let i = 0; i < iterations; i++) {
  native.stringify(bigObject)
}
console.log('Native JSON elapsed time: ', new Date() - now)

now = new Date()
for (let i = 0; i < iterations; i++) {
  s.stringify(smallObject)
}
console.log('stringify.js elapsed time: ', new Date() - now)

now = new Date()
for (let i = 0; i < iterations; i++) {
  native.stringify(smallObject)
}
console.log('Native JSON elapsed time: ', new Date() - now)
