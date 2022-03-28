import React, { Fragment, useState, forwardRef, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Input } from 'reactstrap'
export default function CustomTable(tableColumns, pageSize, currentPage, handlePagination, data) {
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel='Trước'
            nextLabel='Tiếp'
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={Math.ceil(activeOrder.length / pageSize)}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            nextLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakLinkClassName='page-link'
            previousLinkClassName='page-link'
            nextClassName='page-item next-item'
            previousClassName='page-item prev-item'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        />
    )

    // ** Bootstrap Checkbox Component
    const BootstrapCheckbox = forwardRef((props, ref) => (
        <div className='form-check'>
            <Input type='checkbox' ref={ref} {...props} />
        </div>
    ))


    return (
        <DataTable
            noHeader
            pagination
            selectableRows
            columns={tableColumns}
            paginationPerPage={pageSize}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={data}
            selectableRowsComponent={BootstrapCheckbox}
        />
    )
}
