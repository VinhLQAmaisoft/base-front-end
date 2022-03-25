// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import GroupIcon from '@src/assets/custom-icon/group.png'
import { OrderData } from '@dummyData/'
import OrderCard from '@my-components/Cards/OrderCard'
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
    const [doneOrder, setDoneOrder] = useState([])
    const [sortOption, setSortOption] = useState({
        value: { createAt: 1 },
        label: "Mới nhất"
    })
    // ** Function to handle Modal toggle
    const handleModal = () => setModal(!modal)

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

    useEffect(() => {
        setActiveOrder(OrderData.filter(order => ["created", "ready", "shipping"].includes(order.status)))

    }, [])

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




    function renderOrderCard() {
        let result = [];
        for (let order of activeOrder) {
            // if ((filterStatus != -1 && order.status == filterStatus) || filterStatus == -1) {
           //if (order.content.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                result.push(
                    <Col md={4} sm={6} xs={12}>
                        <OrderCard order={order} />
                    </Col>
                )
           // }
            // }
        }
        return result
    }

    function renderSortOption(options) {
        let result = [];
        for (let option of options) {
            result.push(
                <DropdownItem key={option.value} className='w-100' onClick={() => setSortOption(option)}>
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
            <style>

            </style>
            <AddNewModal open={modal} handleModal={handleModal} />
        </Fragment >
    )
}

export default OrderManage