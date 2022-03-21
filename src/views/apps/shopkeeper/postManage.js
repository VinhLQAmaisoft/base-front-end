// ** React Imports
import { Fragment, useState, forwardRef } from 'react'
import GroupIcon from '@src/assets/custom-icon/group.png'
import PostData from '@src/dummyData/posts.json'
import PostCard from '../../components/Cards/PostCard'
// ** Table Data & Columns
import { data, advSearchColumns } from './data'
// ** Add New Modal Component
import AddNewModal from './AddNewModal'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus } from 'react-feather'

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
  CardSubtitle,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Badge,
  CardBody,
  CardFooter,
  Dropdown
} from 'reactstrap'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const PostManage = () => {
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [filterStatus, setFilterStatus] = useState(-1)
  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    const status = {
      1: { title: 'Current', color: 'light-primary' },
      2: { title: 'Professional', color: 'light-success' },
      3: { title: 'Rejected', color: 'light-danger' },
      4: { title: 'Resigned', color: 'light-warning' },
      5: { title: 'Applied', color: 'light-info' }
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

  function renderPostCard(listPost) {
    let result = [];
    for (let post of listPost) {
      if ((filterStatus != -1 && post.status == filterStatus) || filterStatus == -1) {
        if (post.content.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
          result.push(
            <Col sm='4' className='mb-1' key={post.fb_id}>
              <PostCard props={post} />
            </Col>
          )
        }
      }
    }
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

  return (
    <Fragment>
      <Row>
        <Col sm={12}>
          <Card className="p-1">
            <CardTitle>Bộ Lọc</CardTitle>

            <Row>
              <Col sm={3} className="d-flex pt-1 pb-1 align-items-center" >
                <Label style={{ fontSize: '15px', marginRight: '10px' }} >
                  Trạng Thái:
                </Label>
                <UncontrolledButtonDropdown>
                  <DropdownToggle color='secondary' caret outline>
                    <span className='align-middle ms-50'>{filterStatus == -1 ? "Tất Cả" : filterStatus == 0 ? "Hoạt Động" : "Kết thúc"}</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem className='w-100' onClick={() => setFilterStatus(-1)}>

                      <span className='align-middle ms-50'>Tất Cả</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => setFilterStatus(0)}>

                      <span className='align-middle ms-50'>Hoạt Động</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => setFilterStatus(1)}>

                      <span className='align-middle ms-50'>Kết Thúc</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </Col>
              <Col className='d-flex align-items-center justify-content-end mt-1' sm={6}>
                <Label style={{ fontSize: '15px', marginRight: '10px' }} className='me-1' for='search-input'>
                  Search
                </Label>
                <Input
                  className='dataTable-filter mb-50'
                  style={{ padding: '0.78rem 1.5rem' }}
                  placeholder="Nội dung muốn tìm"
                  type='text'
                  bsSize='sm'
                  id='search-input'
                  value={searchValue}
                  onChange={handleFilter}
                />
              </Col>
            </Row>

          </Card>
        </Col>
      </Row>
      <Row>
        {renderPostCard(PostData)}
      </Row>
      <style>

      </style>
      <AddNewModal open={modal} handleModal={handleModal} />
    </Fragment >
  )
}

export default PostManage
