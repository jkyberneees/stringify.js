// https://raw.githubusercontent.com/BridgeAR/stable-fast-stringify/master/stable.js
/**
The MIT License (MIT)

Copyright (c) 2018 Ruben Bridgewater

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

'use strict'

module.exports = stringify

var gap = ''
// eslint-disable-next-line
const strEscapeSequencesRegExp = /[\x00-\x1f\x22\x5c]/
// eslint-disable-next-line
const strEscapeSequencesReplacer = /[\x00-\x1f\x22\x5c]/g

// Escaped special characters. Use empty strings to fill up unused entries.
const meta = [
  '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004',
  '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t',
  '\\n', '\\u000b', '\\f', '\\r', '\\u000e',
  '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013',
  '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018',
  '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d',
  '\\u001e', '\\u001f', '', '', '\\"',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '\\\\'
]

const escapeFn = (str) => meta[str.charCodeAt(0)]

// Escape control characters, double quotes and the backslash.
function strEscape (str) {
  // Some magic numbers that worked out fine while benchmarking with v8 6.0
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) {
    return str
  }
  if (str.length > 100) {
    return str.replace(strEscapeSequencesReplacer, escapeFn)
  }
  var result = ''
  var last = 0
  for (var i = 0; i < str.length; i++) {
    const point = str.charCodeAt(i)
    if (point === 34 || point === 92 || point < 32) {
      if (last === i) {
        result += meta[point]
      } else {
        result += `${str.slice(last, i)}${meta[point]}`
      }
      last = i + 1
    }
  }
  if (last === 0) {
    result = str
  } else if (last !== i) {
    result += str.slice(last)
  }
  return result
}

// Full version: supports all options
function stringifyFullFn (key, parent, replacer, indent) {
  var i, res, join
  const mind = gap
  var value = parent[key]

  if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }
  value = replacer.call(parent, key, value)

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += `\n${gap}`
          join = `,\n${gap}`
        }
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifyFullFn(i, value, replacer, indent)
          res += tmp !== undefined ? tmp : 'null'
          res += join
        }
        const tmp = stringifyFullFn(i, value, replacer, indent)
        res += tmp !== undefined ? tmp : 'null'
        if (gap !== '') {
          res += `\n${mind}`
        }
        res += ']'
        gap = mind
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      res = '{'
      if (gap === '') {
        join = ','
      } else {
        res += `\n${gap}`
        join = `,\n${gap}`
      }
      var last = false
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const tmp = stringifyFullFn(key, value, replacer, indent)
        if (tmp !== undefined) {
          if (last) {
            res += join
          }
          res += `"${strEscape(key)}"${gap !== '' ? ': ' : ':'}${tmp}`
          last = true
        }
      }
      key = keys[i]
      const tmp = stringifyFullFn(key, value, replacer, indent)
      if (tmp !== undefined) {
        if (last) {
          res += join
        }
        if (gap === '') {
          res += `"${strEscape(key)}":${tmp}`
        } else {
          res += `"${strEscape(key)}": ${tmp}\n${mind}`
        }
      } else if (gap !== '') {
        if (last) {
          res += `\n${mind}`
        } else {
          res = '{'
        }
      }
      res += '}'
      gap = mind
      return res
    case 'string':
      return `"${strEscape(value)}"`
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

function stringifyFullArr (key, value, replacer, indent) {
  var i, res, join
  const mind = gap

  if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += `\n${gap}`
          join = `,\n${gap}`
        }
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifyFullArr(i, value[i], replacer, indent)
          res += tmp !== undefined ? tmp : 'null'
          res += join
        }
        const tmp = stringifyFullArr(i, value[i], replacer, indent)
        res += tmp !== undefined ? tmp : 'null'
        if (gap !== '') {
          res += `\n${mind}`
        }
        res += ']'
        gap = mind
        return res
      }

      if (replacer.length === 0) {
        return '{}'
      }
      res = '{'
      if (gap === '') {
        join = ','
      } else {
        res += `\n${gap}`
        join = `,\n${gap}`
      }
      var last = false
      for (i = 0; i < replacer.length; i++) {
        if (typeof replacer[i] === 'string' || typeof replacer[i] === 'number') {
          key = replacer[i]
          const tmp = stringifyFullArr(key, value[key], replacer, indent)
          if (tmp !== undefined) {
            if (last) {
              res += join
            }
            res += `"${strEscape(key)}"${gap ? ': ' : ':'}${tmp}`
            last = true
          }
        }
      }
      if (gap !== '') {
        if (last) {
          res += `\n${mind}`
        } else {
          res = '{'
        }
      }
      res += '}'
      gap = mind
      return res
    case 'string':
      return `"${strEscape(value)}"`
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Supports only the spacer option
function stringifyIndent (key, value, indent) {
  var i, res, join, add
  const mind = gap

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (typeof value.toJSON === 'function') {
        value = value.toJSON(key)
        // Prevent calling `toJSON` again.
        if (typeof value !== 'object') {
          return stringifyIndent(key, value, indent)
        }
        if (value === null) {
          return 'null'
        }
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += `\n${gap}`
          join = `,\n${gap}`
        }
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifyIndent(i, value[i], indent)
          res += tmp !== undefined ? tmp : 'null'
          res += join
        }
        const tmp = stringifyIndent(i, value[i], indent)
        res += tmp !== undefined ? tmp : 'null'
        if (gap !== '') {
          res += `\n${mind}`
        }
        res += ']'
        gap = mind
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      res = '{'
      if (gap === '') {
        join = ','
        add = ''
      } else {
        add = `\n${gap}`
        join = `,\n${gap}`
      }
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const tmp = stringifyIndent(key, value[key], indent)
        if (tmp !== undefined) {
          add += `"${strEscape(key)}"${gap ? ': ' : ':'}${tmp}${join}`
        }
      }
      key = keys[i]
      const tmp = stringifyIndent(key, value[key], indent)
      if (tmp !== undefined) {
        if (gap === '') {
          add += `"${strEscape(key)}":${tmp}`
        } else {
          add += `"${strEscape(key)}": ${tmp}\n${mind}`
        }
      }
      if (add.length > gap.length + 1) {
        res += add
      }
      res += '}'
      gap = mind
      return res
    case 'string':
      return `"${strEscape(value)}"`
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Supports only the replacer option
function stringifyReplacerArr (key, value, replacer) {
  var i, res
  // If the value has a toJSON method, call it to obtain a replacement value.
  if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        res = '['
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifyReplacerArr(i, value[i], replacer)
          res += tmp !== undefined ? tmp : 'null'
          res += ','
        }
        const tmp = stringifyReplacerArr(i, value[i], replacer)
        res += tmp !== undefined ? tmp : 'null'
        res += ']'
        return res
      }

      if (replacer.length === 0) {
        return '{}'
      }
      res = '{'
      var last = false
      for (i = 0; i < replacer.length; i++) {
        if (typeof replacer[i] === 'string' || typeof replacer[i] === 'number') {
          key = replacer[i]
          const tmp = stringifyReplacerArr(key, value[key], replacer)
          if (tmp !== undefined) {
            if (last) {
              res += ','
            }
            res += `"${strEscape(key)}":${tmp}`
            last = true
          }
        }
      }
      res += '}'
      return res
    case 'string':
      return `"${strEscape(value)}"`
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

function stringifyReplacerFn (key, parent, replacer) {
  var i, res
  var value = parent[key]
  // If the value has a toJSON method, call it to obtain a replacement value.
  if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }
  value = replacer.call(parent, key, value)

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        res = '['
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifyReplacerFn(i, value, replacer)
          res += tmp !== undefined ? tmp : 'null'
          res += ','
        }
        const tmp = stringifyReplacerFn(i, value, replacer)
        res += tmp !== undefined ? tmp : 'null'
        res += ']'
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      res = '{'
      var last = false
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const tmp = stringifyReplacerFn(key, value, replacer)
        if (tmp !== undefined) {
          if (last === true) {
            res += ','
          }
          res += `"${strEscape(key)}":${tmp}`
          last = true
        }
      }
      key = keys[i]
      const tmp = stringifyReplacerFn(key, value, replacer)
      if (tmp !== undefined) {
        if (last === true) {
          res += ','
        }
        res += `"${strEscape(key)}":${tmp}`
      }
      res += '}'
      return res
    case 'string':
      return `"${strEscape(value)}"`
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Simple without any options
function stringifySimple (key, value) {
  var i, res
  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (typeof value.toJSON === 'function') {
        value = value.toJSON(key)
        // Prevent calling `toJSON` again
        if (typeof value !== 'object') {
          return stringifySimple(key, value)
        }
        if (value === null) {
          return 'null'
        }
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        res = '['
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifySimple(i, value[i])
          res += tmp !== undefined ? tmp : 'null'
          res += ','
        }
        const tmp = stringifySimple(i, value[i])
        res += tmp !== undefined ? tmp : 'null'
        res += ']'
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      res = '{'
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const tmp = stringifySimple(key, value[key])
        if (tmp !== undefined) {
          res += `"${strEscape(key)}":${tmp},`
        }
      }
      key = keys[i]
      const tmp = stringifySimple(key, value[key])
      if (tmp !== undefined) {
        res += `"${strEscape(key)}":${tmp}`
      }
      res += '}'
      return res
    case 'string':
      return `"${strEscape(value)}"`
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      // Convert the numbers implicit to a string instead of explicit.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

function insertSort (arr) {
  for (var i = 1; i < arr.length; i++) {
    const tmp = arr[i]
    var j = i
    while (j !== 0 && arr[j - 1] > tmp) {
      arr[j] = arr[j - 1]
      j--
    }
    arr[j] = tmp
  }

  return arr
}

function stringify (value, replacer, spacer) {
  var i
  var indent = ''
  gap = ''

  if (arguments.length > 1) {
    // If the spacer parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof spacer === 'number') {
      for (i = 0; i < spacer; i += 1) {
        indent += ' '
      }
    // If the spacer parameter is a string, it will be used as the indent string.
    } else if (typeof spacer === 'string') {
      indent = spacer
    }
    if (indent !== '') {
      if (replacer !== undefined && replacer !== null) {
        if (typeof replacer === 'function') {
          return stringifyFullFn('', { '': value }, replacer, indent)
        }
        if (Array.isArray(replacer)) {
          return stringifyFullArr('', value, replacer, indent)
        }
      }
      return stringifyIndent('', value, indent)
    }
    if (typeof replacer === 'function') {
      return stringifyReplacerFn('', { '': value }, replacer)
    }
    if (Array.isArray(replacer)) {
      return stringifyReplacerArr('', value, replacer)
    }
  }
  return stringifySimple('', value)
}
