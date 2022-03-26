import React, { useState, useEffect, Fragment } from 'react'
import CustomTable from '@my-components/DataTable/CustomTable'
import { ProductData } from '@dummyData'
import { formatMoney, formatTimeStamp } from '@utils'
import { Badge, Button, Card, CardBody, CardFooter, CardTitle, Col, Input, Label, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
export default function ProductManage() {
    const [currentPage, setCurrentPage] = useState(0)
    const [product, setProduct] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    useEffect(() => {
        setProduct(ProductData)
    }, [])
    const pageSize = 10;
    const tableColumns = [{
        name: 'Sản Phẩm',
        sortable: true,
        minWidth: '200px',
        selector: row => row.title

    }, {
        name: 'Giá Tiền',
        sortable: true,
        minWidth: '200px',
        selector: row => row.price,
        format: row => formatMoney(row.price)

    }, {
        name: 'Từ Khóa',
        sortable: true,
        minWidth: '200px',
        selector: row => row.keyword.length,
        format: row => renderKeywords(row.keyword)

    }, {
        name: 'Hành Động',
        sortable: false,
        minWidth: '200px',
        selector: row => {
            return (
                <Fragment>
                    <Button color="primary" size="sm" onClick={() => { selectProduct(row._id.$oid) }} className='me-1'>Chi Tiết</Button>
                    <Button color="danger" size="sm" onClick={() => { deleteProduct(row._id.$oid) }} >Xóa</Button>
                </Fragment>
            )
        }
    }]

    const selectProduct = (id) => {
        let selected = product.filter(p => p._id.$oid === id)
        if (selected) {
            setSelectedProduct(Object.assign(selected[0]))
            let title = document.getElementById("d-title");
            let price = document.getElementById("d-price");
            let createAt = document.getElementById("d-createAt");
            title.value = selected[0].title
            price.value = selected[0].price
            createAt.value = formatTimeStamp(selected[0].createAt)
            // renderKeywords(selected[0].keyword)
        }
    }

    const deleteProduct = (id) => {
        alert('Chọn Sản Phẩm:' + id)
    }
    const deleteKeyword = (keyword) => {
        let temp = { ...selectedProduct };
        let index = temp.keyword.indexOf(keyword)
        if (index > -1) {
            temp.keyword.splice(temp.keyword.indexOf(keyword), 1)
            setSelectedProduct(temp)
        }
    }

    const CustomPagination = () => (
        <ReactPaginate
            previousLabel='Trước'
            nextLabel='Tiếp'
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={Math.ceil(product.length / pageSize)}
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
        return listKeywords.map(keyword => (<Badge className='me-1' color='info'>{keyword}</Badge>))
    }
    const renderDetailKeywords = (listKeywords) => {
        if (listKeywords) {
            return listKeywords.map(keyword => (
                <Badge outline={true} style={{ padding: '5px' }} className='me-1' color='info'>
                    {keyword}
                    <Button size="sm" outline={true}
                        style={{ marginLeft: '5px', backgroundColor: 'red', color: 'white' }}
                        className=" p-0"
                        onClick={() => { deleteKeyword(keyword) }}>
                        X
                    </Button>
                </Badge>
            ))
        }
    }

    //tableColumns, pageSize, currentPage, handlePagination, data
    return (
        <Fragment>
            {/* Bảng Sản Phẩm */}
            <Row>
                <Col className='react-dataTable'>
                    {console.log("Final Table's Data: ", ProductData.length)}
                    <Card className="p-1">
                        <CardTitle>Các Sản Phẩm</CardTitle>
                        <DataTable
                            noHeader
                            pagination

                            columns={tableColumns}
                            paginationPerPage={pageSize}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            paginationDefaultPage={currentPage + 1 + 0}
                            paginationComponent={CustomPagination}
                            data={product}

                        />
                    </Card>
                </Col>
            </Row>
            {/* Chi Tiết Sản Phẩm */}
            <Row>
                <Col>
                    <Card className="p-1">
                        <CardTitle>Chi Tiết Sản Phẩm</CardTitle>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Label className="text-primary">Tên Sản Phẩm</Label>
                                    <Input id="d-title" type='text' placeholder="Mời Chọn Sản Phẩm" disabled={selectedProduct == null} defaultValue={selectedProduct?.title} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Giá</Label>
                                    <Input id="d-price" type='text' placeholder="Mời Chọn Sản Phẩm" disabled={selectedProduct == null} defaultValue={selectedProduct?.price} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Ngày tạo</Label>
                                    <Input id="d-createAt" type='text' placeholder="Mời Chọn Sản Phẩm" disabled={true} plaintext={selectedProduct?.createAt && formatTimeStamp(selectedProduct?.createAt)} />
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col>
                                    <Label className="text-primary">Từ Khóa</Label>
                                    <div id="d-keyword">
                                        {renderDetailKeywords(selectedProduct?.keyword)}
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter >
                            <Button color='primary' onClick={() => { }}>Cập Nhật</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
            {/* Thêm Sản Phẩm */}
            <Row>
                <Col>
                    <Card className="p-1">
                        <CardTitle>Thêm Sản Phẩm</CardTitle>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Label className="text-primary">Tên Sản Phẩm</Label>
                                    <Input id="a-title" type='text' placeholder="Mời Chọn Sản Phẩm" defaultValue={selectedProduct?.title} />
                                </Col>
                                <Col>
                                    <Label className="text-primary">Giá</Label>
                                    <Input id="a-price" type='text' placeholder="Mời Chọn Sản Phẩm" defaultValue={selectedProduct?.price} />
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter >
                            <Button color='success' onClick={() => { }}>Thêm Sản Phẩm</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
