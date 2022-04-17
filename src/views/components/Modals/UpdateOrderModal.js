// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X } from 'react-feather'
import { formatMoney } from '@utils'
import { OrderServices } from '@services'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col, FormGroup, Form, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddNewModal = ({ open, updateOrderView, handleModal, order, products }) => {
    // ** State
    const [selectedProduct, setSelectedProduct] = useState({})
    const [productOptions, setProductOptions] = useState([])
    const [tempListProduct, setTempListProduct] = useState([])
    // console.log("UPDATE ORDER ID: ", order._id)
    useEffect(() => {
        setTempListProduct(order.product)
        // console.log("trigger update order model");
        let option = [];
        for (let i = 0; i < products.length; i++) {
            let isExist = false;
            for (const product of tempListProduct) {
                if (product.product.title === products[i].title) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                option.push(products[i]);
            }
        }

        setProductOptions(option)
        // console.log("Product's Options: ", pParrent:roductOptions.length)
    }, [])

    // ** Custom close btn
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

    const addProduct = () => {
        let quantity = document.getElementById("p-price").value;
        if (/\D/.test(quantity)) {
            return alert("Số Lượng Không Phù hợp");
        }
        else {
            if (tempListProduct) {
                setTempListProduct([...tempListProduct, { product: selectedProduct, quantity }])

            } else {
                setTempListProduct([{ product: selectedProduct, quantity }])
            }
            let newOption = productOptions.filter(product => product.title != selectedProduct.title)
            setProductOptions(newOption)
            setSelectedProduct(null)
        }
    }

    const editOrder = () => {
        OrderServices.editOrder({
            _id: order._id,
            shipper: order.shipper,
            product: tempListProduct,
            customerName: document.getElementById('name').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            updateAt: Date.now(),
        }).then(data => {
            alert(data.data.message);
            if (data.data.data) {
                order.product = tempListProduct;
                order.customerName = document.getElementById('name').value;
                order.address = document.getElementById('address').value;
                order.phone = document.getElementById('phone').value;
                // updateOrderView(order)
            }
            handleModal()
        })

    }

    const handleChangeProduct = (index, value) => {
        let temp = JSON.parse(JSON.stringify(tempListProduct));
        temp[index].quantity = value;
        setTempListProduct(temp)
    }

    const renderProduct = () => {
        return tempListProduct.map((product, index) => (
            <Row style={{ marginBottom: '5px' }}>
                <Col>
                    <Input type="text" disabled={true} defaultValue={product.product.title} />
                </Col>
                -
                <Col>
                    <Input type="number" defaultValue={product.quantity} onChange={(evt) => {
                        handleChangeProduct(index, evt.target.value)
                    }} />
                </Col>
            </Row>
        ))
    }

    const renderProductOption = () => {
        return productOptions.map(product => (
            <DropdownItem className='w-100' key={product._id} onClick={() => { setSelectedProduct(product) }}>
                <span className='align-middle ms-50'>{product.title} - {formatMoney(product.price)}</span>
            </DropdownItem>))
    }

    return (
        <Modal
            isOpen={open}
            toggle={handleModal}
            className='sidebar-sm'
            modalClassName='modal-slide-in'
            contentClassName='pt-0'
        >
            <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
                <h5 className='modal-title'>Cập Nhật Đơn Hàng</h5>
            </ModalHeader>
            <ModalBody className='flex-grow-1'>
                <div className='mb-1'>
                    <Label className='form-label' for='full-name'>
                        Khách Hàng
                    </Label>
                    <InputGroup>
                        <InputGroupText>
                            <User size={15} />
                        </InputGroupText>
                        <Input id='name' placeholder='Khách Hàng' defaultValue={order.customerName} />
                    </InputGroup>
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='full-name'>
                        Số Điện Thoại
                    </Label>
                    <InputGroup>
                        <InputGroupText>
                            <User size={15} />
                        </InputGroupText>
                        <Input id='phone' placeholder='Số Điện Thoại' defaultValue={order.phone} />
                    </InputGroup>
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='full-name'>
                        Địa Chỉ
                    </Label>
                    <InputGroup>
                        <InputGroupText>
                            <User size={15} />
                        </InputGroupText>
                        <Input id='address' placeholder='Địa Chỉ' defaultValue={order.address} />
                    </InputGroup>
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='post'>
                        Sản phẩm
                    </Label>
                    {tempListProduct.length > 0 && renderProduct()}
                    {productOptions.length > 0 && (
                        <Row>
                            <Col md={6} sm={12}>
                                <Label for="exampleNumber">
                                    Chọn sản phẩm
                                </Label>
                                <UncontrolledButtonDropdown className="ml-2">
                                    <DropdownToggle size="sm" color='warning' caret outline>
                                        <span className='align-middle ms-50'>{selectedProduct?.title ? selectedProduct?.title : 'Sản Phẩm'}</span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {renderProductOption()}
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown></Col>
                            <Col md={6} sm={12}>
                                <Label for="exampleNumber">
                                    Số Lượng
                                </Label>
                                <Input
                                    id="p-price"
                                    name="number"
                                    placeholder="Số Lượng"
                                    type="number"
                                />

                            </Col>
                            <Col sm={12} className='mt-1'>
                                <Button outline="true" color="success" onClick={() => { addProduct() }}>Thêm</Button>
                            </Col>
                        </Row>
                    )}
                </div>


                <Button className='me-1' color='primary' onClick={editOrder}>
                    Cập Nhật
                </Button>
                <Button color='secondary' onClick={handleModal} outline>
                    Hủy
                </Button>
            </ModalBody>
        </Modal >
    )
}

export default AddNewModal
