import { Fragment, useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy } from 'react-feather'
import { getAllCustomer, getAllCustomerOrderDetail } from '../../../services/admin/index'
import { useDispatch, useSelector } from 'react-redux'
import { formatTimeStamp, alert, formatMoney } from '../../../utility/Utils'
import OrderDetailModal from './OrderDetailModal'
import { toast, Slide } from 'react-toastify'
// import { Link } from 'react-router-dom'
// ** Reactstrap Imports
import '@styles/react/libs/tables/react-dataTable-component.scss'

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

const ToastContent = ({ name, message }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <h6 className='toast-title fw-bold'>Thông báo {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>{message}</span>
    </div>
  </Fragment>
)

const CustomerManagement = () => {
  // const defaultSelectedData = { data: '', dtsg: '', uid: '', token: '', status: '' }
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentOrderPage, setCurrentOrderPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [searchOrderValue, setSearchOrderValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [filteredOrderData, setFilteredOrderData] = useState([])
  const [customerData, setCustomerData] = useState([])
  const [customerOrderData, setCustomerOrderData] = useState([])
  const [selectedData, setSelectedData] = useState(null)

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
      minWidth: '240px',
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
      minWidth: '50px',
      selector: row => row.order
    },
    {
      name: 'Tổng tiền',
      sortable: true,
      minWidth: '100px',
      selector: row => row.total,
      format: row => formatMoney(row.total)
    },
  ]

  const customerOrderManageColumns = [
    {
      name: 'STT',
      sortable: true,
      minWidth: '150px',
      selector: row => row.id,
      format: row => row.stt
    },
    {
      name: 'Giá trị',
      sortable: true,
      minWidth: '200px',
      selector: row => row.total,
      format: row => formatMoney(row.total)
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
      updatedData = customerData.filter(item => {
        console.log(item.address)
        const includes =
          item.fullname.filter(i => i.toLowerCase().includes(value.toLowerCase())) ||
          item.fbid.toLowerCase().includes(value.toLowerCase()) ||
          item.phone.filter(i => i.toLowerCase().includes(value.toLowerCase())) ||
          item.address.filter(i => {
            console.log(i)
            i.toLowerCase().includes(value.toLowerCase())
          }) ||
          item.order.toLowerCase().includes(value.toLowerCase()) ||
          item.total.toLowerCase().includes(value.toLowerCase())
        console.log(includes)
        if (includes) {
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

  const handleOrderPagination = page => {
    setCurrentOrderPage(page.selected)
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={searchValue.length ? Math.ceil(filteredData.length / 7) : Math.ceil(customerData.length / 7) || 1}
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
      forcePage={currentOrderPage}
      onPageChange={page => handleOrderPagination(page)}
      pageCount={searchValue.length ? Math.ceil(filteredOrderData.length / 7) : Math.ceil(customerOrderData.length / 7) || 1}
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
    const keys = Object.keys(customerData[0])

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

    const filename = 'Dữ liệu khách hàng.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  const conditionalRowStyles = [
    {
      when: row => {
        return row.toggleSelected
      },
      style: {
        backgroundColor: "#f0f0f0",
        userSelect: "none"
      }
    }
  ];

  const handleRowClicked = row => {
    dispatch(getAllCustomerOrderDetail({ data: row.fbid, orderType: 1 }))

    const newData = customerData.map(item => {
      if (row.id != item.id) {
        return {
          ...item,
          toggleSelected: false
        }
      }
      return {
        ...item,
        toggleSelected: !item.toggleSelected
      }
    })

    const newSearchingData = filteredData.map(item => {
      if (row.id != item.id) {
        return {
          ...item,
          toggleSelected: false
        }
      }
      return {
        ...item,
        toggleSelected: !item.toggleSelected
      }
    })

    setFilteredData(newSearchingData)
    setCustomerData(newData)
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
        return { id: item._id, fullname: item.fullname, fbid: item.facebook_id, phone: item.phone, address: item.address, order: item.numberOfOrders, total: item.totalSpends }
      })
      setCustomerData(data)
      // console.log(allCustomer)
    }
  }, [getResult, allCustomer])

  useEffect(() => {
    console.log(getCustomerOrderResult, allCustomerOrder)
    if (getCustomerOrderResult == true && allCustomerOrder.data !== null) {
      if (allCustomerOrder.data != null) {
        alert.success(allCustomerOrder.message)
        const data = allCustomerOrder.data.map((item, key) => {
          return { stt: key + 1, ...item, createAt: formatTimeStamp(item.createAt), status: item.status }
        })
        setCustomerOrderData(data)
      } else {
        toast.error(
          <ToastContent name={'lỗi'} message={allCustomerOrder.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      }
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
                <DropdownItem className='w-100' onClick={() => downloadCSV(customerData)}>
                  <FileText size={15} />
                  <span className='align-middle ms-50'>CSV</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='3' sm='12'>
            <Input
              className='dataTable-filter mb-50'
              type='text'
              bsSize='sm'
              id='search-input'
              placeholder='Tìm kiếm'
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
            conditionalRowStyles={conditionalRowStyles}
            pointerOnHover
            highlightOnHover
          // onSelectedRowsChange={handleChange}
          />
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Chi tiết</CardTitle>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={customerOrderManageColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentOrderPage + 1}
            paginationComponent={OrderCustomPagination}
            data={searchValue.length ? filteredOrderData : customerOrderData}
            onRowClicked={handleOrderRowClicked}
          />
        </div>
      </Card>
      {selectedData && <OrderDetailModal show={modal} setShow={setModal} detailData={selectedData} />}
      </Fragment>
  )
}

export default CustomerManagement
