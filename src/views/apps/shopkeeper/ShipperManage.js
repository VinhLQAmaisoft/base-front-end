import React, { useState, useEffect, Fragment } from 'react'
import CustomTable from '@my-components/DataTable/CustomTable'
import { ProductServices } from '@services'
import { formatMoney, formatTimeStamp } from '@utils'
import { Badge, Button, Card, CardBody, CardFooter, CardTitle, Col, Input, Label, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
// import { isNum } from 'react-toastify/dist/utils'
export default function ProductManage() {
    const [currentPage, setCurrentPage] = useState(0)
    const [product, setProduct] = useState([])
    const [activeProduct, setActiveProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [tempProduct, setTempProduct] = useState(null)
    useEffect(() => {
        ProductServices.getProduct().then(data => {
            if (data.data.data) {
                setProduct(data.data.data)
                getCurrentObject(product)
            }
        })
    }, [])
    const pageSize = 10;
    const tableColumns = [{
        name: 'Họ Tên',
        sortable: true,
        minWidth: '100px',
        selector: row => row.title

    }, {
        name: 'SĐT',
        sortable: true,
        minWidth: '50px',
        selector: row => row.price,
        format: row => formatMoney(row.price)

    }, {
        name: 'Email',
        sortable: true,
        minWidth: '200px',
        selector: row => row.keyword.length,
        format: row => renderKeywords(row.keyword)

    }, {
        name: 'Tổng số đơn',
        sortable: true,
        minWidth: '50px',
        selector: row => row.keyword.length,
        // format: row => renderKeywords(row.keyword)

    }, {
        name: 'Hành Động',
        sortable: false,
        minWidth: '200px',
        selector: row => {
            return (
                <Fragment>
                    <Button color="primary" size="sm" onClick={() => { selectProduct(row._id) }} className='me-1'>Chi Tiết</Button>
                    <Button color="danger" size="sm" onClick={() => { deleteProduct(row._id) }} >Xóa</Button>
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



    const selectProduct = (id) => {
        let selected = product.filter(p => p._id === id)
        if (selected) {
            let prd = JSON.stringify(selected[0])
            setSelectedProduct(JSON.parse(prd))
            let title = document.getElementById("d-title");
            let price = document.getElementById("d-price");
            let createAt = document.getElementById("d-createAt");
            title.value = selectedProduct.title
            price.value = selectedProduct.price
            createAt.value = formatTimeStamp(selectedProduct.createAt)
            // renderKeywords(selected[0].keyword)
        }
    }

    const updateProduct = () => {
        console.log("Sản phẩm cũ: ", selectedProduct)
        let title = document.getElementById("d-title").value;
        let price = document.getElementById("d-price").value;
        console.log("New Title: " + title)
        console.log(`New Price ${price} -> Invalid: ` + /\D/g.test(price))

        let oldKeyWord = [...selectedProduct.keyword];
        console.log("Old Keyword: ", oldKeyWord)
        let newKeyWord = document.getElementById("d-newKeyWord").value;
        newKeyWord = newKeyWord != '' ? newKeyWord.split(',') : []
        newKeyWord = newKeyWord.length > 0 ? newKeyWord.filter(keyword => keyword.trim()) : [];
        console.log("New Keyword: ", newKeyWord)

        if (newKeyWord && newKeyWord.length > 0) {
            for (const keyword of newKeyWord) {
                if (oldKeyWord.indexOf(keyword) > -1)
                    return alert(`Trùng từ khóa "${keyword}"`)
            }
        }
        if (title == "" || /\D/.test(price)) {
            return alert("Tên hoặc giá không phù hợp");
        }
        let newProduct = JSON.parse(JSON.stringify(selectedProduct));
        newProduct.title = title;
        newProduct.price = parseFloat(price);
        newProduct.keyword = [...oldKeyWord, ...newKeyWord];
        ProductServices.updateProduct(newProduct).then(data => {
            alert(data.data.message);
            ProductServices.getProduct().then(data => {
                if (data.data.data) {
                    setProduct(data.data.data)
                    getCurrentObject(product)
                }
            })
        })

    }

    const addProduct = () => {
        let title = document.getElementById("a-title").value;
        let price = document.getElementById("a-price").value;
        if (!/\D/.test(price) && !title == "") {
            ProductServices.createProduct({ title, price }).then(data => {
                alert(data.data.message);
                setProduct([...product, data.data.data])
                getCurrentObject(product)

            })
        } else alert("Giá tiền hoặc tên sản phẩm không phù hợp")
    }

    const deleteProduct = (id) => {
        ProductServices.deleteProduct({ _id: id }).then(data => {
            alert(data.data.message);
            ProductServices.getProduct().then(data => {
                if (data.data.data) {
                    setProduct(data.data.data)
                    getCurrentObject(product)

                }
            })
        })
    }

    const deleteKeyword = (keyword) => {
        let temp = { ...selectedProduct };
        let index = temp.keyword.indexOf(keyword)
        if (index > -1) {
            temp.keyword.splice(temp.keyword.indexOf(keyword), 1)
            setSelectedProduct({ ...temp })
        }
    }

    const handlePagination = page => {
        setCurrentPage(page.selected)
        setActiveProduct(getCurrentObject(product))
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
            {/* Bảng Sản Phẩm */}
            <Row>
                <Col className='react-dataTable'>
                    {console.log("Final Table's Data: ", product.length)}
                    <Card className="p-1">
                        <CardTitle style={{ display: "flex", justifyContent: 'space-between' }}>
                            Danh Sách Shipper Của Bạn
                            <Button color="success" onClick={() => { addProduct() }}>
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
                            data={product}

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
                                    <Label className="text-primary mt-1">Thêm Từ Khóa</Label>
                                    <Input id="d-newKeyWord" type='text' placeholder="Từ khóa 1, Từ khóa 2, từ khóa 3,..." />
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter >
                            <Button color='primary' onClick={() => { updateProduct() }}>Cập Nhật</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}
