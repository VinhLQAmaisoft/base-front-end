import { Fragment, useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { getAllCookie, createNewCookie, updateCookie, deleteCookie } from '../../../services/admin/index'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, Share, FileText, X } from 'react-feather'
import { toast, Slide } from 'react-toastify'

import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  CardBody,
  Form,
  Badge
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


const CookieManagement = () => {
  const defaultSelectedData = { data: '', dtsg: '', uid: '', token: '', status: '' }
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [cookieData, setCookieData] = useState([])
  const [selectedData, setSelectedData] = useState(defaultSelectedData)
  const { allCookie, getResult, cookieResult, createCookieResult, cookieUpdated, updatedCookieResult, deletedCookie, deleteCookieResult } = useSelector(state => state.adminReducer);
  const [newCookie, setNewCookie] = useState('')
  const [updatedCookie, setUpdatedCookie] = useState('')

  const dispatch = useDispatch()

  const status = {
    1: { title: 'Hoạt động', color: 'light-success' },
    0: { title: 'Ngừng hoạt động', color: 'light-danger' },
  }

  const cookieManageColumns = [
    {
      name: 'Cookie',
      sortable: true,
      minWidth: '200px',
      selector: row => row.data.slice(0, 10)
    },
    {
      name: 'FB UID',
      sortable: true,
      minWidth: '50px',
      selector: row => row.uid
    },
    {
      name: 'DTSG',
      sortable: true,
      minWidth: '100px',
      selector: row => row.dtsg
    },
    {
      name: 'Token',
      sortable: true,
      minWidth: '100px',
      selector: row => row.token
    },
    // {
    //   name: 'Ngày tạo',
    //   sortable: true,
    //   minWidth: '250px',
    //   selector: row => row.salary
    // },
    {
      name: 'Trạng thái',
      sortable: true,
      minWidth: '150px',
      selector: row => row.status,
      cell: row => {
        return (
          <Badge color={status[row.status].color} pill>
            {status[row.status].title}
          </Badge>
        )
      }
    },
  ]



  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = cookieData.filter(item => {
        console.log(item)
        const includes =
          item.data.toLowerCase().includes(value.toLowerCase()) ||
          item.dtsg.toLowerCase().includes(value.toLowerCase()) ||
          item.uid.toLowerCase().includes(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().includes(value.toLowerCase())

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

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={searchValue.length ? Math.ceil(cookieData.length / 7) : Math.ceil(cookieData.length / 7) || 1}
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
    const keys = Object.keys(cookieData[0])

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

    const filename = 'Dữ liệu Cookie.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  const handleRowClicked = row => {
    setSelectedData(row)

    const newData = cookieData.map(item => {
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
    setCookieData(newData)
  };

  const deleteCookieClicked = () => {
    dispatch(deleteCookie({ uid: selectedData.uid }))
    console.log(selectedData)
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

  const onUpdateSubmit = e => {
    console.log(updatedCookie)
    if (updatedCookie != '') {
      dispatch(updateCookie({ cookie: updatedCookie, uid: selectedData.uid }))
    } else {
      toast.info(
        <ToastContent name={'mới'} message={'Cookie không có gì thay dổi'} />,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    }
    e.preventDefault()
  }

  const onAddSubmit = e => {
    console.log(newCookie)
    if (newCookie != '') {
      dispatch(createNewCookie({ cookie: newCookie }))
    } else {
      console.log('Rong')
    }
    e.preventDefault()
  }

  useEffect(() => {
    if (deletedCookie == null && deleteCookieResult == false) {
      console.log('csadcsd')
    } else {
      if (deletedCookie.data == null && deleteCookieResult == true) {
        toast.error(
          <ToastContent name={'lỗi'} message={deletedCookie.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      } else if (deletedCookie.data != null && deleteCookieResult == true) {
        toast.success(
          <ToastContent name={'mới'} message={deletedCookie.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
        dispatch(getAllCookie())
        setSelectedData(defaultSelectedData)
      }
    }
  }, [deletedCookie, deleteCookieResult])

  useEffect(() => {
    if (cookieUpdated == null && updatedCookieResult == false) {
      console.log('csadcsd')
    } else {
      if (cookieUpdated.data == null && updatedCookieResult == true) {
        toast.error(
          <ToastContent name={'lỗi'} message={cookieUpdated.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      } else if (cookieUpdated.data != null && updatedCookieResult == true) {
        toast.success(
          <ToastContent name={'mới'} message={cookieUpdated.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
        dispatch(getAllCookie())
      }
    }
    console.log(cookieResult)
  }, [cookieUpdated, updatedCookieResult])


  useEffect(() => {
    if (cookieResult == null && createCookieResult == false) {
      console.log('csadcsd')
    } else {
      if (cookieResult.data == null && createCookieResult == true) {
        toast.error(
          <ToastContent name={'lỗi'} message={cookieResult.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      } else if (cookieResult.data != null && createCookieResult == true) {
        toast.success(
          <ToastContent name={'mới'} message={cookieResult.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
        dispatch(getAllCookie())
      }
    }
    console.log(cookieResult)
  }, [cookieResult, createCookieResult])

  useEffect(() => {
    dispatch(getAllCookie())
  }, [])

  useEffect(() => {
    if (getResult == true && allCookie !== null) {
      const data = allCookie.map(item => {
        // const status = item.sta === undefined ? 0 : Number(item.isActive)
        return { id: item._id, data: item.data, dtsg: item.dtsg, uid: item.uid, token: item.token, status: item.status, toggleSelected: false }
      })
      setCookieData(data)
      console.log(allCookie)
    }
  }, [getResult, allCookie])

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
                <DropdownItem className='w-100' onClick={() => downloadCSV(cookieData)}>
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
            columns={cookieManageColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={searchValue.length ? filteredData : cookieData}
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
          <CardTitle tag='h4'>Sửa Cookie</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={onUpdateSubmit}>
            <Row>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='updateCookie'>
                  Cookie
                </Label>
                <Input type='text' name='updateCookie' id='updateCookieMulti' placeholder='Cookie' defaultValue={selectedData.data} onChange={e => setUpdatedCookie(e.target.value)} />
              </Col>
              <Col sm='12'>
                <div className='d-flex'>
                  <Button className='me-1' color='primary' type='submit'>
                    Cập nhật
                  </Button>
                  <Button color='danger' className='text-nowrap px-1' onClick={deleteCookieClicked} outline>
                    <X size={14} className='me-50' />
                    <span>Xóa</span>
                  </Button>
                </div>

              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Thêm Cookie</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={onAddSubmit}>
            <Row>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='newCookieMulti'>
                  Cookie
                </Label>
                <Input type='text' name='newCookie' id='newCookieMulti' placeholder='Cookie' onChange={e => setNewCookie(e.target.value)} />
              </Col>
              <Col sm='12'>
                <div className='d-flex'>
                  <Button className='me-1' color='primary' type='submit'>
                    Thêm
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default CookieManagement
