import React, { useEffect, useState } from 'react'
import { Card, CardBody, Label, Input, Button, CardTitle, Col, Row, TabPane, Badge, FormGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Modal, ModalFooter } from 'reactstrap'
import { CommentServices, UserServices, PostServices } from '@services';
import CreateOrderModal from '../Modals/CreateOrderModal'
import { formatMoney } from '@utils'
export default function PostDetailTab({ post, open, handleModal }) {
    const [comments, setComments] = useState([]);
    const [commentFilter, setCommentFilter] = useState([-1, 0, 1])
    const [commentRender, setCommentRender] = useState([])
    useEffect(() => {
        CommentServices.getComment(`?post_id=${post._id}`)
            .then((data) => {
                if (data.data.data) {
                    setComments(sortComment(data.data.data));
                    setCommentRender(renderComment(comments));
                }
            })
            // setComments(postComment);
            ;
        UserServices.getProfile(``).then(data => {
            setReplySyntax(data.data.data.replySyntaxs)
        })
    }, [])

    function sortComment(rawList) {
        let parent = rawList.filter(comment => comment.parentId == null);
        // console.log("Parrent: ", parent.length)
        let children = rawList.filter(comment => comment.parentId != null);
        let result = JSON.parse(JSON.stringify(parent))
        for (const child of children) {
            let index = result.length, count = 0;
            for (const comment of result) {
                if (comment.fb_id == child.parentId) {
                    index = count;
                    break;
                }
                count++;
            }
            result.splice(index + 1, 0, child);
        }
        return result
    }

    const createScanInterval = (second) => {
        const baseDot = ['Uppp', "Mại Zô", "Lênn", ".", '...']
        let x = setInterval(() => {
            CommentServices.scanComment({
                postId: post._id
            }).then(data => {
                if (!data.data?.data) {
                    alert(data.data.message)
                    clearInterval(x)
                }
                CommentServices.getComment(`?post_id=${post._id}`)
                    .then((data) => {
                        setComments(sortComment(data.data.data));
                        setCommentRender(renderComment(comments));
                    })
                CommentServices.createComment({ content: baseDot[Math.floor(Math.random() * baseDot.length)], postId: post.fb_id })
            })
        }, second * 1000)
        return x
    }

    const addCookie = () => {
        let fbToken = document.getElementById('token').value;
        let fbCookie = document.getElementById('cookie').value;
        if (fbCookie === "" || fbToken === "")
            return alert("Không được bỏ trống Token hoặc Cookie")
        // KHỞI TẠO COOKIE & TOKEN
        UserServices.addCookie({ fbCookie, fbToken })
            .then(data => {
                alert(data.data.message)
                if (data.data.data) {
                    setCookie(fbCookie);
                    setToken(fbToken);
                }
            })
    }

    //------------------------------------------------------------------------------ LOGIC FUNCTION ------------------------------------------------------------------------------

    const createOrder = comment => {
        setSelectedComment(comment)
        handleModal()
        // alert(`Create Order ${commentId}`)
    }

    const cancelOrder = commentId => {
        alert(`Cancel Order ${commentId}`)
    }

    const disableComment = () => {
        PostServices.disablePost({ postId: post.fb_id }).then(data => alert(data.data.message))
    }

    const replyComment = (commentId, syntax) => {
        alert(`Reply Comment ${commentId}: ${syntax}`)
        CommentServices.replyComment({
            postId: post.fb_id,
            content: syntax,
            commentId: commentId,
        }).then(data => alert(data.data.message))
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
                <Badge color='info' className="m-1 fs-6" key={product._id}>{product.title} - {formatMoney(product.price)}</Badge>
            ))
        }
        return result
    }

    const renderCommentFilter = (filter) => {
        let options = [
            { label: 'Hủy Đơn', value: -1 },
            { label: 'Spam', value: 0 },
            { label: 'Có thể là đơn', value: 1 }]

        return options.map((option, index) => (
            <FormGroup
                check
                inline
                key={"c-filter-" + index}
            >
                <Input type="checkbox"
                    checked={filter.includes(option.value)}
                    onChange={(evt) => { handleCommentFilter(evt, option.value); console.log("Update Comment Filter: " + filter); }} />
                <Label check>
                    {option.label}
                </Label>
            </FormGroup>
        ))
    }


    const renderComment = (comments) => {
        console.log("Comment Base: ", comments);
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
                    <Card style={{ "backgroundColor": (match == -1 ? '#3a3b3c' : match == 0 ? '#674ea7' : '#45818e') }} className={`${comment.parentId ? 'ms-5' : ''} p-1 mb-1`} key={comment.fb_id + "-" + result.length}>
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
                    </Card>
                )
        }
        return result
    }

    return (
        <Modal
            isOpen={open}
            toggle={handleModal}
            size='lg'
            // className='sidebar-sm'
            // modalClassName='modal-slide-in'
            contentClassName='pt-0'>
            {/* THÔNG TIN BÀI VIÉT */}
            <Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    Thông tin bài viết
                </CardTitle>
                <hr className="bg-info" />
                <CardBody>
                    <Row >
                        {/* NHÓM CHỈ ĐỊNH */}
                        <Col sm="8" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Group đăng bài: </Label>
                            <a href={`https://facebook.com/${post.group.groupId}`} target="_blank" className="text-info fs-6">{post.group.name}</a>
                        </Col >
                        <Col sm="4">
                            <a target="_blank" href={`https://facebook.com/${post.fb_id}`}>
                                <Button color="primary">
                                    Chi tiết
                                </Button>
                            </a>
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
                                style={{ minHeight: '200px' }}
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
                    {/* {commentRender} */}
                    {comments && renderComment(comments)}
                </CardBody>
            </Card>


            <ModalFooter>
                <Button color="primary" onClick={() => handleModal()}>
                    Đóng
                </Button>
            </ModalFooter>

        </Modal >
    )
}
