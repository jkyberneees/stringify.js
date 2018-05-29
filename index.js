function s (o) {
  const t = getType(o)

  if (t === 'string' || o instanceof Date) return `"${o}"`
  if (t === 'object') {
    const keys = Object.keys(o)
    if (!keys.length) return '{}'
    return keys.reduce((acc, k, i, arr) => `${acc}"${k}":${s(o[k])}${i + 1 < arr.length ? ',' : '}'}`, '{')
  }
  if (t === 'array') {
    if (!o.length) return '[]'
    return o.reduce((acc, e, i, arr) => `${acc}${s(e)}${i + 1 < arr.length ? ',' : ']'}`, '[')
  }

  return `${o}`
}

function getType (o) {
  const t = typeof o
  if (t === 'object') {
    if (o === null) return 'null'
    if (undefined === o) return 'undefined'
    if (Array.isArray(o)) return 'array'
  }

  return t
}

module.exports = {
  stringify: (o) => {
    const t = getType(o)
    if (o === null || o === undefined || t !== 'object') return `"${o}"`

    return s(o)
  }
}
