import React, { useEffect, useState } from 'react'
import { Card, CardBody, Label, Input, Button, CardTitle, Col, Row, TabPane, Badge, FormGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter } from 'reactstrap'
import { CommentData } from '@src/dummyData'
export default function PostDetailTab(props) {
    console.log("PostDetailTab PROPS: ", props)
    const [post, SetPost] = useState(props?.post);
    const [comments, setComments] = useState([]);
    const [commentFilter, setCommentFilter] = useState([-1, 0, 1])
    const [commentRender, setCommentRender] = useState([])
    useEffect(() => {
        let postComment = CommentData.filter(comment => comment.post_id === post._id.$oid);
        setComments(postComment);
        setCommentRender(renderComment());
    }, [])

    useEffect(() => {
        // console.log("Trigger Rerender")
        setCommentRender(renderComment());
    }, [comments, commentFilter])



    //------------------------------------------------------------------------------ LOGIC FUNCTION ------------------------------------------------------------------------------

    const createOrder = commentId => {
        alert(`Create Order ${commentId}`)
    }

    const cancelOrder = commentId => {
        alert(`Cancel Order ${commentId}`)
    }

    const replyComment = commentId => {
        alert(`Reply Comment ${commentId}`)
    }

    const handleCommentFilter = (evt, value) => {
        // console.log(evt)
        let newFilter = [...commentFilter];
        let index = newFilter.indexOf(value)
        if (evt.target.checked && index == -1) {
            newFilter.push(value)

        }
        else if (!evt.target.checked && index > -1) {
            newFilter.splice(index, 1)
        };
        setCommentFilter(newFilter)
    }

    //------------------------------------------------------------------------------ RENDER FUNCTION ------------------------------------------------------------------------------


    const renderProduct = (productList) => {
        const result = [];
        for (const product of productList) {
            result.push((
                <Badge color='info' className="m-1 fs-6" key={product._id}>{product.title} - {product.price}₫</Badge>
            ))
        }
        return result
    }

    const renderCommentFilter = (filter) => {
        let options = [
            { label: 'Hủy Đơn', value: -1 },
            { label: 'Spam', value: 0 },
            { label: 'Có thể là đơn', value: 1 }]

        return options.map(option => (
            <FormGroup
                check
                inline
                key={option.value}
            >
                <Input type="checkbox"
                    checked={filter.includes(option.value)}
                    onClick={(evt) => { handleCommentFilter(evt, option.value); console.log("Update Comment Filter: " + filter); }} />
                <Label check>
                    {option.label}
                </Label>
            </FormGroup>
        ))
    }

    const renderComment = () => {
        console.log("RE RENDER!!!");
        const result = [];
        for (const comment of comments) {
            let match = 0
            comment.data.products && match++;
            comment.data.phone && match++;
            comment.data.address && match++;
            if (comment.data.isCancelled) {
                console.log("Hủy đơn =  " + comment.data.isCancelled)
                match = -1
            };
            let rating = match == -1 ? -1 : match == 0 ? 0 : 1;
            if (commentFilter.includes(rating))
                result.push(
                    <Card style={{ "backgroundColor": (match == -1 ? '#3a3b3c' : match == 0 ? '#674ea7' : '#45818e') }} className=" p-1 mb-1" key={comment.fb_id}>
                        <CardTitle className="text-light mb-0">
                            <a href={`https://facebook.com/${comment.author.id}`} target="_blank" className="ms-1">
                                {comment.author.name}
                            </a>
                            <a href={`https://facebook.com/${comment.fb_id}`} target="_blank" className="ms-1">
                                <Button color="warning" size="sm" outline={true}>
                                    Chi  tiết comment
                                </Button>
                            </a>
                            <hr />

                        </CardTitle>
                        <CardBody className="text-light mt-0 p-1">
                            <Row className="mb-1">
                                <Col>
                                    {comment.data.products &&
                                        comment.data.products.map(product => <Badge color="danger" className="product-tag me-1">{product.quantity} * {product.product.title}</Badge>)
                                    }
                                    {comment.data.phone && (<Badge color="warning" className="product-tag me-1">{comment.data.phone}</Badge>)}
                                    {comment.data.address && (<Badge color="success" className="address-tag me-1">{comment.data.address}</Badge>)}

                                </Col>
                            </Row>
                            {comment.content}
                        </CardBody>
                        <CardFooter>
                            {match > 0 && <Button color="success" size="sm" outline={true} onClick={() => createOrder(comment.fb_id)} className="create-button me-1">
                                Tạo Đơn
                            </Button>}
                            <Button color="warning" size="sm" outline={true} onClick={() => replyComment(comment.fb_id)} className="reply-button me-1">
                                Phản Hồi
                            </Button>
                            {
                                match == -1 && <Button color="danger" size="sm" outline={true} onClick={() => cancelOrder(comment.fb_id)} className="cancel-button me-1">
                                    Hủy Đơn
                                </Button>
                            }
                        </CardFooter>
                    </Card>
                )
        }
        return result
    }

    return (
        <TabPane tabId={post.fb_id}>
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
            {/* THÔNG TIN BÀI VIÉT */}
            <Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    Thông tin bài viết
                </CardTitle>
                <hr className="bg-info" />
                <CardBody>
                    <Row >
                        {/* NHÓM CHỈ ĐỊNH */}
                        <Col sm="3" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Group đăng bài: </Label>
                            <a href={`https://facebook.com/${post.group.groupId}`} target="_blank" className="text-info fs-6">{post.group.name}</a>
                        </Col >
                        <Col sm="2">
                            <Button color="primary">
                                Chi tiết
                            </Button>
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
                                value={post.content}
                                editable="false"
                            />
                        </Col>
                        {/* SẢN PHẨM */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Sản Phẩm
                            </Label><br />
                            {renderProduct(post.products)}
                        </Col>
                        {/* ẢNH ĐÍNH KÈM */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Ảnh đính kèm
                            </Label>
                            <Row>
                                <Col sm="3" className="">
                                    <img className="w-100" src='https://i.pinimg.com/564x/78/90/e1/7890e13d8985d3a5360e3e62831575fd.jpg' />
                                </Col>
                                <Col sm="3" className="">
                                    <img className="w-100" src='https://i.pinimg.com/564x/78/90/e1/7890e13d8985d3a5360e3e62831575fd.jpg' />
                                </Col>
                                <Col sm="3" className="">
                                    <img className="w-100" src='https://i.pinimg.com/564x/78/90/e1/7890e13d8985d3a5360e3e62831575fd.jpg' />
                                </Col>
                                <Col sm="3" className="">
                                    <img className="w-100" src='https://i.pinimg.com/564x/78/90/e1/7890e13d8985d3a5360e3e62831575fd.jpg' />
                                </Col>
                            </Row>
                        </Col>
                    </Row >
                </CardBody >
            </Card >
            {/* DANH SÁCH COMMENT */}
            <Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    <b className="me-1">Comment</b>
                    {renderCommentFilter(commentFilter)}
                </CardTitle>
                <hr className="bg-info" />
                <CardBody>
                    {commentRender}
                </CardBody>
            </Card>



        </TabPane >
    )
}
