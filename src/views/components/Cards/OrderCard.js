import React, { useState, useEffect } from 'react'
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
import { User, Phone, Home } from 'react-feather'
export default function OrderCard(props) {
    const [orderStatus, setOrderStatus] = useState(0)
    const [order, setOrder] = useState(props?.order)
    const [total, setTotal] = useState('');
    console.log("Order Found: ", props)
    /*
     CREATED: 0,
            READY: 1,
            SHIPPING: 2,
            DONE: 3,
            CANCEL: -1
             */

    function renderHeader(status, updateAt) {
        // status = parseInt(status)
        console.log("Order status: ", status)
        let label = '';
        let delayLabel = '';
        switch (status) {
            case 'created': label = 'Vừa Tạo?'
            case 'ready': label = 'Sẵn Sàng'
            case 'shipping': label = 'Đang Giao'
            case 'done': label = 'Hoàn Thành'
            case 'cancel': label = 'Hủy Đơn'
            default: label = "Vừa Tạo"
        }
        let currentTime = Date.now();
        let delay = currentTime - updateAt
        if (delay < 60000) {
            delay = 0
            delayLabel = 'Vài giây trước'
        } else if (delay > 60000) {
            delay = delay % 60000;
            delayLabel = `${delay} phút trước`
        }
        return (<CardTitle className={delay < 5 ? 'text-success' : delay < 15 ? 'text-warning' : 'text-danger'} tag='h4'>
            {label} ({delayLabel})
        </CardTitle>)
    }

    function renderProduct() {
        let index = 1;
        let result = [];
        let sum = 0
        for (const product of order.product) {
            result.push(
                <tr>
                    <th scope="row">
                        {product.product.title}
                    </th>
                    <td>
                        {product.quantity}
                    </td>
                    <td>
                        {parseInt(product.quantity) * product.product.price} ₫
                    </td>
                </tr>
            )
            sum += parseInt(product.quantity) * product.product.price;
        }
        return result;
    }

    function calTotal() {
        let sum = 0;
        for (const product of order.product) {
            sum += parseInt(product.quantity) * product.product.price;
        }
        return sum;
    }


    return (
        <Card className='d-flex align-items-center'>
            <CardHeader className='flex-md-col mb-1 flex-column align-items-center align-items-start border-bottom'>
                <div className='d-flex w-100' style={{ justifyContent: 'center' }}>
                    {renderHeader(order.status, order.updateAt)}
                    {/* <a className='ml-3' target='_blank' href={props.fb_url}> Trực quan</a> */}
                </div>
            </CardHeader>
            <CardBody className='d-flex flex-column align-items-center'>
                {/* CONTENT */}
                <Row className='mb-1'>
                    <Col sm={12}><User size={18} /> Khách: <b>{order.customerName}</b></Col>
                    <Col sm={12}><Phone size={18} /> SĐT:  <b>{order.phone}</b> </Col>
                    <Col sm={12}><Home size={18} /> Địa chỉ:<b>{order.address}</b></Col>
                </Row>
                <Row className='mb-1'>
                    <Col>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>
                                        Sản Phẩm
                                    </th>
                                    <th>
                                        Số Lượng
                                    </th>
                                    <th>
                                        Giá trị
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderProduct()}
                            </tbody>
                        </Table></Col>
                </Row>
                <Row className='mb-1'>
                    <Col sm={12} className='mb-1'> Tổng Tiền: {calTotal()}₫</Col>
                    <Col sm={12} className='mb-1'>
                        <Label className='me-1'>Trạng Thái: </Label>
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='secondary' caret outline>
                                <span className='align-middle ms-50'>{orderStatus == -1 ? "Tất Cả" : orderStatus == 0 ? "Hoạt Động" : "Kết thúc"}</span>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='w-100' onClick={() => setOrderStatus(-1)}>
                                    <span className='align-middle ms-50'>Tất Cả</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => setOrderStatus(0)}>
                                    <span className='align-middle ms-50'>Hoạt Động</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => setOrderStatus(1)}>
                                    <span className='align-middle ms-50'>Kết Thúc</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    </Col>
                    <Col sm={12}>
                        <Label className='me-1'>Shipper: </Label>
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='secondary' caret outline>
                                <span className='align-middle ms-50'>{orderStatus == -1 ? "Tất Cả" : orderStatus == 0 ? "Hoạt Động" : "Kết thúc"}</span>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='w-100' onClick={() => setOrderStatus(-1)}>
                                    <span className='align-middle ms-50'>Tất Cả</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => setOrderStatus(0)}>
                                    <span className='align-middle ms-50'>Hoạt Động</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => setOrderStatus(1)}>
                                    <span className='align-middle ms-50'>Kết Thúc</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    </Col>
                </Row>
            </CardBody>
            {/* FOOTER */}
            <CardFooter>
                <Button color='warning'> Sửa Order </Button>
            </CardFooter>
        </Card>
    )
}
