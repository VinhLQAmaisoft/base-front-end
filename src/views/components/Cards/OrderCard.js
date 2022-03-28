import React, { useState, useEffect, Fragment } from 'react'
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
import { formatMoney } from '@utils'
import UpdateOrderModal from '@my-components/Modals/UpdateOrderModal'
import { OrderServices } from '@services'
export default function OrderCard({ baseOrder, products }) {
    const [modal, setModal] = useState(false)
    const [orderStatus, setOrderStatus] = useState(baseOrder?.status)
    const [order, setOrder] = useState(baseOrder)
    const [total, setTotal] = useState('');
    console.log("Order status: ", order)
    console.log("Products status: ", products)
    function renderHeader() {
        // status = parseInt(status)
        let label = '';
        let delayLabel = '';
        switch (order.status) {
            case 'created': label = 'Vừa Tạo'; break;
            case 'ready': label = 'Sẵn Sàng'; break;
            case 'shipping': label = 'Đang Giao'; break;
            case 'done': label = 'Hoàn Thành'; break;
            case 'cancel': label = 'Hủy Đơn'; break;
            default: label = "Vừa Tạo"; break;
        }
        let currentTime = Date.now();
        let delay = currentTime - order.updateAt
        console.log("Delay: ", delay)
        if (delay < 60000) {
            delay = 0
            delayLabel = 'Vài giây trước'
        } else if (delay > 60000) {
            delay = Math.floor(delay / 60000);
            delayLabel = `${delay} phút trước`
        }
        return (<CardTitle className={delay < 5 ? 'text-success' : delay < 15 ? 'text-warning' : 'text-danger'} tag='h4'>
            {label} ({delayLabel})
        </CardTitle>)
    }


    const handleModal = () => setModal(!modal)

    const handleEdit = () => {
        handleModal();
    }


    function handleUpdateStatus(id, status) {
        setOrderStatus(status.label)
        OrderServices.updateStatus(`?id=${id}&status=${status.value}`).then(data => {
            alert(data.data.message)
            OrderServices.getOrder(`?id=${order._id}`).then(data => setOrder(data.data.data[0]))
        })
    }

    function renderStatusOptions() {
        let status = [{
            value: 'created',
            label: 'Vừa Tạo'
        }, {
            value: 'ready',
            label: 'Sẵn Sàng'
        }, {
            value: 'shipping',
            label: 'Đang Giao'
        }, {
            value: 'done',
            label: 'Hoàn Thành'
        }, {
            value: 'cancel',
            label: 'Hủy Đơn'
        },]
        return status.map(s => (
            <DropdownItem className='w-100' onClick={() => handleUpdateStatus(order._id, s)}>
                <span className='align-middle ms-50'>{s.label}</span>
            </DropdownItem>
        ))
    }

    function renderProduct() {
        let index = 1;
        let result = [];
        let sum = 0
        for (const product of order.product) {
            index++;
            result.push(
                <tr key={index}>
                    <th className="p-0" scope="row">
                        {product.product.title}
                    </th>
                    <td className="p-1">
                        {product.quantity}
                    </td>
                    <td className="p-0">
                        {formatMoney(parseInt(product.quantity) * product.product.price)}
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
        <Fragment>
            <Card className=' p-1'>
                <CardHeader className='flex-md-col mb-1 flex-column align-items-center align-items-start border-bottom'>
                    <div className='d-flex w-100' style={{ justifyContent: 'center' }}>
                        {renderHeader()}
                        {/* <a className='ml-3' target='_blank' href={props.fb_url}> Trực quan</a> */}
                    </div>
                </CardHeader>
                <CardBody className='text-center p-1'>
                    {/* CONTENT */}
                    <Row className='mb-1'>
                        <Col sm={12} className='text-center'><User size={18} /> Khách: <b>{order.customerName}</b></Col>
                        <Col sm={12} className='text-center'><Phone size={18} /> SĐT:  <b>{order.phone}</b> </Col>
                        <Col sm={12} className='text-center'><Home size={18} /> Địa chỉ:<b>{order.address}</b></Col>
                    </Row>
                    <Row className='mb-1'>
                        <Col sm='12'  >
                            <Table bordered className="w-100 ">
                                <thead>
                                    <tr>
                                        <th className="p-1">
                                            Sản Phẩm
                                        </th>
                                        <th className="p-1">
                                            Số Lượng
                                        </th>
                                        <th className="p-1">
                                            Giá trị
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderProduct()}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row className='mb-1 text-start'>
                        <Col sm={12} className='mb-1'> Tổng Tiền: {formatMoney(calTotal())}</Col>
                        <Col sm={12} className='mb-1'>
                            <UncontrolledButtonDropdown>
                                <DropdownToggle color='secondary' caret outline>
                                    <span className='align-middle ms-50'>Trạng Thái</span>
                                </DropdownToggle>
                                <DropdownMenu>
                                    {renderStatusOptions()}

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
                    <Button color='warning' onClick={() => { handleEdit() }}> Sửa Order </Button>
                </CardFooter>
            </Card>
            {order && products &&
                <UpdateOrderModal order={order} products={products} open={modal} handleModal={handleModal} />}
        </Fragment>
    )
}
