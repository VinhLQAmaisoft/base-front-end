
import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'
import React, { useState, useEffect, Fragment } from 'react'
import { Badge, Button, Card, CardBody, CardFooter, CardTitle, CardSubtitle, CardHeader, Col, Input, Label, Row } from 'reactstrap'
import { formatMoney } from '@utils'

const RevenueChart = ({ direction, orders, products, shippers }) => {

    const [productFigure, setProductFigure] = useState([])
    const [orderFigure, setOrderFigure] = useState([])
    const [revenueFigure, setRevenueFigure] = useState([])
    const [totalOrder, setTotalOrder] = useState(0)
    const [totalProduct, setTotalProduct] = useState(0)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [timeRange, setTimeRange] = useState([new Date(), new Date()])
    const [xAxis, setXAxis] = useState([])
    const [yAxis, setYAxis] = useState([])
    useEffect(() => {
        // ProductServices.getProduct().then(data => {
        //     if (data.data.data) {
        //         setProducts(data.data.data)
        //         // getCurrentObject(product)
        //     }
        // })
        // OrderServices.getOrder('').then(data => {
        //     let OrderData = []
        //     if (data.data.data) {
        //         OrderData = data.data.data
        //         setOrders(OrderData)
        //     }
        // })
        // ShipperServices.getShipper().then(data => {
        //     if (data.data.data) {
        //         setShippers(data.data.data)
        //         // getCurrentObject(shippers)
        //     }
        // })
    }, [])

    useEffect(() => {
        console.log("Time Range 1: ", timeRange)
        setXAxis(getDates(timeRange[0].getTime(), timeRange[1].getTime()))
        getFigure(timeRange[0].getTime(), timeRange[1].getTime())
    }, [timeRange])
    // ** Chart Options
    const areaColors = {
        series3: '#a4f8cd95',
        series2: '#60f2ca95',
        series1: '#2bdac795'
    }

    const options = {
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
            horizontalAlign: 'start'
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
            categories: xAxis
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
    const series = [
        {
            name: 'Sản Phẩm Đã Bán',
            data: productFigure
        },
        {
            name: 'Số Đơn Đã Nhận',
            data: orderFigure
        },
        {
            name: 'Doanh Thu',
            data: revenueFigure
        }
    ]
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
                <Chart options={options} series={series} type='area' height={400} />
                <Row>
                    <Col sm={12}>Tổng Lợi Nhuận: <b>{formatMoney(totalRevenue)}</b> </Col>
                    <Col sm={12}>Tổng Số Đơn Hàng Đã Nhận:<b> {totalOrder} đơn</b></Col>
                    <Col sm={12}>Tổng Số Sản Phẩm Đã Bán:<b> {totalProduct} sản phẩm</b></Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default RevenueChart