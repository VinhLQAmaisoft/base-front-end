import React, { useState, useEffect, Fragment } from 'react'
import { ProductServices } from '@services'
import { formatMoney, formatTimeStamp } from '@utils'
import { Badge, Button, Card, CardBody, CardFooter, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown } from 'reactstrap'
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

    const [filterStatus, setFilterStatus] = useState(-1)
    const [sortOption, setSortOption] = useState({
        value: { createAt: 1 },
        label: "Mới nhất"
    })
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])


    useEffect(() => {
        ProductServices.getProduct().then(data => {
            if (data.data.data) {
                setProduct(data.data.data)
                getCurrentObject(product)
            }
        })
    }, [])

    // Update Selected Product Data
    useEffect(() => {
        let title = document.getElementById("d-title");
        let price = document.getElementById("d-price");
        let createAt = document.getElementById("d-createAt");
        console.log("Selected Product: ", selectedProduct)
        if (selectedProduct) {
            title.value = selectedProduct?.title
            price.value = selectedProduct?.price
            createAt.value = formatTimeStamp(selectedProduct?.createAt)
        } else {
            title.value = ""
            price.value = ""
            createAt.value = ""
        }
    }, [selectedProduct])

    const sortOptions = [
        {
            value: { createAt: 1 },
            label: "Mới nhất"
        },
        {
            value: { createAt: -1 },
            label: "Cũ nhất"
        }, {
            value: { price: 1 },
            label: "Rẻ nhất"
        }, {
            value: { price: -1 },
            label: "Đắt nhất"
        }, {
            value: { createAt: 1 },
            label: "Mới nhất"
        },
    ]
    const pageSize = 10;
    const tableColumns = [{
        name: 'Sản Phẩm',
        sortable: true,
        maxWidth: '200px',
        selector: row => row.title

    }, {
        name: 'Giá Tiền',
        sortable: true,
        maxWidth: '150px',
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

    // ** Function to handle filter
    const handleFilter = e => {

        const value = e.target.value
        let updatedData = []
        setSearchValue(value)
        if (value.length) {
            updatedData = product.filter(product => {
                const startsWith =
                    product.title.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    product.title.toLowerCase().includes(value.toLowerCase())


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


    const selectProduct = (id) => {
        let selected = product.filter(p => p._id === id)
        if (selected) {
            let prd = JSON.parse(JSON.stringify(selected[0]));
            setSelectedProduct(prd)

            // renderKeywords(selected[0].keyword)
        }
    }

    const updateProduct = () => {
        let title = document.getElementById("d-title").value;
        let price = document.getElementById("d-price").value;
        let oldKeyWord = [...selectedProduct.keyword];
        let newKeyWord = document.getElementById("d-newKeyWord").value;
        newKeyWord = newKeyWord != '' ? newKeyWord.split(',') : []
        newKeyWord = newKeyWord.length > 0 ? newKeyWord.filter(keyword => keyword.trim()) : [];

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
            if (selectedProduct._id == id) {

                setSelectedProduct(null)
            }
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
                    style={{ padding: '5px',margin:'5px' }}
                    // className='m-1'
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
    //tableColumns, pageSize, currentPage, handlePagination, data
    return (
        <Fragment>
            {/* BỘ LỌC */}

            {/* Bảng Sản Phẩm */}
            <Row>
                <Col className='react-dataTable'>
                    {console.log("Final Table's Data: ", product.length)}
                    <Card className="p-1">
                        <CardTitle>
                            <Row>
                                <Col>
                                    Các Sản Phẩm
                                </Col>
                                <Col className='d-flex align-items-center justify-content-end' sm={6}>
                                    <Label style={{ fontSize: '15px', marginRight: '10px' }} className='me-1' for='search-input'>
                                        Tìm kiếm
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

                        </CardTitle>
                        <DataTable
                            noHeader
                            pagination
                            columns={tableColumns}
                            // paginationPerPage={pageSize}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            // paginationDefaultPage={currentPage + 1 + 0}
                            // paginationComponent={CustomPagination}
                            data={searchValue != "" ? filteredData : product}

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
                            <Button color='success' onClick={() => { addProduct() }}>Thêm Sản Phẩm</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
