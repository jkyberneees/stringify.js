function stringify (o, nested = false) {
  const type = getType(o)

  if (type === 'object') {
    const keys = Object.keys(o)
    if (!keys.length) return '{}'
    return keys.reduce((acc, k, index, arr) => `${acc}"${k}":${stringify(o[k], true)}${index + 1 < arr.length ? ',' : '}'}`, '{')
  }

  if (type === 'array') {
    if (!o.length) return '[]'
    return o.reduce((acc, e, index, arr) => `${acc}${stringify(e, true)}${index + 1 < arr.length ? ',' : ']'}`, '[')
  }

  if (type === 'set') {
    return stringify(Array.from(o))
  }

  return nested && type !== 'string' ? `${o}` : `"${o}"`
}

function getType (o) {
  const type = typeof o
  if (type === 'object') {
    if (o === null) return 'null'
    if (undefined === o) return 'undefined'
    if (Array.isArray(o)) return 'array'
    if (o instanceof Set) return 'set'
  }

  return type
}

module.exports = {
  stringify
}
