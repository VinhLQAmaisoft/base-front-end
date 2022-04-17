import React, { useState, useEffect, Fragment } from 'react'
import { ShipperServices, OrderServices } from '@services'
import { formatMoney, formatTimeStamp } from '@utils'
import { Badge, Button, Card, CardBody, CardFooter, CardTitle, CardSubtitle, CardHeader, Col, Input, Label, Row } from 'reactstrap'
import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
// import { isNum } from 'react-toastify/dist/utils'
export default function ProductManage() {
    const [modal, setModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [shippers, setShippers] = useState([])
    const [selectedShipper, setSelectedShipper] = useState(null)
    const [productFigure, setProductFigure] = useState([])
    const [orderFigure, setOrderFigure] = useState([])
    const [revenueFigure, setRevenueFigure] = useState([])
    const [totalOrder, setTotalOrder] = useState(0)
    const [totalProduct, setTotalProduct] = useState(0)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [timeRange, setTimeRange] = useState([new Date(), new Date()])
    const [xAxis, setXAxis] = useState([])
    const direction = 'rtl'

    useEffect(() => {
        OrderServices.getOrder('').then(data => {
            let OrderData = []
            if (data.data.data) {
                OrderData = data.data.data
                setOrders(OrderData)
                let newProducts = []
                for (const order of OrderData) {
                    console.log("Đơn hàng : ", order.product.length, " - ", order.status)
                    if (
                        order.status == 'done'
                    ) {
                        for (const data of order.product) {
                            console.log("Sản phẩm : ", data)
                            let isExist = newProducts.filter(prd => prd.title === data.product.title && prd.price === data.product.price)
                            if (isExist.length > 0) {
                                isExist[0].saleCount += parseInt(data.quantity)
                            } else {
                                newProducts.push({ saleCount: parseInt(data.quantity), ...data.product })
                            }
                        }
                    }
                }
                console.log("Số sản phẩm tìm thấy: ", newProducts.length)
                setProducts(newProducts)
            }
            ShipperServices.getShipper().then(data => {
                if (data.data.data) {
                    for (let shipper of data.data.data) {
                        let count = 0;
                        let salary = 0;
                        for (const order of OrderData) {
                            if (order.shipper == shipper.username) {
                                count++;
                                salary += order.shipCost
                            }
                        }
                        shipper.orderCount = count;
                        shipper.salary = salary;
                    }
                    setShippers(data.data.data)
                }
            })
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
    const shipperTableColumns = [{
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
        selector: row => row.jobs.createAt,
        format: row => formatTimeStamp(row.jobs.createAt)

    }, {
        name: 'Số đơn đã ship',
        sortable: false,
        minWidth: '200px',
        selector: row => row.orderCount
    }, {
        name: 'Lương',
        sortable: false,
        minWidth: '200px',
        selector: row => row.salary,
        format: row => formatMoney(row.salary)
    }
    ]
    const productTableColumns = [{
        name: 'Sản phẩm',
        sortable: true,
        minWidth: '100px',
        selector: row => row.title

    }, {
        name: 'Giá tiền',
        sortable: true,
        minWidth: '50px',
        selector: row => row.price,
        format: row => formatMoney(row.price)

    }, {
        name: 'Số lượng bán',
        sortable: true,
        minWidth: '200px',
        selector: row => row.saleCount,
        // format: row => renderKeywords(row.keyword)

    }
    ]

    useEffect(() => {
        console.log("Time Range 1: ", timeRange)
        setXAxis(getDates(timeRange[0].getTime(), timeRange[1].getTime()))
        getFigure(timeRange[0].getTime(), timeRange[1].getTime())
        console.log("Order Figure: ", orderFigure)
        console.log("Product Figure: ", productFigure)
        console.log("Revenue Figure: ", revenueFigure)
        getShipperFigure()
        getProductFigure()
    }, [timeRange])
    // ** Chart Options
    const areaColors = {
        series3: '#a4f8cd95',
        series2: '#60f2ca95',
        series1: '#2bdac795'
    }

    // **Chart Option
    const options1 = {
        chart: {
            parentHeightOffset: 0,
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: false,
            curve: 'straight'
        },
        legend: {
            position: 'top',
            horizontalAlign: 'start',
            onItemClick: {
                toggleDataSeries: true
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        colors: [areaColors.series3, areaColors.series2, areaColors.series1],
        xaxis: {
            categories: xAxis,
            title: {
                text: "Thống Kê Doanh Số Bán Hàng",
                style: {
                    color: undefined,
                    fontSize: '15px',
                    fontFamily: ' Arial',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-title',
                },
            }
        },
        zoom: {
            enabled: false,
        },
        selection: {
            enabled: false,
        },
        fill: {
            opacity: 1,
            type: 'solid'
        },
        tooltip: {
            shared: false
        },
        yaxis: {
            opposite: direction === 'rtl'
        }
    }
    const options2 = {
        chart: {
            parentHeightOffset: 0,
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: false,
            curve: 'straight'
        },
        legend: {
            position: 'top',
            horizontalAlign: 'start',
            onItemClick: {
                toggleDataSeries: false
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        colors: [areaColors.series1],
        xaxis: {
            categories: xAxis,
            title: {
                text: "Thống Kê Doanh Thu (vnđ)",
                style: {
                    color: undefined,
                    fontSize: '15px',
                    fontFamily: ' Arial',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-title',
                },
            }
        },
        zoom: {
            enabled: false,
        },
        selection: {
            enabled: false,
        },
        fill: {
            opacity: 1,
            type: 'solid'
        },
        tooltip: {
            shared: false
        },
        yaxis: {
            opposite: direction === 'rtl'
        }
    }

    // ** Chart Series
    const series1 = [
        {
            name: 'Sản Phẩm Đã Bán',
            data: productFigure
        },
        {
            name: 'Số Đơn Đã Nhận',
            data: orderFigure
        }
    ]
    const series2 = [
        {
            name: 'Doanh Thu',
            data: revenueFigure
        }
    ]

    const getCurrentObject = (source) => {
        let target = [...source]
        let start = currentPage * pageSize;
        let end = start + pageSize;
        return target.slice(start, end)
    }

    const getShipperFigure = () => {
        if (shippers) {
            let newShippers = JSON.parse(JSON.stringify(shippers))
            for (let shipper of newShippers) {
                let count = 0;
                let salary = 0;
                for (const order of orders) {
                    if (order.shipper == shipper.username
                        && order.status == 'done'
                        && order.createAt >= timeRange[0]
                        && order.createAt <= timeRange[1]
                    ) {
                        count++;
                        salary += order.shipCost
                    }
                }
                shipper.orderCount = count;
                shipper.salary = salary;
            }
            setShippers(newShippers)
        }
    }

    const getProductFigure = () => {
        if (orders) {
            let newProducts = []
            for (const order of orders) {
                if (
                    order.status == 'done'
                    && order.createAt >= timeRange[0]
                    && order.createAt <= timeRange[1]
                ) {
                    for (const data of order.product) {
                        let isExist = newProducts.filter(prd => prd.title === data.product.title && prd.price === data.product.price)
                        if (isExist.length > 0) {
                            isExist[0].saleCount += parseInt(data.quantity)
                        } else {
                            newProducts.push({ saleCount: parseInt(data.quantity), ...data.product })
                        }
                    }
                }
            }
            setProducts(newProducts)
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
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }


    function getDates(startTimeStamp, stopTimeStamp) {
        var dateArray = [];
        // Phân tích theo ngày
        if (startTimeStamp !== stopTimeStamp) {
            console.log("Case 1: " + startTimeStamp + " - " + stopTimeStamp)
            var currentDate = new Date(startTimeStamp);
            var stopDate = new Date(stopTimeStamp)
            while (currentDate <= stopDate) {
                dateArray.push(`${currentDate.getDate()}/${currentDate.getMonth() + 1}`);
                currentDate = currentDate.addDays(1);
            }
        } else {//phân tích theo giờ
            if (startTimeStamp == stopTimeStamp) {
                console.log("Case 2")
                var currentDate = new Date(startTimeStamp);
                var stopDate = new Date(stopTimeStamp)
                currentDate.setHours(0)
                currentDate.setMinutes(0)
                currentDate.setSeconds(0)
                stopDate.setHours(23)
                stopDate.setMinutes(59)
                stopDate.setSeconds(59)
                while (currentDate <= stopDate) {
                    dateArray.push(`${currentDate.getHours()}:${currentDate.getMinutes()}0`);
                    currentDate.setHours(currentDate.getHours() + 1)
                }
            }

        }
        console.log("Date Arr: ", dateArray);

        return dateArray;
    }

    function getFigure(startTimeStamp, stopTimeStamp) {
        let orderData = [];
        let productData = [];
        let revenueData = [];
        let totalOrderData = 0
        let totalProductData = 0
        let totalRevenueData = 0
        let aDay = 24 * 60 * 60 * 1000;
        let anHour = 60 * 60 * 1000
        // Phân tích theo ngày
        if (startTimeStamp !== stopTimeStamp) {
            let currentTime = startTimeStamp;
            console.log("New Day: ", startTimeStamp, stopTimeStamp)
            while (currentTime <= stopTimeStamp + aDay) {
                orderData.push(countOrderByDate(currentTime, currentTime + aDay))
                productData.push(countProductByDate(currentTime, currentTime + aDay))
                revenueData.push(getRevenueByDate(currentTime, currentTime + aDay))
                currentTime = currentTime + aDay + 1
            }
        } else {//Phân tích theo giờ
            let currentTime = startTimeStamp;
            while (currentTime <= stopTimeStamp + aDay) {
                orderData.push(countOrderByDate(currentTime, currentTime + anHour))
                totalOrderData += countOrderByDate(currentTime, currentTime + aDay)
                productData.push(countProductByDate(currentTime, currentTime + anHour))
                revenueData.push(getRevenueByDate(currentTime, currentTime + anHour))
                currentTime = currentTime + anHour + 1
            }
        }
        setOrderFigure(orderData)
        setProductFigure(productData)
        setRevenueFigure(revenueData)
        orderData.forEach(data => totalOrderData += data)
        productData.forEach(data => totalProductData += data)
        revenueData.forEach(data => totalRevenueData += data)
        setTotalOrder(totalOrderData)
        setTotalProduct(totalProductData)
        setTotalRevenue(totalRevenueData)

    }

    function countOrderByDate(start, stop) {
        let validOrder = orders.filter(order => order.createAt >= start && order.createAt <= stop);
        // Fake Data
        return Math.floor(Math.random() * 100 + 5)
        return parseInt(validOrder.length)
    }

    function countProductByDate(start, stop) {
        let count = 0;
        orders.map(order => {
            if (order.createAt >= start && order.createAt <= stop) {
                order.product.map(data => {
                    count += parseInt(data.quantity)
                })
            }
        });
        //   Fake Data
        count = Math.floor(Math.random() * 100 + 5)
        return count
    }

    function getRevenueByDate(start, stop) {
        let total = 0;
        orders.map(order => {
            if (order.createAt >= start && order.createAt <= stop) {
                order.product.map(data => {
                    total += parseInt(data.quantity) * data.product.price
                })
            }
        });
        //   Fake Data
        total = Math.floor(Math.random() * 1000000 + 100000)
        return total
    }

    return (
        <Fragment>

            {/* Thống Kê Doanh Thu*/}
            <Row>
                <Col>
                    <Card>
                        <CardHeader className='d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start'>
                            <Col sm={9}>
                                <CardTitle className='mb-75' tag='h4'>
                                    Thống kê doanh thu
                                </CardTitle>
                                <CardSubtitle className='text-muted'>Thống kê Doanh Thu Bán Hàng</CardSubtitle>
                            </Col>
                            <Col sm={3} className='d-flex align-items-center mt-md-0 mt-1'>
                                <Calendar size={17} />
                                <Flatpickr
                                    //   value={`${timeRange[0]}, ${timeRange[1]}`}
                                    className='form-control flat-picker bg-transparent border-0 shadow-none'
                                    options={{
                                        mode: 'range',
                                        // eslint-disable-next-line no-mixed-operators
                                        defaultDate: [new Date(), new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)]
                                    }}
                                    onChange={([from, to]) => {
                                        if (!to) {
                                            to = from
                                        }
                                        console.log("From Time: ", new Date(from).getTime())
                                        console.log("To Time: ", new Date(to).getTime())
                                        setTimeRange([from, to])
                                    }}
                                />
                            </Col>
                        </CardHeader>
                        <CardBody>
                            <Chart options={options1} series={series1} type='area' height={400} />
                            <Chart options={options2} series={series2} type='area' height={400} />
                            <Row>
                                <Col sm={12}>Tổng Lợi Nhuận: <b>{formatMoney(totalRevenue)}</b> </Col>
                                <Col sm={12}>Tổng Số Đơn Hàng Đã Nhận:<b> {totalOrder} đơn</b></Col>
                                <Col sm={12}>Tổng Số Sản Phẩm Đã Bán:<b> {totalProduct} sản phẩm</b></Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {/* Thống Kê Shipper */}
            <Row>
                <Col className='react-dataTable'>
                    <Card className="p-1">
                        <CardTitle style={{ display: "flex", justifyContent: 'space-between' }}>
                            Thông tin shipper
                        </CardTitle>
                        <DataTable
                            noHeader
                            pagination
                            columns={shipperTableColumns}
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
            {/* Thống Kê Sản Phẩm */}
            <Row>
                <Col className='react-dataTable'>
                    <Card className="p-1">
                        <CardTitle style={{ display: "flex", justifyContent: 'space-between' }}>
                            Thông tin Sản phẩm
                        </CardTitle>
                        <DataTable
                            noHeader
                            pagination
                            columns={productTableColumns}
                            paginationPerPage={pageSize}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            paginationDefaultPage={currentPage + 1 + 0}
                            paginationComponent={CustomPagination}
                            data={products}
                        // noDataComponent="Bạn không có shipper nào"
                        />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
