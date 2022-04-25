import { Fragment, useState, forwardRef, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Facebook } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import { getAllUser, changeStatusUser } from '../../../services/admin'
import { UserServices } from '../../../services'
import { useDispatch, useSelector } from 'react-redux'
import { formatMoney, formatTimeStamp, getRoleByType } from '../../../utility/Utils'
import Flatpickr from 'react-flatpickr'
import { toast, Slide } from 'react-toastify'
import { updateUser } from '../../../services/admin'
import ChangePasswordModal from './ChangePasswordModal'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

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
  FormFeedback,
  FormGroup
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

const UserManagement = () => {
  const defaultSelectedData = { _id: '', full_name: '', phone: '', role: '', salary: '', status: 1, password: '', email: '', owner: '', birthdate: '', joiningdate: '', post_total: '', product_total: '', fuid: '' }
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([{}])
  const [userData, setUserData] = useState([])
  const [selectedData, setSelectedData] = useState(defaultSelectedData)
  const [toggleSwitch, setToggleSwitch] = useState(false)
  const { allUser, getResult, userUpdated, updatedUserResult, deactiveUser, deactiveUserResult } = useSelector(state => state.adminReducer);
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const [emailError, setEmailError] = useState(false)
  const [fullnameError, setFullnamError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [birthDateError, setBirthDateError] = useState(false)

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
      name: 'Ngày sinh',
      sortable: true,
      minWidth: '250px',
      selector: row => row.birthdate
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
        console.log(item)
        const includes =
          item.full_name.toLowerCase().includes(value.toLowerCase()) ||
          item.phone.toLowerCase().includes(value.toLowerCase()) ||
          item.role.toLowerCase().includes(value.toLowerCase()) ||
          item.salary.toLowerCase().includes(value.toLowerCase()) ||
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
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(userData[0])

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

    const filename = 'Dữ liệu người dùng.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  const handleRowClicked = row => {
    UserServices.getUserDetail('?id=' + row.id).then(data => {
      console.log(data.data.data)
      setSelectedData(data.data.data)
    })
    // Table not in searching 
    const newData = userData.map(item => {
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

    console.log(filteredData)
    // Table in searching
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

    setUserData(newData)
    setFilteredData(newSearchingData)
    setToggleSwitch(!Boolean(row.status))
  };

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

  const handleChangePassClicked = () => {
    setModal(!modal)
  }

  const handleSwitchClicked = () => {
    dispatch(changeStatusUser(selectedData._id))
  }


  const handleFBClicked = (facebook) => {

    if (facebook == undefined) {
      toast.error(
        <ToastContent name={'lỗi'} message='Người dùng không có Facebook' />,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    } else {
      window.open(`https://www.facebook.com/profile.php?id=${facebook.uid}`, '_blank').focus();
    }
  }

  const validateFullname = (e) => {
    const fullnameRegex = /^([\w]{2,})+\s+([\w\s]{2,})+$/i
    if (fullnameRegex.test(e.target.value)) {
      setFullnamError(false)
    } else {
      setFullnamError(true)
    }
  }

  const validateEmail = (e) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (emailRegex.test(e.target.value)) {
      setEmailError(false)
    } else {
      setEmailError(true)
    }
  }

  const validatePhone = (e) => {
    const phoneRegex = /^[0-9]{10}$/
    if (phoneRegex.test(e.target.value)) {
      setPhoneError(false)
    } else {
      setPhoneError(true)
    }
  }
  // const validateEmail = (e) => {

  // }

  const onSubmit = e => {
    e.preventDefault();
    console.log(email)
    console.log(fullname)
    console.log(phone)
    console.log(birthDate)
    const submitFullname = fullname == '' ? selectedData.full_name : fullname
    const submitEmail = email == '' ? selectedData.email : email
    const submitPhone = phone == '' ? selectedData.phone : phone
    const submitBirthdate = birthDate == '' ? selectedData.birthdate : birthDate
    if (fullname == '' && email == '' && phone == '' && birthDate == '') {
      toast.info(
        <ToastContent name={'mới'} message={'Cookie không có gì thay dổi'} />,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    } else {
      dispatch(updateUser({
        _id: selectedData.id,
        username: selectedData.username,
        fullname: submitFullname,
        phone: submitPhone,
        email: submitEmail,
        birthdate: submitBirthdate,
        replySyntaxs: selectedData.replySyntaxs
      }))
    }
  }

  // console.log(deactiveUser, deactiveUserResult)

  useEffect(() => {
    if (deactiveUser == null && deactiveUserResult == false) {
      console.log('Loi doi status')
    } else {
      if (deactiveUser.data == null && deactiveUserResult == true) {
        toast.error(
          <ToastContent name={'lỗi'} message={deactiveUser.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      } else if (deactiveUser.data != null && deactiveUserResult == true) {
        toast.success(
          <ToastContent name={'mới'} message={deactiveUser.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
        dispatch(getAllUser())
        setToggleSwitch(!toggleSwitch)
      }
    }
    // console.log(deactiveUser)
  }, [deactiveUser, deactiveUserResult])

  useEffect(() => {
    if (userUpdated == null && updatedUserResult == false) {
      console.log('csadcsd')
    } else {
      if (userUpdated.data == null && updatedUserResult == true) {
        toast.error(
          <ToastContent name={'lỗi'} message={userUpdated.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      } else if (userUpdated.data != null && updatedUserResult == true) {
        toast.success(
          <ToastContent name={'mới'} message={userUpdated.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
        dispatch(getAllUser())
      }
    }
    console.log(userUpdated)
  }, [userUpdated, updatedUserResult])

  useEffect(() => {
    dispatch(getAllUser())
  }, [])

  useEffect(() => {
    if (getResult == true && allUser !== null) {
      let updatedData = []
      const data = allUser.map(item => {
        // console.log(item)
        const fuid = item.facebook === undefined ? null : item.facebook.uid
        const status = item.isActive === undefined ? 0 : Number(item.isActive)
        return { id: item._id, username: item.username, replySyntaxs: item.replySyntaxs, full_name: `${item.fullname}`, phone: `${item.phone}`, role: getRoleByType(item.type), salary: '100'/*formatMoney(calTotal(item.type, item.order))*/, status: status, password: item.password, email: item.email, owner: 'Quang Vinh', birthdate: item.birthdate, joiningdate: formatTimeStamp(item.createAt), post_total: item.post.length, product_total: item.product.length, fuid: fuid, toggleSelected: false }
      })
      if (searchValue.length) {
        updatedData = data.filter(item => {
          const includes =
            item.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.role.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.salary.toLowerCase().includes(searchValue.toLowerCase()) ||
            status[item.status].title.toLowerCase().includes(searchValue.toLowerCase())

          if (includes) {
            return includes
          } else return null
        })
        setFilteredData(updatedData)
      }
      setUserData(data)
    }
  }, [getResult, allUser])


  const calTotal = (type, orders) => {
    let total = 0;
    switch (type) {
      case 0:
        orders.forEach(order => total += order.shipCost)
        break;
      case 1:
        orders.forEach(order => {
          order.product.forEach(prd => {
            total += parseInt(prd.quantity) * prd.product.price
          })
        })
        break;
      default:
        break;
    }
    return total
  }

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
                <DropdownItem className='w-100' onClick={() => downloadCSV(userData)}>
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
            columns={userManageColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={searchValue.length ? filteredData : userData}
            onRowClicked={handleRowClicked}
            conditionalRowStyles={conditionalRowStyles}
            pointerOnHover
            highlightOnHover
          />
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Chi tiết</CardTitle>
        </CardHeader>

        <Form onSubmit={onSubmit}>
          <CardBody>

            <Row>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='fullnameMulti'>
                  Tên chủ tài khoản
                </Label>
                <Input type='text' name='fullname' id='fullnameMulti' placeholder='Họ và tên' defaultValue={selectedData.fullname || selectedData.full_name} invalid={fullnameError} onChange={(e) => {
                  validateFullname(e)
                  setFullname(e.target.value)
                }} />
                {fullnameError ? <FormFeedback>Tên không phù hợp</FormFeedback> : null}
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='phoneMulti'>
                  Số điện thoại
                </Label>
                <Input type='text' name='phone' id='phoneMulti' placeholder='Số điện thoại' defaultValue={selectedData.phone} invalid={phoneError} onChange={(e) => {
                  validatePhone(e)
                  setPhone(e.target.value)
                }} />
                {phoneError ? <FormFeedback>Số điện thoại không phù hợp</FormFeedback> : null}
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='emailMulti'>
                  Email
                </Label>
                <Input type='text' name='email' id='emailMulti' placeholder='Email' defaultValue={selectedData?.email} invalid={emailError} onChange={(e) => {
                  validateEmail(e)
                  setEmail(e.target.value)
                }} />
                {emailError ? <FormFeedback>Email không phù hợp</FormFeedback> : null}
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='birthdateMulti'>
                  Ngày sinh
                </Label>
                <Flatpickr id='date-time-picker' className='form-control' defaultValue={selectedData.birthdate} onChange={(date) => setBirthDate(date)} />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='passwordMulti'>
                  Mật khẩu
                </Label>
                <Input type='password' name='password' id='passwordMulti' placeholder='Mật khẩu' value={selectedData.password} disabled/>
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='ownerMulti'>
                  Người chủ
                </Label>
                <Input type='text' name='owner' id='ownerMulti' placeholder='Người quản lý' value={selectedData?.jobs == undefined ? '' : selectedData?.jobs[0].owner} disabled />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='postMulti'>
                  Tổng bài
                </Label>
                <Input type='text' name='post' id='postMulti' placeholder='Số bài đăng' value={selectedData?.post?.length || 0} disabled />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='joiningDateMulti'>
                  Ngày tham gia
                </Label>
                <Input type='text' name='joiningdate' id='joiningDateMulti' placeholder='00/00/0000'
                  value={selectedData?.createAt ? formatTimeStamp(selectedData.createAt) : formatTimeStamp(Date.now())}
                  disabled />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='productMulti'>
                  Tổng sản phẩm
                </Label>
                <Input type='text' name='product' id='productMulti' placeholder='Tổng sản phẩm' value={selectedData?.product?.length || 0} disabled />
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <Label className='form-label' for='salaryMulti'>
                  Tổng doanh thu
                </Label>
                <Input type='text' name='salary' id='salaryMulti' placeholder='Tổng doanh thu' value={formatMoney(calTotal(selectedData.type, selectedData.order))} disabled />
              </Col>
              <Col sm='12'>
                <div className='d-flex'>
                  <Button type='submit' className='me-1' color='primary'>
                    Cập nhật
                  </Button>
                  <Button className='me-1' outline color='secondary' onClick={() => handleChangePassClicked()}>
                    Đổi mật khẩu
                  </Button>
                  <Button className='me-1' outline color='primary' onClick={() => handleFBClicked(selectedData.facebook)}>
                    <Facebook size={15} className='align-middle me-sm-25 me-0' />
                    Facebook
                  </Button>
                  <div className='d-flex flex-column'>
                    <Label for='switch-primary' className='form-check-label mb-50'>
                      Khóa
                    </Label>
                    <div className='form-switch form-check-primary'>
                      <Input type='switch' id='switch-primary' name='primary' checked={toggleSwitch} onClick={handleSwitchClicked} />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Form>
      </Card>
      <ChangePasswordModal show={modal} setShow={setModal} data={selectedData} />
    </Fragment>
  )
}

export default UserManagement
