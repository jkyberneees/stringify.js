function stringify (o, nested = false) {
  const type = getType(o)

  if (type === 'object') {
    const str = Object.keys(o).reduce((acc, k) => acc + `"${k}":` + stringify(o[k], true) + ',', '')
    return `{${str.substring(0, str.length - 1)}}`
  }

  if (type === 'array') {
    const str = o.reduce((acc, e) => acc + stringify(e, true) +  ',', '')
    return `[${str.substring(0, str.length - 1)}]`
  }

  if (type === 'set') {
    return stringify(Array.from(o))
  }

  return nested && type !== 'string' ? `${o}` : `"${o}"` 
}

function getType (o) {
  const type = typeof o
  if (type === 'object') {
    if (null === o) return 'null'
    if (undefined === o) return 'undefined'
    if (Array.isArray(o)) return 'array'
    if (o instanceof Set) return 'set'
  }

  return type
}

module.exports = {
  stringify
}
