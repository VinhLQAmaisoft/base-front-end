// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { formatMoney, formatTimeStamp } from '@utils'
import { OrderServices, ProductServices, UserServices } from '@services'
import OrderCard from '@my-components/Cards/OrderCard'
// ** Table Data & Columns
// ** Add New Modal Component
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
    Dropdown,
    Table,
    Collapse
} from 'reactstrap'


const OrderManage = () => {
    // ** States
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [filterStatus, setFilterStatus] = useState(-1)
    const [activeOrder, setActiveOrder] = useState([])
    const [deactivateOrder, setDeactivateOrder] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [displayOrder, setDisplayOrder] = useState([])
    const [products, setProducts] = useState([])
    const [shipperOptions, setShipperOptions] = useState([])
    const [pageSize, setPageSize] = useState(5)
    const [sortOption, setSortOption] = useState({
        key: "createAt",
        value: 1,
        label: "Mới nhất"
    })

    useEffect(() => {
        UserServices.getProfile().then(data => {
            if (data.data.data) {
                let rawShipper = data.data.data.shippers;
                let shippers = rawShipper.map(shipper => {
                    let data = shipper.split('---');
                    return {
                        fullName: data[0],
                        username: data[1],
                    }
                })
                setShipperOptions(shippers)
                console.log("My Shipper: ", shippers)
            }
        })

        ProductServices.getProduct('').then(data => {
            // console.log("My Products: ", data.data.data)
            setProducts(data.data.data)
        })
        OrderServices.getOrder('').then(data => {
            let OrderData = []
            if (data.data.data) {
                OrderData = data.data.data
                let doneOrder = OrderData.filter(order => ["cancel", "done"].includes(order.status))
                console.log("Source data: " + OrderData.length)
                setDeactivateOrder(doneOrder)
                // setDisplayOrder(getCurrentTableData(doneOrder))
                setActiveOrder(OrderData.filter(order => ["created", "ready", "shipping"].includes(order.status)))
            }
        })
    }, [])

    // Cập nhật thứ tự bảng khi sắp xếp  
    useEffect(() => {
        console.log(`Sort by - ${sortOption.key} -  - ${sortOption.value} `,)
        if (sortOption) {
            let tempPrd = JSON.parse(JSON.stringify(activeOrder))
            setActiveOrder([]);
            tempPrd = tempPrd.sort((a, b) => (a[sortOption.key] - b[sortOption.key]) * sortOption.value)
            setTimeout(() => setActiveOrder(tempPrd), 1)
        }
    }, [sortOption])

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


    const sortOptions = [
        {
            key: "createAt",
            value: -1,
            label: "Mới nhất"
        },
        {
            key: "createAt",
            value: 1,
            label: "Cũ nhất"
        },
        {
            key: "updateAt",
            value: -1,
            label: "Mới cập nhật"
        },
        {
            key: "updateAt",
            value: 1,
            label: "Chưa cập nhật"
        },
        {
            key: "product.length",
            value: -1,
            label: "Nhiều sản phẩm "
        }, {
            key: "product.length",
            value: 1,
            label: "Ít sản phẩm"
        },
    ]

    const tableColumns = [
        {
            name: 'Khách Hàng',
            sortable: true,
            minWidth: '150px',
            selector: row => row.customerName,
            format: row => renderCustomerName(row.customerName, row.customerId)
        },
        {
            name: 'SĐT',
            sortable: true,
            minWidth: '100px',
            selector: row => row.phone
        },
        {
            name: 'Địa Chỉ',
            sortable: true,
            minWidth: '150px',
            selector: row => row.address
        },
        {
            name: 'Shipper',
            sortable: true,
            minWidth: '150px',
            selector: row => row.customerName
        },
        {
            name: 'Thời Gian',
            sortable: true,
            minWidth: '150px',
            selector: row => formatTimeStamp(row.updateAt)
        },
        {
            name: 'Kết Quả',
            sortable: true,
            minWidth: '130px',
            selector: row => row.status,
            format: row => (<Badge color={row.status == "done" ? "success" : row.status == "cancel" ? "danger" : "warning"}>
                {row.status == "done" ? "Hoàn Thành" : row.status == "cancel" ? "Hủy Đơn" : "Khác"}
            </Badge>)
        },
        {
            name: 'Giá Tiền',
            sortable: true,
            minWidth: '100px',
            selector: row => formatMoney(calTotal(row.product))
        }
    ]



    const getCurrentTableData = (source) => {
        // currentPage = currentPage - 1
        console.log("Table's Input: ", source.length, currentPage, pageSize);
        let start = currentPage * pageSize;
        let end = start + pageSize;
        console.log("Table's Output: ", source.slice(start, end));

        return source.slice(start, end)
    }

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

    function updateOrderView(newOrder) {
        let match = activeOrder.filter(order => order._id === newOrder._id);
        if (match.length > 0) {
            match[0] = JSON.parse(JSON.stringify(newOrder));
        }
    }

    function renderOrderCard() {
        let result = [].concat(activeOrder)
            .sort((a, b) => (a[sortOption.key] - b[sortOption.key]) * sortOption.value)
            .map((order, i) => {
                console.log(`Order Card at ${i}: ` + order[sortOption.key])
                return (<Col lg={4} md={6} sm={12} key={order._id.$oid}>
                    <OrderCard shipperOptions={shipperOptions} products={products} baseOrder={order} />
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
                <Col sm={12}>
                    <Card className="p-1">
                        <CardTitle>Bộ Lọc</CardTitle>
                        <Row>
                            <Col sm={6} className="d-flex pt-1 pb-1 align-items-center" >
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

                            <Col sm={6} className="d-flex pt-1 pb-1 align-items-center" >
                                <Label style={{ fontSize: '15px', marginRight: '10px' }} >
                                    Sắp Xếp:
                                </Label>
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color='secondary' caret outline>
                                        <span className='align-middle ms-50'>{sortOption.label}</span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {renderSortOption(sortOptions)}
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </Col>



                            {/* <Col className='d-flex align-items-center justify-content-end mt-1' sm={6}>
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
                            </Col> */}
                        </Row>

                    </Card>
                </Col>
            </Row>
            {(filterStatus == -1 || filterStatus == 0) && (
                <Row>
                    {activeOrder && renderOrderCard()}
                    {(activeOrder.length == 0 || !activeOrder) && (
                        <Col>
                            <Card>
                                <CardBody>
                                    Không còn đơn hàng nào cần xử lý
                                </CardBody>
                            </Card>
                        </Col>
                    )}
                </Row>
            )
            }
            {
                (filterStatus == -1 || filterStatus == 1) && (<Row>
                    <Col className='react-dataTable'>
                        {console.log("Final Table's Data: ", displayOrder.length)}
                        <DataTable
                            noHeader
                            pagination
                            columns={tableColumns}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            data={deactivateOrder}
                            paginationComponentOptions={
                                { rowsPerPageText: "Số Bản Ghi / Trang" }
                            }
                        // paginationPerPage={pageSize}
                        // pagination
                        // paginationDefaultPage={currentPage + 1 + 0}
                        // paginationComponent={CustomPagination}
                        />
                    </Col>
                </Row>)
            }

        </Fragment >
    )
}

export default OrderManage
