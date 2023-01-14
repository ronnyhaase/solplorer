import get from 'lodash/get'

const sortTableData = (
  table: any[],
  colId: string,
  dir: 'ASC' | 'DESC' | null
) => table.slice().sort((rowA, rowB) => {
  let a = get(rowA, colId)
  let b = get(rowB, colId)

  if (a === null && typeof b === 'number') a = Number.MIN_SAFE_INTEGER
  if (a === null && typeof b === 'string') a = String.fromCodePoint(0x10ffff)
  if (typeof a === 'number' && b === null) b = Number.MIN_SAFE_INTEGER
  if (typeof a === 'string' && b === null) b = String.fromCodePoint(0x10ffff)

  if (a < b) return (dir === 'ASC') ? -1 : 1
  else if (a > b) return (dir === 'ASC') ? 1 : -1
  else return 0
})

export {
  sortTableData,
}
