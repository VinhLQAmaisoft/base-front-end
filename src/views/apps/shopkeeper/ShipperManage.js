import React, { useState, useEffect, Fragment } from 'react'
import { ProductServices, ShipperServices } from '@services'
import { formatMoney, formatTimeStamp, alert } from '@utils'
import { Badge, Button, Card, CardBody, CardFooter, CardTitle, Col, Input, Label, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import AddShipperModal from '@my-components/Modals/AddShipperModal'
// import { isNum } from 'react-toastify/dist/utils'


export default function ProductManage() {
    const [modal, setModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [shippers, setShippers] = useState([])
    const [activeProduct, setActiveProduct] = useState([]);
    const [selectedShipper, setSelectedShipper] = useState(null)
    const [tempProduct, setTempProduct] = useState(null)
    useEffect(() => {
        ShipperServices.getShipper().then(data => {
            if (data.data.data != null) {
                setShippers(data.data.data)
                getCurrentObject(shippers)
            }
        })
        let intervalTask = setInterval(() => ShipperServices.getShipper().then(data => {
            if (data.data.data) {
                setShippers(data.data.data)
                getCurrentObject(shippers)
            }
        }), 5000)
        return () => window.clearInterval(intervalTask)
    }, [])

    useEffect(() => {
        if (selectedShipper) {
            let fullname = document.getElementById("d-fullname");
            let email = document.getElementById("d-email");
            let phone = document.getElementById("d-phone");
            let createAt = document.getElementById("d-jobs-createAt");
            let orderCount = document.getElementById("d-order-count");
            let salary = document.getElementById("d-salary");
            fullname.value = selectedShipper.fullname
            email.value = selectedShipper.email
            phone.value = selectedShipper.phone
            createAt.value = formatTimeStamp(selectedShipper.jobs.createAt)
            ShipperServices.getShipperDetail({ id: selectedShipper._id }).then((data) => {
                if (data.data.data) {
                    orderCount.value = data.data.data.orderCount;
                    salary.value = data.data.data.totalSalary;
                }
            })
        }
    }, [selectedShipper])
    const pageSize = 10;
    const tableColumns = [{
        name: 'Họ Tên',
        sortable: true,
        minWidth: '100px',
        selector: row => row.fullname

    }, {
        name: 'SĐT',
        sortable: true,
        minWidth: '50px',
        selector: row => row.phone,
        // format: row => formatMoney(row.price)

    }, {
        name: 'Email',
        sortable: true,
        minWidth: '200px',
        selector: row => row.email,
        // format: row => renderKeywords(row.keyword)

    }, {
        name: 'Ngày tham gia',
        sortable: true,
        minWidth: '50px',
        selector: row => row.createAt,
        format: row => row.createAt != 'Chưa đồng ý' ? formatTimeStamp(row.jobs.createAt) : row.createAt

    }, {
        name: 'Hành Động',
        sortable: false,
        minWidth: '200px',
        selector: row => {
            return (
                <Fragment>
                    {row.createAt != 'Chưa đồng ý' && <Button color="primary" size="sm" onClick={() => { selectShipper(row._id) }} className='me-1'>Chi Tiết</Button>}
                </Fragment>
            )
        }
    }]

    const getCurrentObject = (source) => {
        let target = [...source]
        let start = currentPage * pageSize;
        let end = start + pageSize;
        return target.slice(start, end)
    }

    const handleModal = () => {
        setModal(!modal)
    }

    const selectShipper = (id) => {
        let selected = shippers.filter(p => p._id === id)
        if (selected) {
            let prd = JSON.stringify(selected[0])
            setSelectedShipper(JSON.parse(prd))

        }
    }

    const deleteShipper = (shipper) => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'))
            if (userData) {
                ShipperServices.updateJob({
                    shipper,
                    status: 'reject',

                }).then(data => {
                    alert.success(data.data.message);

                })
            } else {
                alert.error("Đăng nhập hết hạn")
            }
        } catch (error) {
            console.log(error)
            alert.error("Đăng nhập hết hạn")
            return
        }
    }

    const deleteKeyword = (keyword) => {
        let temp = { ...selectedShipper };
        let index = temp.keyword.indexOf(keyword)
        if (index > -1) {
            temp.keyword.splice(temp.keyword.indexOf(keyword), 1)
            setSelectedShipper({ ...temp })
        }
    }

    const handlePagination = page => {
        setCurrentPage(page.selected)
        setActiveProduct(getCurrentObject(shippers))
    }


    const CustomPagination = () => (
        <ReactPaginate
            previousLabel='Trước'
            nextLabel='Tiếp'
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={Math.ceil(shippers.length / pageSize)}
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

    const renderKeywords = (listKeywords) => {
        return listKeywords.map(keyword => (<Badge className='me-1' color='info' keyword={keyword}>{keyword}</Badge>))
    }
    const renderDetailKeywords = (listKeywords) => {
        if (listKeywords) {
            return listKeywords.map(keyword => (
                <Badge
                    outline={true}
                    style={{ padding: '5px' }}
                    className='me-1'
                    color='info'
                    key={`detail - ${keyword}`}
                >
                    {keyword}
                    <Button close
                        size="sm"
                        onClick={() => { deleteKeyword(keyword) }} />
                </Badge>
            ))
        }
    }

    //tableColumns, pageSize, currentPage, handlePagination, data
    return (
        <Fragment>
            {/* Danh Sách Shipper */}
            <Row>
                <Col className='react-dataTable'>
                    {console.log("Final Table's Data: ", shippers.length)}
                    <Card className="p-1">
                        <CardTitle style={{ display: "flex", justifyContent: 'space-between' }}>
                            Danh Sách Shipper Của Bạn
                            <Button color="primary" onClick={() => { handleModal() }}>
                                Thêm Shipper
                            </Button>
                        </CardTitle>
                        <DataTable
                            noHeader
                            pagination
                            columns={tableColumns}
                            paginationPerPage={pageSize}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            paginationDefaultPage={currentPage + 1 + 0}
                            paginationComponent={CustomPagination}
                            data={shippers}
                            noDataComponent="Bạn không có shipper nào"
                        />
                    </Card>
                </Col>
            </Row>
            {/* Chi Tiết Shipper */}
            <Row>
                <Col>
                    <Card className="p-1">
                        <CardTitle>
                            Chi Tiết Shipper
                        </CardTitle>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Label className="text-primary">Tên Shipper</Label>
                                    <Input id="d-fullname" type='text' placeholder="Mời Chọn Shipper" disabled={true} defaultValue={selectedShipper?.fullname} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Email</Label>
                                    <Input id="d-email" type='text' placeholder="Mời Chọn Shipper" disabled={true} defaultValue={selectedShipper?.email} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">SĐT</Label>
                                    <Input id="d-phone" type='text' placeholder="Mời Chọn Shipper" disabled={true} defaultValue={selectedShipper?.phone} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Label className="text-primary">Số Đơn Đã Ship</Label>
                                    <Input id="d-order-count" type='text' placeholder="Mời Chọn Shipper" disabled={true} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Thu Nhập</Label>
                                    <Input id="d-salary" type='text' placeholder="Mời Chọn Shipper" disabled={true} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Ngày Tham Gia</Label>
                                    <Input id="d-jobs-createAt" type='text' placeholder="Mời Chọn Shipper" disabled={true} defaultValue={selectedShipper?.jobs && formatTimeStamp(selectedShipper?.jobs.createAt)} />
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter >
                            <Button color='primary' disabled={selectedShipper == null} onClick={() => { deleteShipper(selectedShipper?.username) }}>Xóa Shipper</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
            <AddShipperModal open={modal} handleModal={handleModal} />
        </Fragment>
    )
}
