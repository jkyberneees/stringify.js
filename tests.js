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

const iterations = 500000
console.log(`Running ${iterations} iterations each:`)

samples.forEach(sample => {
  console.log(`> Payload size: ${sample.name}`)
  console.log(`. Using JSON.stringify`)

  let now = new Date()
  for (let i = 0; i < iterations; i++) {
    native.stringify(sample.o)
  }
  console.log('... elapsed time AVG: ', (new Date() - now) / iterations, 'ms')

  console.log(`. Using stringify.js`)
  now = new Date()
  for (let i = 0; i < iterations; i++) {
    s.stringify(sample.o)
  }
  console.log('... elapsed time AVG: ', (new Date() - now) / iterations, 'ms')
})
