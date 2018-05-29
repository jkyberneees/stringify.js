function rstringify (o) {
  const type = getType(o)

  if (type === 'string' || o instanceof Date) return `"${o}"`
  if (type === 'object') {
    const keys = Object.keys(o)
    if (!keys.length) return '{}'
    return keys.reduce((acc, k, index, arr) => `${acc}"${k}":${rstringify(o[k])}${index + 1 < arr.length ? ',' : '}'}`, '{')
  }
  if (type === 'array') {
    if (!o.length) return '[]'
    return o.reduce((acc, e, index, arr) => `${acc}${rstringify(e)}${index + 1 < arr.length ? ',' : ']'}`, '[')
  }

  return `${o}`
}

function getType (o) {
  const type = typeof o
  if (type === 'object') {
    if (o === null) return 'null'
    if (undefined === o) return 'undefined'
    if (Array.isArray(o)) return 'array'
  }

  return type
}

module.exports = {
  stringify: (o) => {
    const type = getType(o)
    if (o === null || o === undefined || type !== 'object') return `"${o}"`

    return rstringify(o)
  }
}
