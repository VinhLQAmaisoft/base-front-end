import {
    Modal,
    ModalBody,
    ModalHeader,
    Badge,
    Row,
    Col,
    Table,
} from 'reactstrap'

const statusColors = {
    done: 'light-secondary',
    cancel: 'light-danger',
    shipping: 'light-warning',
    created: 'light-info',
    ready: 'light-success'
}
const statusLabel = {
    done: 'Hoàn Thành',
    cancel: 'Hủy Đơn',
    shipping: 'Đang Giao',
    created: 'Vừa Tạo',
    ready: 'Sẵn Sàng'
}
import { formatTimeStamp, alert, formatMoney } from '../../../utility/Utils'

const OrderDetailModal = ({ show, setShow, detailData }) => {


    function renderProduct() {
        let index = 1;
        let result = [];
        let sum = 0
        for (const product of detailData.product) {
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

    return (
        <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-4'>
                <h1 className='text-center mb-1'>Chi tiết đơn hàng</h1>
                <p className='text-center'>Cửa hàng {detailData.shopkeeper}</p>
                <div className='info-container'>
                    {detailData !== null ? (
                        <ul className='list-unstyled'>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Tên khách hàng:</span>
                                <span>{detailData.customerName}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Số điện thoại:</span>
                                <span>{detailData.phone}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Tổng tiền:</span>
                                <span>{formatMoney(detailData.total)}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Shipper:</span>
                                <span>{detailData.shipper || 'Chưa có ai'}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Trạng thái:</span>
                                <Badge className='text-capitalize' color={statusColors[detailData.status]}>
                                    {statusLabel[detailData.status]}
                                </Badge>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Địa chỉ:</span>
                                <span className='text-capitalize'>{detailData.address}</span>
                            </li>
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
                        </ul>
                    ) : null}
                </div>
            </ModalBody>
        </Modal>
    )
}

export default OrderDetailModal
