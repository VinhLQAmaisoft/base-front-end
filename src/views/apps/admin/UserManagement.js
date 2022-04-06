import { Fragment, useState, forwardRef, useEffect } from 'react'
import { userdata, userManageColumns, allDataUser } from '../admin/data'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Facebook } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import { getAllUser } from '../../../services/admin'
import { useDispatch, useSelector } from 'react-redux'
import { formatTimeStamp, getRoleByType } from '../../../utility/Utils'
import Flatpickr from 'react-flatpickr'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'


import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

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
  Form,
  Badge,
  FormFeedback
} from 'reactstrap'

// ** Bootstrap Checkbox Component
// const BootstrapCheckbox = forwardRef((props, ref) => (
//   <div className='form-check'>
//     <Input type='checkbox' ref={ref} {...props} />
//   </div>
// ))



const UserManagement = () => {
  const defaultSelectedData = { full_name: '', phone: '', role: '', salary: '', status: 1, password: '', email: '', owner: '', birthdate: '', joiningdate: '', post_total: '', product_total: '' }
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([{}])
  const [userData, setUserData] = useState([])
  const [selectedData, setSelectedData] = useState(defaultSelectedData)
  const { allUser, getResult } = useSelector(state => state.adminReducer);
  const dispatch = useDispatch()

  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')

  const onSubmit = e => {
    e.preventDefault();
    console.log(fullname, phone, email, dob)
  }



  const status = {
    1: { title: 'Hoạt động', color: 'light-success' },
    0: { title: 'Ngừng hoạt động', color: 'light-danger' },
  }

  const userManageColumns = [
    {
      name: 'Người dùng',
      sortable: true,
      minWidth: '200px',
      selector: row => row.full_name
    },
    {
      name: 'Số điện thoại',
      sortable: true,
      minWidth: '250px',
      selector: row => row.phone
    },
    {
      name: 'Vai trò',
      sortable: true,
      minWidth: '250px',
      selector: row => row.role
    },
    {
      name: 'Doanh thu',
      sortable: true,
      minWidth: '250px',
      selector: row => row.salary
    },
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

    const status = {
      1: { title: 'Hoạt động', color: 'light-danger' },
      0: { title: 'Ngừng hoạt động', color: 'light-success' },
    }

    if (value.length) {
      updatedData = userData.filter(item => {
        const startsWith =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.phone.toLowerCase().startsWith(value.toLowerCase()) ||
          item.role.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.phone.toLowerCase().startsWith(value.toLowerCase()) ||
          item.role.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

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
      pageCount={searchValue.length ? Math.ceil(filteredData.length / 7) : Math.ceil(userData.length / 7) || 1}
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
  // function convertArrayOfObjectsToCSV(array) {
  //   let result

  //   const columnDelimiter = ','
  //   const lineDelimiter = '\n'
  //   const keys = Object.keys(data[0])

  //   result = ''
  //   result += keys.join(columnDelimiter)
  //   result += lineDelimiter

  //   array.forEach(item => {
  //     let ctr = 0
  //     keys.forEach(key => {
  //       if (ctr > 0) result += columnDelimiter

  //       result += item[key]

  //       ctr++
  //     })
  //     result += lineDelimiter
  //   })

  //   return result
  // }

  // // ** Downloads CSV
  // function downloadCSV(array) {
  //   const link = document.createElement('a')
  //   let csv = convertArrayOfObjectsToCSV(array)
  //   if (csv === null) return

  //   const filename = 'export.csv'

  //   if (!csv.match(/^data:text\/csv/i)) {
  //     csv = `data:text/csv;charset=utf-8,${csv}`
  //   }

  //   link.setAttribute('href', encodeURI(csv))
  //   link.setAttribute('download', filename)
  //   link.click()
  // }

  const handleRowClicked = row => {
    console.log(row)
    setSelectedData(row)
  };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   console.log(data)
  //   // setSelectedData(row)
  // };

  useEffect(() => {
    dispatch(getAllUser())
  }, [])

  useEffect(() => {
    if (getResult === true) {
      const data = allUser.map(item => {
        const status = item.isActive === undefined ? 0 : Number(item.isActive)
        return { full_name: `${item.fullname}`, phone: `${item.phone}`, role: getRoleByType(item.type), salary: '100', status: status, password: item.password, email: item.email, owner: 'Quang Vinh', birthdate: item.birthdate, joiningdate: formatTimeStamp(item.createAt), post_total: item.post.length, product_total: item.product.length }
      })
      setUserData(data)
    }
  }, [getResult])

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
            columns={userManageColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={searchValue.length ? filteredData : userData}
            onRowClicked={handleRowClicked}
          // selectableRowsComponent={BootstrapCheckbox}
          // onSelectedRowsChange={handleChange}
          />
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Chi tiết</CardTitle>
        </CardHeader>

        <CardBody>

          <Row>
            <Form onSubmit={(e) => onSubmit(e)}>
              <Row>
                <Col md='6' sm='12' className='mb-1'>
                  <Label className='form-label' for='nameMulti'>
                    Tên tài khoản
                  </Label>
                  <Input type='text' name='name' id='nameMulti' placeholder='Tran Van A' value={selectedData.full_name} onChange={(e) => console.log(e.target.value)} />
                </Col>
                <Col md='6' sm='12' className='mb-1'>
                  <Label className='form-label' for='phoneMulti'>
                    Số điện thoại
                  </Label>
                  <Input type='text' name='phone' id='phoneMulti' placeholder='phone' value={selectedData.phone} onChange={(e) => console.log(e.target.value)} />
                </Col>
                <Col md='6' sm='12' className='mb-1'>
                  <Label className='form-label' for='emailMulti'>
                    Email
                  </Label>
                  <Input type='email' name='email' id='emailMulti' placeholder='email' value={selectedData.email} onChange={(e) => console.log(e.target.value)} />
                </Col>
                <Col md='6' sm='12' className='mb-1'>
                  <Label className='form-label' for='birthdateMulti'>
                    Ngày sinh
                  </Label>
                  <Flatpickr id='date-time-picker' className='form-control' value={selectedData.birthdate} onChange={(date) => field.onChange(date)} />
                </Col>
              </Row>
            </Form>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='passwordMulti'>
                Mật khẩu
              </Label>
              <Input type='password' name='password' id='passwordMulti' placeholder='Mật khẩu' value={selectedData.password} />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='ownerMulti'>
                Người chủ
              </Label>
              <Input type='text' name='owner' id='ownerMulti' placeholder='owner' value={selectedData.owner} disabled />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='postMulti'>
                Tổng bài
              </Label>
              <Input type='text' name='post' id='postMulti' placeholder='post' value={selectedData.post_total} disabled />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='joiningDateMulti'>
                Ngày tham gia
              </Label>
              <Input type='text' name='joiningdate' id='joiningDateMulti' placeholder='00/00/0000' value={selectedData.joiningdate} disabled />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='productMulti'>
                Tổng sản phẩm
              </Label>
              <Input type='text' name='product' id='productMulti' placeholder='100' value={selectedData.product_total} disabled />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='salaryMulti'>
                Tổng doanh thu
              </Label>
              <Input type='text' name='salary' id='salaryMulti' placeholder='25000' value={selectedData.salary} disabled />
            </Col>
            <Col sm='12'>
              <div className='d-flex'>
                <Button className='me-1' color='primary' type='submit'>
                  Cập nhật
                </Button>
                <Button className='me-1' outline color='secondary' type='reset'>
                  Đổi mật khẩu
                </Button>
                <Button className='me-1' outline color='secondary' type='reset'>
                  Thông tin cá nhân
                </Button>
                <Button outline color='' type='reset'>
                  <Facebook size={15} className='align-middle me-sm-25 me-0' />
                  Facebook
                </Button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserManagement
