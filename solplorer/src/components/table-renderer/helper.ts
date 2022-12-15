import get from 'lodash/get'

function sortTableData(col, dir) {
  const colId = col.id

  return function (colA, colB) {
    let a = get(colA, colId)
    let b = get(colB, colId)

    if (a === null && typeof b === 'number') a = Number.MIN_SAFE_INTEGER
    if (a === null && typeof b === 'string') a = String.fromCodePoint(0x10ffff)
    if (typeof a === 'number' && b === null) b = Number.MIN_SAFE_INTEGER
    if (typeof a === 'string' && b === null) b = String.fromCodePoint(0x10ffff)

    if (a < b) return (dir === 'ASC') ? -1 : 1
    else if (a > b) return (dir === 'ASC') ? 1 : -1
    else return 0
  }
}

export {
  sortTableData,
}
