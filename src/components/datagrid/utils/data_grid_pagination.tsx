/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useCallback } from 'react';
import { useEuiI18n } from '../../i18n'; // Note: this file must be named data_grid_pagination to match i18n tokens
import { EuiTablePagination } from '../../table/table_pagination';
import { EuiDataGridPaginationRendererProps } from '../data_grid_types';

export const EuiDataGridPaginationRenderer = ({
  pageIndex,
  pageSize,
  pageSizeOptions,
  onChangePage: _onChangePage,
  onChangeItemsPerPage,
  rowCount,
  controls,
  'aria-label': ariaLabel,
  gridRef,
}: EuiDataGridPaginationRendererProps) => {
  const detailedPaginationLabel = useEuiI18n(
    'euiDataGridPagination.detailedPaginationLabel',
    'Pagination for preceding grid: {label}',
    { label: ariaLabel ?? '' }
  );
  const paginationLabel = useEuiI18n(
    'euiDataGridPagination.paginationLabel',
    'Pagination for preceding grid'
  );

  // Scroll back to the top of the grid whenever paginating to a new page
  const onChangePage = useCallback(
    (pageIndex) => {
      _onChangePage(pageIndex);
      gridRef.current?.scrollToItem?.({ rowIndex: 0 });
    },
    [gridRef, _onChangePage]
  );

  const pageCount = Math.ceil(rowCount / pageSize);
  const minSizeOption =
    pageSizeOptions && [...pageSizeOptions].sort((a, b) => a - b)[0];

  if (rowCount < (minSizeOption || pageSize)) {
    /**
     * Do not render the pagination when:
     * 1. Rows count is less than min pagination option (rows per page)
     * 2. Rows count is less than pageSize (the case when there are no pageSizeOptions provided)
     */
    return null;
  }

  // hide select rows per page if pageSizeOptions is undefined or an empty array
  const hidePerPageOptions = !pageSizeOptions || pageSizeOptions.length === 0;

  return (
    <div className="euiDataGrid__pagination">
      <EuiTablePagination
        aria-controls={controls}
        activePage={pageIndex}
        hidePerPageOptions={hidePerPageOptions}
        itemsPerPage={pageSize}
        itemsPerPageOptions={pageSizeOptions}
        pageCount={pageCount}
        onChangePage={onChangePage}
        onChangeItemsPerPage={onChangeItemsPerPage}
        aria-label={ariaLabel ? detailedPaginationLabel : paginationLabel}
      />
    </div>
  );
};
