// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

// ** Table Data & Columns
import { data, userManageColumns } from '../admin/data'

// ** Add New Modal Component
import AddNewModal from './AddNewModal'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus } from 'react-feather'
import { UserData } from '../../../dummyData'

// ** Reactstrap Imports
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
  Form
} from 'reactstrap'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const UserManagement = () => {
  const defaultSelectedData = { full_name: '', phone: '', role: '', salary: '', status: 1, password: '', email: '', owner: '', birthdate: '', joiningdate: '', post_total: '', product_total: '' }
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const [selectedData, setSelectedData] = useState(defaultSelectedData)

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    const status = {
      1: { title: 'Hoạt động', color: 'light-danger' },
      0: { title: 'Ngừng hoạt động', color: 'light-success' },
    }

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
      pageCount={searchValue.length ? Math.ceil(filteredData.length / 7) : Math.ceil(data.length / 7) || 1}
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
    console.log(row)
    setSelectedData(row)
  };

  useEffect(() => {
    console.log(UserData)
    const data = UserData.map(item => {
      return { full_name: item.fullname, phone: item.phone, role: item.type, salary: '100', status: Number(item.isActive), password: item.password, email: item.email, owner: 'Quang Vinh', birthdate: item.birthdate, joiningdate: item.createAt, post_total: item.post.length, product_total: item.product.length }
    })
    console.log(data)
  }, [])


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
            <Button className='ms-2' color='primary' onClick={handleModal}>
              <Plus size={15} />
              <span className='align-middle ms-50'>Add Record</span>
            </Button>
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
            selectableRows
            columns={userManageColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={searchValue.length ? filteredData : data}
            onRowClicked={handleRowClicked}
            selectableRowsComponent={BootstrapCheckbox}
          // onSelectedRowsChange={handleChange}
          />
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Chi tiết</CardTitle>
        </CardHeader>

        <CardBody>
          <Form>
            <Row>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='nameMulti'>
                  Tên tài khoản
                </Label>
                <Input type='text' name='name' id='nameMulti' placeholder='Tran Van A' value={selectedData.full_name} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='passwordMulti'>
                  Mật khẩu
                </Label>
                <Input type='password' name='password' id='passwordMulti' placeholder='Mật khẩu' value={selectedData.password} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='phoneMulti'>
                  Số điện thoại
                </Label>
                <Input type='text' name='phone' id='phoneMulti' placeholder='phone' value={selectedData.phone} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='emailMulti'>
                  Email
                </Label>
                <Input type='email' name='email' id='emailMulti' placeholder='email' value={selectedData.email} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='birthdateMulti'>
                  Ngày sinh
                </Label>
                <Input type='text' name='birthdate' id='birthdateMulti' placeholder='birthdate' value={selectedData.birthdate} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='ownerMulti'>
                  Người chủ
                </Label>
                <Input type='text' name='owner' id='ownerMulti' placeholder='owner' value={selectedData.owner} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='postMulti'>
                  Tổng bài
                </Label>
                <Input type='text' name='post' id='postMulti' placeholder='post' value={selectedData.post_total} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='joiningDateMulti'>
                  Ngày tham gia
                </Label>
                <Input type='text' name='joiningdate' id='joiningDateMulti' placeholder='00/00/0000' value={selectedData.joiningdate} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='productMulti'>
                  Tổng sản phẩm
                </Label>
                <Input type='text' name='product' id='productMulti' placeholder='100' value={selectedData.product_total} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='salaryMulti'>
                  Tổng doanh thu
                </Label>
                <Input type='text' name='salary' id='salaryMulti' placeholder='25000' value={selectedData.salary} />
              </Col>
              <Col sm='12'>
                <div className='d-flex'>
                  <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                    Cập nhật
                  </Button>
                  <Button className='me-1' outline color='secondary' type='reset'>
                    Đổi mật khẩu
                  </Button>
                  <Button className='me-1' outline color='secondary' type='reset'>
                    Thông tin cá nhân
                  </Button>
                  <Button outline color='secondary' type='reset'>
                    Facebook
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <AddNewModal open={modal} handleModal={handleModal} />
    </Fragment>
  )
}

export default UserManagement
