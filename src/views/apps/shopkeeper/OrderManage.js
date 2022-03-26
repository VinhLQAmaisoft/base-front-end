// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { formatMoney, formatTimeStamp } from '@utils'

import { OrderData } from '@dummyData/'
import OrderCard from '@my-components/Cards/OrderCard'
// ** Table Data & Columns
import { data } from './data'
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
    Dropdown,
    Table,
    Collapse
} from 'reactstrap'


const OrderManage = () => {
    // ** States
    const [modal, setModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [filterStatus, setFilterStatus] = useState(-1)
    const [activeOrder, setActiveOrder] = useState([])
    const [displayOrder, setDisplayOrder] = useState([])
    const [sortOption, setSortOption] = useState({
        value: { createAt: 1 },
        label: "Mới nhất"
    })

    useEffect(() => {
        console.log("Source data: " + OrderData.length)
        setActiveOrder(OrderData.filter(order => ["created", "ready", "shipping"].includes(order.status)))
        console.log("Active Order Data: ", activeOrder.length);
        setDisplayOrder(getCurrentTableData(activeOrder, currentPage, pageSize))
        console.log("Table's Data: ", displayOrder.length);
    }, [])


    const sortOptions = [
        {
            value: { createAt: 1 },
            label: "Mới nhất"
        },
        {
            value: { createAt: 1 },
            label: "Comment tăng dần"
        },
        {
            value: { createAt: 1 },
            label: "Comment giảm dần"
        },
        {
            value: { createAt: 1 },
            label: "Order tăng dần"
        },
        {
            value: { createAt: 1 },
            label: "Order giảm dần"
        },
    ]

    const tableColumns = [
        {
            name: 'Khách Hàng',
            sortable: true,
            minWidth: '200px',
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
            minWidth: '100px',
            selector: row => row.status
        },
        {
            name: 'Giá Tiền',
            sortable: true,
            minWidth: '100px',
            selector: row => formatMoney(calTotal(row.product))
        }
    ]

    const pageSize = 2 + 1 + 0


    const getCurrentTableData = (source, currentPage, pageSize) => {
        let target = [...source]
        let start = currentPage * pageSize;
        let end = start + pageSize;
        return target.slice(start, end)
    }

    // ** Function to handle Modal toggle
    const handleModal = () => setModal(!modal)

    const handlePagination = page => {
        setCurrentPage(page.selected)
        setDisplayOrder(getCurrentTableData(activeOrder, currentPage, pageSize))
    }


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
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel=''
            nextLabel=''
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


    function renderOrderCard() {

        let result = [];
        for (let order of activeOrder) {
            // if ((filterStatus != -1 && order.status == filterStatus) || filterStatus == -1) {
            //if (order.content.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
            result.push(
                <Col md={4} sm={6} xs={12} key={order._id.$oid}>
                    <OrderCard order={order} />
                </Col>
            )
            // }
            // }
        }
        console.log(`Có ${result.length}`)
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

                            <Col sm={3} className="d-flex pt-1 pb-1 align-items-center" >
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
                {renderOrderCard()}
            </Row>
            <Row>
                <Col className='react-dataTable'>
                    {console.log("Final Table's Data: ", displayOrder.length)}
                    <DataTable
                        noHeader
                        pagination
                        selectableRows
                        columns={tableColumns}
                        paginationPerPage={pageSize}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={currentPage + 1 + 0}
                        paginationComponent={CustomPagination}
                        data={displayOrder}
                        selectableRowsComponent={BootstrapCheckbox}
                    />
                </Col>
            </Row>
            <AddNewModal open={modal} handleModal={handleModal} />
        </Fragment >
    )
}

export default OrderManage
