import {
    Modal,
    ModalBody,
    ModalHeader,
    Badge,
} from 'reactstrap'

const statusColors = {
    done: 'light-secondary',
    cancel: 'light-danger',
    shipping: 'light-warning',
    created: 'light-info',
    ready: 'light-success'
  }

const OrderDetailModal = ({ show, setShow, detailData }) => {

    // console.log(detailData)

    return (
        <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-4'>
                <h1 className='text-center mb-1'>Chi tiết đơn hàng</h1>
                <p className='text-center'>sShare project with a team member</p>
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
                                <span>{detailData.total}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Trạng thái:</span>
                                <Badge className='text-capitalize' color={statusColors[detailData.status]}>
                                    {detailData.status}
                                </Badge>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Địa chỉ:</span>
                                <span className='text-capitalize'>{detailData.address}</span>
                            </li>
                            {/* <li className='mb-75'>
                                <span className='fw-bolder me-25'>Tax ID:</span>
                                <span>Tax-{detailData.contact.substr(detailData.contact.length - 4)}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Contact:</span>
                                <span>{detailData.contact}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Language:</span>
                                <span>English</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Country:</span>
                                <span>England</span>
                            </li> */}
                        </ul>
                    ) : null}
                </div>
            </ModalBody>
        </Modal>
    )
}

export default OrderDetailModal
