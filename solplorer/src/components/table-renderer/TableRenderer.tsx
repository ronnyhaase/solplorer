import get from 'lodash/get'
import { useState } from 'react'

import { SortingDisplay, TBody, TD, TH, THead, TR, Table } from '../table'

const colKey = (rowKey, colKey) => {
  if (rowKey == null || colKey == null) return null
  else return `${rowKey}-${colKey}`
}

const nextSortingState = (currentState) => {
  if (currentState === null) return 'DESC'
  else if (currentState === 'DESC') return 'ASC'
  else if (currentState === 'ASC') return 'DESC'
}

type ColumnDefinition = {
  id: string,
  title: string,
  sortable?: boolean,
  defaultSortOrder?: 'ASC' | 'DESC' | null
  renderContent?: (rowData: any) => JSX.Element,
  renderTHContent?: ({ title }: { title: string }) => JSX.Element,
}

type ColumnDefinitions = Array<ColumnDefinition>

type TableRendererProps = {
  /** Columns of the data */
  columns: ColumnDefinitions,
  /** The actual data */
  data: Array<any>,
  /** Display row numbers as first column */
  displayRowNumbers?: boolean,
  /** Column ID whose value is used to built unique key for rows */
  rowKeyColId: string,
  /** Column ID by which the data are sorted, can be null if data are not sorted */
  sortingColId?: string | null,
  /** Direction by which the data are sorted, can be null if data are not sorted */
  sortingDirection?: 'ASC' | 'DESC' | null,
  stickyFirstCol?: boolean,
  /** Callback */
  onSortChange?: (
    col: ColumnDefinition,
    direction: string,
    updateData: (sortedData: Array<any>) => void,
  ) => void | null
  /**
   * A render function or component, to add custom content into the THead
   * Will get passed { children } with the auto-generated content
   */
  renderHeadContent?: ({ children}: { children: JSX.Element }) => JSX.Element,
}

function TableRenderer({
  columns = null,
  data = null,
  displayRowNumbers = true,
  rowKeyColId = null,
  sortingColId = null,
  sortingDirection = null,
  stickyFirstCol = false,
  onSortChange = null,
  renderHeadContent = ({ children }) => (<>{children}</>)
}: TableRendererProps) {
  const [currData, setCurrData] = useState(data)
  const [currSortingColId, setCurrSortingColId] = useState(sortingColId)
  const [currSortingDirection, setCurrSortingDirection] = useState(sortingDirection)

  if (!Array.isArray(columns) || !Array.isArray(data)) return null
  if (rowKeyColId == null) console.warn('rowKeyColId was not defined, we highly suggest to specify it to have a key for iterating')

  const handleSortClick = (col) => {
    const newSortingDirection = currSortingColId !== col.id
      ? col.defaultSortOrder || 'DESC'
      : nextSortingState(currSortingDirection)
    setCurrSortingColId(col.id)
    setCurrSortingDirection(newSortingDirection)

    if (typeof(onSortChange) === 'function')
      onSortChange(col, newSortingDirection, setCurrData)
  }

  return (
    <Table>
      <THead>
        {renderHeadContent({ children: (
          <TR>
            {displayRowNumbers ? (<TH>#</TH>) : null}
            {columns.map(col => (
              <TH
                key={col.id || null}
                className={col.sortable ? 'relative hover:bg-inset' : null}
                style={{ paddingLeft: '22px', paddingRight: '22px' }}
              >
                {col.renderTHContent ? col.renderTHContent({ title: col.title}) : col.title}
                {col.sortable
                  ? (
                    <button
                      onClick={() => handleSortClick(col)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0,
                        background: 'transparent',
                        color: 'inherit',
                        textAlign: 'right',
                      }}
                    >
                      <SortingDisplay state={col.sortable && col.id === currSortingColId && currSortingDirection ? currSortingDirection : null} />
                    </button>
                  ) : null}
              </TH>
            ))}
          </TR>
        )})}
      </THead>
      <TBody>
        {currData.map((row, n) => (
          <TR key={rowKeyColId ? get(row, rowKeyColId) : null}>
              {displayRowNumbers ? (<TD>{n + 1}</TD>) : null}
              {columns.map((col, n) => (
                <TD
                  key={colKey(get(row, rowKeyColId), col.id)}
                  style={{
                    position: stickyFirstCol && n === 0 ? 'sticky' : 'static',
                    left: stickyFirstCol && n === 0 ? 0 : 'auto',
                  }}
                >
                  {col.renderContent
                    ? col.renderContent(row)
                    : get(row, col.id)}
                </TD>
              ))}
          </TR>
        ))}
      </TBody>
    </Table>
  )
}

export { TableRenderer }
