// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { formatMoney, formatTimeStamp } from '@utils'
import { OrderServices, ProductServices, UserServices, ShipperServices } from '@services'
import ShipperOrderCard from '@my-components/Cards/ShipperOrderCard'
// ** Table Data & Columns
// ** Add New Modal Component
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, CloudSnow } from 'react-feather'

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
  Dropdown,
  Table,
  Collapse
} from 'reactstrap'
import { data } from 'jquery'


const OrderManage = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [shopkeepers, setShopkeepers] = useState([])
  const [shipper, setShipper] = useState(null)
  const [filterStatus, setFilterStatus] = useState(-1)
  const [activeOrder, setActiveOrder] = useState([])
  const [deactivateOrder, setDeactivateOrder] = useState([])
  const [jobs, setJobs] = useState([])
  const [products, setProducts] = useState([])
  const [shipperOptions, setShipperOptions] = useState([])
  const [pageSize, setPageSize] = useState(5)
  const [sortOption, setSortOption] = useState({
    key: "createAt",
    value: 1,
    label: "Mới nhất"
  })

  useEffect(() => {
    ShipperServices.getJob({}).then((response) => {
      if (response.data.data) {
        setJobs(response.data.data)
      }
    })

  }, [])

  // Cập nhật thứ tự bảng khi sắp xếp  
  // useEffect(() => {
  //   console.log(`Sort by - ${sortOption.key} -  - ${sortOption.value} `,)
  //   if (sortOption) {
  //     let tempPrd = JSON.parse(JSON.stringify(activeOrder))
  //     setActiveOrder([]);
  //     tempPrd = tempPrd.sort((a, b) => (a[sortOption.key] - b[sortOption.key]) * sortOption.value)
  //     setTimeout(() => setActiveOrder(tempPrd), 1)
  //   }
  // }, [sortOption])

  // Phân Trang Bảng
  useEffect(() => {
    console.log("Current Page: " + currentPage)
    console.log("Page Size: " + pageSize)
    // setDisplayOrder(getCurrentTableData(deactivateOrder))

  }, [currentPage])

  useEffect(() => {
    setCurrentPage(0)
    // setDisplayOrder(getCurrentTableData(deactivateOrder))
  }, [pageSize])


  const updateJob = (row, newStatus) => {
    ShipperServices.updateJob({
      shipper: row.shipper.username,
      shopkeeper: row.shopkeeper.username,
      status: newStatus
    }).then(response => {
      alert(response.data.message)
      if (response.data.data) {
        ShipperServices.getJob({}).then((response) => {
          if (response.data.data) {
            setJobs(response.data.data)
          }
        })
      }
    })
  }


  const tableColumns = [
    {
      name: 'Cửa Hàng',
      sortable: true,
      minWidth: '100px',
      selector: row => row.shopkeeper.fullname,
      // format: row => renderCustomerName(row.customerName, row.customerId)
    },
    {
      name: 'SĐT',
      sortable: true,
      minWidth: '100px',
      selector: row => row.shopkeeper.phone
    },
    {
      name: 'Thời Gian',
      sortable: true,
      minWidth: '150px',
      selector: row => formatTimeStamp(row.createAt)
    },
    {
      name: 'Trạng thái',
      sortable: true,
      minWidth: '130px',
      selector: row => row.status,
      format: row => (<Badge color={row.status == "accepted" ? "success" : "warning"}>
        {row.status == "accepted" ? "Đang làm việc" : "Đang chờ"}
      </Badge>)
    },
    {
      name: 'Hành Động',
      sortable: false,
      minWidth: '200px',
      selector: row => (<Fragment>
        {
          row.status == 'pending' && (<Fragment>
            <Button color="success" size="sm" style={{ marginTop: '5px' }} onClick={() => { updateJob(row, 'accepted') }}> Chấp nhận </Button><br />
            <Button color="danger" size="sm" style={{ margin: '5px 0px ' }} onClick={() => { updateJob(row, 'reject') }}> Từ chối </Button>
          </Fragment>)
        }

        {
          row.status == 'accepted' &&
          <Button color="danger" size="sm" style={{ margin: '5px 0px ' }} onClick={() => { updateJob(row, 'reject') }}> Kết thúc </Button>

        }

      </Fragment>),
    }
  ]



  // const getCurrentTableData = (source) => {
  //   // currentPage = currentPage - 1
  //   console.log("Table's Input: ", source.length, currentPage, pageSize);
  //   let start = currentPage * pageSize;
  //   let end = start + pageSize;
  //   console.log("Table's Output: ", source.slice(start, end));

  //   return source.slice(start, end)
  // }

  // ** Function to handle Modal toggle




  const renderCustomerName = (name, id) => {
    return (
      <a href={'https://facebook.com/' + id} target="_blank">{name}</a>
    )
  }

  function calTotal(products) {
    let sum = 0;
    for (const product of products) {
      sum += parseInt(product.quantity) * product.product.price;
    }
    return sum + "₫";
  }



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


  // ** Bootstrap Checkbox Component
  const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
      <Input type='checkbox' ref={ref} {...props} />
    </div>
  ))


  // ** Custom Pagination
  const CustomPagination = () => {
    // console.log(`${deactivateOrder.length}/${pageSize} = ${Math.ceil(deactivateOrder.length / pageSize)}`)
    return (
      <ReactPaginate
        previousLabel=''
        nextLabel=''
        forcePage={currentPage}
        onPageChange={page => {
          setCurrentPage(page.selected)
        }}
        pageCount={Math.ceil(deactivateOrder.length / pageSize)}
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
  }

  // function updateOrderView(newOrder) {
  //   let match = activeOrder.filter(order => order._id === newOrder._id);
  //   if (match.length > 0) {
  //     match[0] = JSON.parse(JSON.stringify(newOrder));
  //   }
  // }

  function renderOrderCard() {
    let result = [].concat(activeOrder)
      .sort((a, b) => (a[sortOption.key] - b[sortOption.key]) * sortOption.value)
      .map((order, i) => {
        return (<Col lg={4} md={6} sm={12} key={JSON.stringify(order)}>
          <ShipperOrderCard shipper={shipper} products={products} baseOrder={order} />
        </Col>)
      }
      );
    return result
  }

  function renderSortOption(options) {
    let result = [];
    for (let option of options) {
      result.push(
        <DropdownItem key={`Option-${result.length}`} className='w-100' onClick={() => setSortOption(option)}>
          <span className='align-middle ms-50'>{option.label}</span>
        </DropdownItem>
      )

    }
    return result
  }


  return (
    <Fragment>
      {/* BỘ LỌC */}
      <Row>
        <Col className='react-dataTable'>
          <Card className="p-1">
            <CardTitle>
              Công việc
            </CardTitle>
            <CardBody>
              <DataTable
                noHeader
                pagination
                columns={tableColumns}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                data={jobs}
                paginationComponentOptions={
                  { rowsPerPageText: "Số Bản Ghi / Trang" }
                }
                noDataComponent="Bạn chưa có công việc nào"

              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment >
  )
}

export default OrderManage
