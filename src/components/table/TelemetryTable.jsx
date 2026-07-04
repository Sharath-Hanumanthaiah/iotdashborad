import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useDashboard } from '../../context/DashboardContext';
import { useFetchData } from '../../hooks/useDashboardData';
import { formatTimestamp, truncateId } from '../../utils/formatters';
import { STATUS_CONFIG } from '../../utils/constants';
import TableFilters from './TableFilters';
import ExpandedRow from './ExpandedRow';
import { IoChevronDownOutline, IoChevronForwardOutline } from 'react-icons/io5';

export default function TelemetryTable() {
  const { tableFilters } = useDashboard();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }]);
  const [expanded, setExpanded] = useState({});

  const fetchParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: tableFilters.status,
    type: tableFilters.type,
    region: tableFilters.region,
    search: tableFilters.search,
    sortBy: sorting[0]?.id || 'timestamp',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
  }), [pagination, tableFilters, sorting]);

  const { data, loading } = useFetchData('/api/telemetry', fetchParams);

  const columns = useMemo(() => [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <span
          style={{ cursor: 'pointer', opacity: 0.5 }}
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
        </span>
      ),
      size: 40
    },
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: info => <span className="font-mono">{formatTimestamp(info.getValue())}</span>,
      size: 100
    },
    {
      accessorKey: 'deviceId',
      header: 'Device ID',
      cell: info => <span className="font-mono" title={info.getValue()}>{truncateId(info.getValue())}</span>,
      size: 120
    },
    {
      accessorKey: 'deviceName',
      header: 'Device Name',
      size: 180
    },
    {
      accessorKey: 'deviceType',
      header: 'Type',
      size: 180
    },
    {
      accessorKey: 'regionName',
      header: 'Location',
      size: 160
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const val = info.getValue();
        const conf = STATUS_CONFIG[val] || STATUS_CONFIG.offline;
        return (
          <span className={`status-badge ${val}`}>
            <span style={{ color: conf.color }}>{conf.icon}</span> {conf.label}
          </span>
        );
      },
      size: 120
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: info => (
        <div className="truncate" style={{ maxWidth: '250px' }} title={info.getValue()}>
          {info.getValue()}
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: {
      sorting,
      expanded,
      pagination
    },
    pageCount: data?.totalPages || -1,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => true
  });

  return (
    <div className="glass-card flex-col flex" style={{ height: '600px', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-primary)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Telemetry Logs</h3>
        <TableFilters />
      </div>

      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getIsSorted() ? 'sorted' : ''}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : 'auto' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading && !data?.data?.length ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((c, j) => (
                    <td key={j}>
                      <div className="skeleton" style={{ height: '20px', width: j === 0 ? '20px' : '80%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                  No telemetry logs found for the current filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <tr 
                    className={row.getIsExpanded() ? 'expanded' : ''}
                    onClick={() => row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={columns.length} style={{ padding: 0 }}>
                        <ExpandedRow data={row.original} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="text-muted text-sm">
          Showing {data?.data?.length || 0} of {data?.total || 0} records
        </div>
        <div className="pagination">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
          >
            Previous
          </button>
          <span className="page-info">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() > 0 ? table.getPageCount() : 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
