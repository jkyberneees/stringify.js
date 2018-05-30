const native = JSON
const s = require('./index')
const sfs = require('./sfs')

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

const samples = [{
  name: 'big',
  o: require('./samples/big-sample.json')
}, {
  name: 'small',
  o: require('./samples/small-sample.json')
}, {
  name: 'very-small',
  o: require('./samples/very-small-sample.json')
}]

const iterations = 100000
console.log(`Running ${iterations} iterations each:`)

samples.forEach(sample => {
  console.log(`> Payload size: ${sample.name}`)

  let now = new Date()
  for (let i = 0; i < iterations; i++) {
    native.stringify(sample.o)
  }
  console.log('Using JSON.stringify: ', (new Date() - now) / iterations, 'ms')

  now = new Date()
  for (let i = 0; i < iterations; i++) {
    s.stringify(sample.o)
  }
  console.log('Using stringify.js: ', (new Date() - now) / iterations, 'ms')

  now = new Date()
  for (let i = 0; i < iterations; i++) {
    sfs(sample.o)
  }
  console.log('Using stable-fast-stringify: ', (new Date() - now) / iterations, 'ms')
})
