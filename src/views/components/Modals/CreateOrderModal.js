// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X } from 'react-feather'
import { formatMoney, alert } from '@utils'
import { OrderServices, CommentServices } from '@services'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col, FormGroup, Form, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddNewModal = ({ open, handleModal, comment, setComments, products }) => {
    // ** State
    const [selectedProduct, setSelectedProduct] = useState({})
    const [productOptions, setProductOptions] = useState(products ? products : [])
    const [tempListProduct, setTempListProduct] = useState(comment?.data?.products ? comment?.data?.products : [])
    // console.log("Selected Comment: ", comment)
    // ** Custom close btn
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
    const baseConfirm = ['oki nha', 'okee', 'mình đang làm nha', 'oki', 'oke']
    useEffect(() => {
        if (comment?.data?.products && comment?.data?.products.length > 0) {
            setTempListProduct(comment?.data?.products);
        }
    }, [])

    useEffect(() => {
        console.log("Comment: ", comment)
        comment && setTempListProduct(comment?.data?.products ? comment?.data?.products : [])
        console.log("Product : ", tempListProduct)
    }, [open])

    useEffect(() => {
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
    }, [])

    useEffect(() => {
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
    }, [selectedProduct, tempListProduct])

    const addProduct = () => {
        let quantity = document.getElementById("p-price").value.trim();
        console.log(`${tempListProduct.length} Add  `, selectedProduct, ` * ${quantity} `)

        if (!selectedProduct || /\D/.test(quantity) || quantity == "") {
            return alert.error("Thông tin không phù hợp");
        }
        else {
            if (tempListProduct.length > 0) {
                setTempListProduct([...tempListProduct, { product: selectedProduct, quantity }])

            } else {
                setTempListProduct([{ product: selectedProduct, quantity }])
            }

            setSelectedProduct(null)
        }
    }

    const createOrder = () => {
        OrderServices.createOrder({
            comment_id: comment.fb_id,
            product: tempListProduct,
            customerName: document.getElementById('name').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            customerId: comment.author.id,
            postId: comment.post_id,
            createAt: Date.now(),
        }).then(data => {
            if (data.data.data) {
                alert.success(data.data.message);
                CommentServices.createComment({ content: baseConfirm[Math.floor(Math.random() * baseConfirm.length)], postId: comment.fb_id })
                let tempComment = { ...comment };
                tempComment.type = 1;
                setComments()
                handleModal()
            } else alert.error(data.data.message);
        })

    }

    const removeTempProduct = (index) => {
        let temp = JSON.parse(JSON.stringify(tempListProduct));
        temp.splice(index, 1);
        setTempListProduct(temp)

    }

    const renderProduct = () => {
        return tempListProduct.map((product, index) => (
            <Row style={{ marginBottom: '5px' }}>
                <Col sm="5">
                    <Input type="text" disabled={true} defaultValue={product.product.title} />
                </Col>
                <Col sm="4">
                    <Input type="number" defaultValue={product.quantity} onChange={(evt) => {
                        console.log(evt.target.value)
                    }} />
                </Col>
                <Col sm="2">
                    <Button color="warning" size="sm" onClick={() => { removeTempProduct(index) }} >x</Button>

                </Col>
            </Row >
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
                <h5 className='modal-title'>Tạo Đơn Hàng</h5>
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
                        <Input id='name' placeholder='Khách Hàng' defaultValue={comment?.author?.name} />
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
                        <Input id='phone' placeholder='Số Điện Thoại' defaultValue={comment?.data?.phone} />
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
                        <Input id='address' placeholder='Địa Chỉ' defaultValue={comment?.data?.address} />
                    </InputGroup>
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='post'>
                        Sản phẩm
                    </Label>
                    {tempListProduct.length > 0 && renderProduct()}
                    {productOptions.length > 0 && (
                        <Row>
                            <Col md={6} sm={12} >
                                <Label for="exampleNumber">
                                    Chọn sản phẩm
                                </Label>
                                <UncontrolledButtonDropdown className="ml-2">
                                    <DropdownToggle style={{ textAlign: 'left', paddingLeft: "5px", maxWidth: '150px', overflow: 'hidden' }} size="md" color='warning' caret outline>
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


                <Button className='me-1' color='primary' onClick={createOrder}>
                    Tạo Đơn Hàng
                </Button>
                <Button color='secondary' onClick={handleModal} outline>
                    Hủy
                </Button>
            </ModalBody>
        </Modal >
    )
}

export default AddNewModal
