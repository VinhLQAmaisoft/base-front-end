import { Fragment, useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy } from 'react-feather'
import { getAllCustomer, getAllCustomerOrderDetail } from '../../../services/admin/index'
import { useDispatch, useSelector } from 'react-redux'
import { formatTimeStamp } from '../../../utility/Utils'
import OrderDetailModal from './OrderDetailModal'
// import { Link } from 'react-router-dom'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from 'reactstrap'

const CustomerManagement = () => {
  const defaultSelectedData = { data: '', dtsg: '', uid: '', token: '', status: '' }
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [customerData, setCustomerData] = useState([])
  const [customerOrderData, setCustomerOrderData] = useState([])
  const [selectedData, setSelectedData] = useState(defaultSelectedData)

  const { allCustomer, allCustomerOrder, getResult, getCustomerOrderResult } = useSelector(state => state.adminReducer);

  const dispatch = useDispatch()

  const status = {
    1: { title: 'Hoạt động', color: 'light-success' },
    0: { title: 'Ngừng hoạt động', color: 'light-danger' },
  }

  const customerManageColumns = [
    {
      name: 'Tên',
      sortable: true,
      minWidth: '150px',
      selector: row => row.fullname
    },
    {
      name: 'FB UID',
      sortable: true,
      minWidth: '200px',
      selector: row => {
        if (row.fbid == undefined) {
          return 'undefined'
        } else {
          const fblink = `https://www.facebook.com/profile.php?id=${row.fbid}`
          return (
            <a href={fblink} target="_blank">{row.fbid}</a>
          )
        }
      },
    },
    {
      name: 'SĐT',
      sortable: true,
      minWidth: '120px',
      selector: row => {
        if (row.phone == undefined) {
          return 'undefined'
        } else {
          return (
            <div>
              {row.phone.map((item, i) => (
                <div style={{ marginTop: '7px', marginBottom: '7px' }} key={i}>{item}</div>
              ))}
            </div>
          )
        }
      },
    },
    {
      name: 'Địa chỉ',
      sortable: true,
      minWidth: '15 0px',
      selector: row => {
        if (row.address == undefined) {
          return 'undefined'
        } else {
          return (
            <div>
              {row.address.map((item, i) => (
                <div style={{ marginTop: '7px', marginBottom: '7px' }} key={i}>{item}</div>
              ))}
            </div>
          )
        }
      },
    },
    {
      name: 'Số đơn',
      sortable: true,
      minWidth: '80px',
      selector: row => row.order
    },
    {
      name: 'Tổng tiền',
      sortable: true,
      minWidth: '120px',
      selector: row => row.total
    },
    {
      name: 'Shop',
      sortable: true,
      minWidth: '100px',
      selector: row => row.shop
    },

  ]

  const customerOrderManageColumns = [
    {
      name: 'STT',
      sortable: true,
      minWidth: '150px',
      selector: row => row.stt
    },
    {
      name: 'Giá trị',
      sortable: true,
      minWidth: '200px',
      selector: row => row.total
    },
    {
      name: 'SĐT',
      sortable: true,
      minWidth: '120px',
      selector: row => row.phone
    },
    {
      name: 'Địa chỉ',
      sortable: true,
      minWidth: '15 0px',
      selector: row => row.address
    },
    {
      name: 'Thời gian',
      sortable: true,
      minWidth: '80px',
      selector: row => row.createAt
    },
  ]



  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.post.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase()) ||
          item.age.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.full_name.toLowerCase().includes(value.toLowerCase()) ||
          item.post.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.age.toLowerCase().includes(value.toLowerCase()) ||
          item.salary.toLowerCase().includes(value.toLowerCase()) ||
          item.start_date.toLowerCase().includes(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={searchValue.length ? Math.ceil(customerData.length / 7) : Math.ceil(customerData.length / 7) || 1}
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

  const OrderCustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={searchValue.length ? Math.ceil(customerOrderData.length / 7) : Math.ceil(customerOrderData.length / 7) || 1}
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

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(data[0])

    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
      let ctr = 0
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter

        result += item[key]

        ctr++
      })
      result += lineDelimiter
    })

    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  const handleRowClicked = row => {
    dispatch(getAllCustomerOrderDetail({ data: row.fbid, orderType: 1 }))
    console.log(row)
  };

  const handleOrderRowClicked = row => {
    // dispatch(getAllCustomerOrderDetail({ data: row.fbid, orderType: 1 }))
    
    setModal(!modal)
    setSelectedData(row)
    console.log(row)
  };

  useEffect(() => {
    dispatch(getAllCustomer())
  }, [])


  useEffect(() => {
    if (getResult == true && allCustomer !== null) {
      const data = allCustomer.map(item => {
        return { id: item._id, fullname: item.fullname, fbid: item.facebook_id, phone: item.phone, address: item.address, order: '', total: '', shop: '' }
      })
      setCustomerData(data)
      // console.log(allCustomer)
    }
  }, [getResult, allCustomer])

  useEffect(() => {
    if (getCustomerOrderResult == true && allCustomerOrder !== null) {
      const data = allCustomerOrder.map((item, key) => {
        return { stt: key + 1, customerName: item.customerName, total: item.total, phone: item.phone, address: item.address, createAt: formatTimeStamp(item.createAt), status: item.status }
      })
      setCustomerOrderData(data)
      // console.log(allCustomerOrder)
    }
  }, [getCustomerOrderResult, allCustomerOrder])

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <div className='d-flex mt-md-0 mt-1'>
            <UncontrolledButtonDropdown>
              <DropdownToggle color='secondary' caret outline>
                <Share size={15} />
                <span className='align-middle ms-50'>Export</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className='w-100'>
                  <Printer size={15} />
                  <span className='align-middle ms-50'>Print</span>
                </DropdownItem>
                <DropdownItem className='w-100' onClick={() => downloadCSV(data)}>
                  <FileText size={15} />
                  <span className='align-middle ms-50'>CSV</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Grid size={15} />
                  <span className='align-middle ms-50'>Excel</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <File size={15} />
                  <span className='align-middle ms-50'>PDF</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Copy size={15} />
                  <span className='align-middle ms-50'>Copy</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='3' sm='12'>
            <Label className='me-1' for='search-input'>
              Search
            </Label>
            <Input
              className='dataTable-filter mb-50'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={customerManageColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={searchValue.length ? filteredData : customerData}
            onRowClicked={handleRowClicked}
          // onSelectedRowsChange={handleChange}
          />
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Chi tiết</CardTitle>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='3' sm='12'>
            <Label className='me-1' for='search-input'>
              Search
            </Label>
            <Input
              className='dataTable-filter mb-50'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={customerOrderManageColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={OrderCustomPagination}
            data={searchValue.length ? filteredData : customerOrderData}
            onRowClicked={handleOrderRowClicked}
          />
        </div>
      </Card>
      <OrderDetailModal show={modal} setShow={setModal} detailData={selectedData}/>
    </Fragment>
  )
}

export default CustomerManagement
