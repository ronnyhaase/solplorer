function pickAsWith(fields, obj) {
  const result = {}
  Object.keys(obj).map(key => {
    fields.map(field => {
      if (Array.isArray(field)) {
        const [oldName, newName, transform] = field
        if (key === oldName) result[newName || oldName] = transform ? transform(obj[oldName]) : obj[oldName]
      } else {
        if (key === field) result[key] = obj[key]
      }
    })
  })
  return result
}

module.exports = {
  pickAsWith,
}
