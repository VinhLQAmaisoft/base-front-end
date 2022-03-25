import React from 'react'
import ImageUploading from 'react-images-uploading';
import { Card, CardBody, Label, Input, Button, CardTitle, Col, Row, TabPane, FormGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export default function CreatePostTab(props) {
    const [images, setImages] = React.useState([]);
    const maxNumber = 5;

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };


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
                            <Input type='text' className='form-control' />
                        </Col>
                        <Col sm="4">
                            <Label className="text-dark fs-5">Token: </Label>
                            <Input type='text' className='form-control' />
                        </Col>
                        <Col sm="2">
                            <Button color="primary">
                                Bắt Đầu
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    Thông tin bài viết
                </CardTitle>
                <hr className="bg-info" />
                <CardBody>
                    <Row >
                        {/* NHÓM CHỈ ĐỊNH */}
                        <Col sm="6" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Group đăng bài: </Label>
                            <UncontrolledButtonDropdown className="ml-2">
                                <DropdownToggle color='secondary' caret outline>
                                    <span className='align-middle ms-50'>Group</span>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className='w-100' onClick={() => { }}>
                                        <span className='align-middle ms-50'>Group 1</span>
                                    </DropdownItem>
                                    <DropdownItem className='w-100' onClick={() => { }}>
                                        <span className='align-middle ms-50'>Group 2</span>
                                    </DropdownItem>
                                    <DropdownItem className='w-100' onClick={() => { }}>
                                        <span className='align-middle ms-50'>Group 3</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </Col>
                        {/* NỘI DUNG */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Nội Dung
                            </Label>
                            <Input
                                id="exampleText"
                                name="text"
                                type="textarea"
                            />
                        </Col>
                        {/* SẢN PHẨM */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Sản Phẩm
                            </Label><br />
                            <FormGroup check inline >
                                <Input type="checkbox" />
                                <Label check>
                                    Sản phẩm 1
                                </Label>
                            </FormGroup>
                            <FormGroup check inline >
                                <Input type="checkbox" />
                                <Label check>
                                    Sản phẩm 2
                                </Label>
                            </FormGroup>
                            <FormGroup check inline >
                                <Input type="checkbox" />
                                <Label check>
                                    Sản phẩm 3
                                </Label>
                            </FormGroup>
                        </Col>
                        {/* ẢNH ĐÍNH KÈM */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Ảnh đính kèm (Tối đa {maxNumber} ảnh)
                            </Label>
                            <br />
                            <ImageUploading
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
                            <Button color="primary">
                                Bắt Đầu
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </TabPane>
    )
}
