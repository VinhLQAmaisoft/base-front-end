import React, { useState, useEffect, Fragment } from 'react'
import { ProductServices, ShipperServices } from '@services'
import { formatMoney, formatTimeStamp } from '@utils'
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
            if (data.data.data) {
                setShippers(data.data.data)
                getCurrentObject(shippers)
            }
        })
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
        name: 'H??? T??n',
        sortable: true,
        minWidth: '100px',
        selector: row => row.fullname

    }, {
        name: 'S??T',
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
        name: 'Ng??y tham gia',
        sortable: true,
        minWidth: '50px',
        selector: row => row.jobs.createAt,
        format: row => formatTimeStamp(row.jobs.createAt)

    }, {
        name: 'H??nh ?????ng',
        sortable: false,
        minWidth: '200px',
        selector: row => {
            return (
                <Fragment>
                    <Button color="primary" size="sm" onClick={() => { selectShipper(row._id) }} className='me-1'>Chi Ti???t</Button>
                    <Button color="danger" size="sm" onClick={() => { deleteShipper(row._id) }} >X??a</Button>
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

    const deleteShipper = (id) => {
        ShipperServices.deleteShipper({ id }).then(data => {
            alert(data.data.message);
            let newShipper = shippers.find(shipper => shipper.id != id)
            setShippers(newShipper)
        })
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
            previousLabel='Tr?????c'
            nextLabel='Ti???p'
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
            {/* Danh S??ch Shipper */}
            <Row>
                <Col className='react-dataTable'>
                    {console.log("Final Table's Data: ", shippers.length)}
                    <Card className="p-1">
                        <CardTitle style={{ display: "flex", justifyContent: 'space-between' }}>
                            Danh S??ch Shipper C???a B???n
                            <Button color="success" onClick={() => { handleModal() }}>
                                Th??m Shipper
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
                            noDataComponent="B???n kh??ng c?? shipper n??o"
                        />
                    </Card>
                </Col>
            </Row>
            {/* Chi Ti???t Shipper */}
            <Row>
                <Col>
                    <Card className="p-1">
                        <CardTitle>
                            Chi Ti???t Shipper
                        </CardTitle>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Label className="text-primary">T??n Shipper</Label>
                                    <Input id="d-fullname" type='text' placeholder="M???i Ch???n Shipper" disabled={true} defaultValue={selectedShipper?.fullname} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Email</Label>
                                    <Input id="d-email" type='text' placeholder="M???i Ch???n Shipper" disabled={true} defaultValue={selectedShipper?.email} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">S??T</Label>
                                    <Input id="d-phone" type='text' placeholder="M???i Ch???n Shipper" disabled={true} defaultValue={selectedShipper?.phone} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Label className="text-primary">S??? ????n ???? Ship</Label>
                                    <Input id="d-order-count" type='text' placeholder="M???i Ch???n Shipper" disabled={true} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Thu Nh???p</Label>
                                    <Input id="d-salary" type='text' placeholder="M???i Ch???n Shipper" disabled={true} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Ng??y Tham Gia</Label>
                                    <Input id="d-jobs-createAt" type='text' placeholder="M???i Ch???n Shipper" disabled={true} defaultValue={selectedShipper?.jobs && formatTimeStamp(selectedShipper?.jobs.createAt)} />
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter >
                            <Button color='primary' disabled={selectedShipper == null} onClick={() => { deleteShipper() }}>X??a Shipper</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
            <AddShipperModal open={modal} handleModal={handleModal} />
        </Fragment>
    )
}
