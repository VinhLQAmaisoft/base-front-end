import React from 'react'
import ImageUploading from 'react-images-uploading';
import { Card, CardBody, Label, Input, Button, CardTitle, Col, Row, TabPane, FormGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Form } from 'reactstrap'
import { UserServices, PostServices, ProductServices, AttachmentServices } from '@services';
export default function CreatePostTab(props) {
    const [images, setImages] = React.useState([]);
    const [cookie, setCookie] = React.useState('');
    const [token, setToken] = React.useState('');
    const [groupList, setGroupList] = React.useState([]);
    const [productList, setProductList] = React.useState([]);
    const [selectedGroup, setSelectedGroup] = React.useState({});
    const [selectedProducts, setSelectedProduct] = React.useState([]);
    const [selectedContent, setSelectedContent] = React.useState('');
    const maxNumber = 5;

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    const addCookie = async () => {
        let fbToken = document.getElementById('c-token').value;
        let fbCookie = document.getElementById('c-cookie').value;
        console.log("Token - Cookie: ", fbToken, fbCookie);
        if (fbCookie === "" || fbToken === "")
            return alert("Không được bỏ trống Token hoặc Cookie")
        // KHỞI TẠO COOKIE & TOKEN
        await UserServices.addCookie({ fbCookie, fbToken })
            .then(data => {
                alert(data.data.message)
                if (data.data.data) {
                    setCookie(fbCookie);
                    setToken(fbToken);
                }
            })
        // KHỞI TẠO DANH SÁCH NHÓM
        await UserServices.getGroupList("").then(data => {
            if (data.data?.data && data.data?.data.length) {
                setGroupList(data.data.data)
            } else {
                alert("Không tìm thấy group facebook của bạn")
            }
        })
        // KHỞI TẠO DANH SÁCH SẢN PHẨM
        await ProductServices.getProduct("").then(data => {
            if (data.data?.data && data.data?.data.length) {
                setProductList(data.data.data)
            } else {
                alert("Không tìm thấy sản phẩm của bạn")
            }
        })
    }

    function handleCheckProduct(value, product) {
        let index = -1, count = 0;
        for (const prd of selectedProducts) {
            if (prd._id === product._id) {
                index = count;
                break;
            }
            count++;
        }
        if (value) {
            if (index > -1) return
            else setSelectedProduct([...selectedProducts, product])
        } else {
            if (index > -1) {
                let temp = selectedProducts;
                temp.splice(index, 1);
                setSelectedProduct(temp)
            }
        }

    }

    const uploadPost = async () => {
        let attachments = await uploadAttachment().then(data => data.data.data).catch(err => { console.log("Upload Ảnh thất bại"); return [] })
        let content = document.getElementById("content").value
        let shipCost = parseInt(document.getElementById("shipCost").value);
        if (!shipCost || isNaN(shipCost) || shipCost < 1000) {
            return alert("Phí ship không hợp lệ")
        }
        console.log("Bài viết mới:")
        if (content != "" && selectedProducts.length > 0 && selectedGroup) {
            PostServices.uploadPost({
                content: content + '\n #3FS',
                group: selectedGroup,
                products: selectedProducts,
                attachments
            }).then(data => {
                alert(data.data.message)
                if (data.data.data) {
                    window.location.reload()
                }
            })
        }
    }

    const uploadAttachment = () => {
        let formData = new FormData()
        for (let i = 0; i < images.length; i++) {
            console.log("Xử lý file thứ " + i + 1)
            const file = images[i].file;
            formData.append('images', file)
        }
        return AttachmentServices.uploadImage(formData)
    }

    function renderGroupList() {
        return groupList.map(group => (
            <DropdownItem className='w-100' onClick={() => { setSelectedGroup(group) }}>
                <span className='align-middle ms-50'>{group.name}</span>
            </DropdownItem>))
    }

    function renderProduct() {
        return productList.map(product => (<FormGroup check inline >
            <Input type="checkbox" id={`product-${product._id}`} key={product._id} onChange={(event) => {
                handleCheckProduct(event.target.checked, product)
            }} />
            <Label check for={`product-${product._id}`} >
                {product.title}
            </Label>
        </FormGroup>))
    }

    return (
        <TabPane tabId={props.tabId}>
            <Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    Cookie
                </CardTitle>
                <hr className="bg-info" />
                <CardBody>
                    <Row className="justify-content-center align-items-end">
                        <Col sm="4">
                            <Label className="text-dark fs-5">Cookie: </Label>
                            <Input id="c-cookie" type='text' className='form-control' />
                            <a target="_blank" href="https://chrome.google.com/webstore/detail/get-cookie/naciaagbkifhpnoodlkhbejjldaiffcm">
                                Lấy cookie & token Facebook tại đây
                            </a>
                        </Col>
                        <Col sm="4">
                            <Label className="text-dark fs-5">Token: </Label>
                            <Input id="c-token" type='text' className='form-control' />
                            <a target="_blank"
                                href="https://chrome.google.com/webstore/detail/get-facebook-access-token/coaoigakadjdinfmepjlhfiichelcjpn">
                                Lấy token facebook tại đây
                            </a>
                        </Col>
                        <Col sm="2">
                            <Button color="primary" onClick={() => { addCookie() }}>
                                Bắt Đầu
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {cookie && token && (<Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    Thông tin bài viết
                </CardTitle>
                <hr className="bg-info" />
                <CardBody>
                    <Row >
                        {/* NHÓM CHỈ ĐỊNH */}
                        <Col sm="12" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Group đăng bài: </Label>
                            <UncontrolledButtonDropdown className="ml-2">
                                <DropdownToggle color='secondary' caret outline>
                                    <span className='align-middle ms-50'>{selectedGroup.name ? selectedGroup.name : "Group"}</span>
                                </DropdownToggle>
                                <DropdownMenu style={{ maxHeight: "200px", overflowY: "scroll" }}>
                                    {renderGroupList()}
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </Col>
                        {/* NỘI DUNG */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Nội Dung
                            </Label>
                            <Input
                                id="content"
                                name="text"
                                type="textarea"
                                style={{ minHeight: '200px' }}

                            />
                        </Col>
                        <Col sm="12" className="mb-2 d-flex align-items-center">
                            <Label className="text-dark fs-5 me-1" for="exampleText">
                                Phí Ship / Đơn (₫)
                            </Label>
                            <Input
                                id="shipCost"
                                name="number"
                                placeholder="Phí ship"
                                type="number"
                                min={1000}
                                step={500}
                                style={{ maxWidth: '200px' }}
                            />
                        </Col>
                        {/* SẢN PHẨM */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Sản Phẩm
                            </Label><br />
                            {renderProduct()}

                        </Col>
                        {/* ẢNH ĐÍNH KÈM */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Ảnh đính kèm (Tối đa {maxNumber} ảnh)
                            </Label>
                            <br />
                            <ImageUploading
                                id='uploadImage'
                                multiple
                                value={images}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    // write your building UI
                                    <Row className="upload__image-wrapper">
                                        <Col sm="12" className="my-1">
                                            <Button color="info"
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                Thêm Ảnh Mới
                                            </Button>
                                            &nbsp;
                                            <Button color="danger" onClick={onImageRemoveAll}>Xóa Tất Cả ảnh</Button>
                                        </Col>
                                        {imageList.map((image, index) => (
                                            <Col sm="3" key={index} className="image-item mb-1 d-inline-block">
                                                <img src={image['data_url']} alt="" width="100%" />
                                                <div style={{ marginTop: "5px" }} className="image-item__btn-wrapper">
                                                    <Button size="sm" className="mx-1" color="warning" onClick={() => onImageUpdate(index)}>Đổi</Button>
                                                    <Button size="sm" className="mx-1" color="danger" onClick={() => onImageRemove(index)}>Xóa</Button>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </ImageUploading>
                        </Col>
                        <Col sm="2">
                            <Button color="primary" onClick={() => uploadPost()}>
                                Bắt Đầu
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>)
            }
        </TabPane >
    )
}
