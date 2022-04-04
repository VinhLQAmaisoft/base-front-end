import React, { useEffect, useState } from 'react'
import { Card, CardBody, Label, Input, Button, CardTitle, Col, Row, TabPane, Badge, FormGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter } from 'reactstrap'
import { CommentServices, UserServices, PostServices } from '@services';
import CreateOrderModal from '../Modals/CreateOrderModal'
import { formatMoney } from '@utils'
export default function PostDetailTab(props) {
    // console.log("PostDetailTab PROPS: ", props)
    const [modal, setModal] = useState(false);
    const [post, SetPost] = useState(props?.post);
    const [comments, setComments] = useState([]);
    const [replySyntax, setReplySyntax] = useState([]);
    const [commentFilter, setCommentFilter] = useState([-1, 0, 1])
    const [selectedComment, setSelectedComment] = useState({})
    const [commentRender, setCommentRender] = useState([])
    const [timer, setTimer] = useState(120);
    const [intervalTask, setIntervalTask] = useState([]);
    const [cookie, setCookie] = React.useState('');
    const [token, setToken] = React.useState('');
    useEffect(() => {
        let taskId = setCounter();
        setInterval([...intervalTask, taskId])
        CommentServices.getComment(`?post_id=${post._id}`)
            .then((data) => {
                if (data.data.data) {
                    setComments(sortComment(data.data.data));
                    setCommentRender(renderComment(comments));

                }
                CommentServices.scanComment({
                    postId: post._id
                }).then(data => {
                    const baseDot = ['Uppp', "Mại Zô", "Lênn", ".", '...']
                    if (!data.data?.data) {
                        alert(data.data.message)
                    }
                    CommentServices.createComment({ content: baseDot[Math.floor(Math.random() * baseDot.length)], postId: post.fb_id })
                    let task = createScanInterval(120)
                    setIntervalTask([...intervalTask, task])
                })
            })
            // setComments(postComment);
            ;
        UserServices.getProfile(``).then(data => {
            setReplySyntax(data.data.data.replySyntaxs)
        })
    }, [])

    //Clear Interval Task!!!
    useEffect(() => {

        return () => {
            window.clearInterval(intervalTask);
        };
    }, []);

    function setCounter() {
        console.log("START TIMER")
        return setInterval(() => {
            if (timer > 0) {
                // console.log('Count down before: ' + timer)
                let tempTimer = timer
                setTimer((old) => --old)
                // console.log('Count down after: ' + timer)
            }
        }, 1000)
    }



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

    const handleModal = () => setModal(!modal)


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
                        setTimer(second)
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

    function renderReplyComment(commentId) {
        return replySyntax.map(syntax => (
            <DropdownItem className='w-100' key={commentId + "-" + syntax} onClick={() => { replyComment(commentId, syntax) }}>
                <span className='align-middle ms-50'>{syntax}</span>
            </DropdownItem>))
    }




    const renderComment = (comments) => {

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
                        <CardFooter>
                            {match > 0 && comment.type == 0 && <Button color="success" size="sm" outline={true} onClick={() => createOrder(comment)} className="create-button me-1">
                                Tạo Đơn
                            </Button>}

                            {match > 0 && comment.type == 1 && <Button color="success" size="sm" outline={false} onClick={() => { }} className="create-button me-1">
                                Đã Tạo Đơn
                            </Button>}

                            <UncontrolledButtonDropdown className="ml-2">
                                <DropdownToggle size="sm" color='warning' caret outline>
                                    <span className='align-middle ms-50'>Phản Hồi</span>
                                </DropdownToggle>
                                <DropdownMenu>
                                    {renderReplyComment(comment.fb_id)}
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>


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

    const counter = () => {
        return <Badge color="success">Quét comment sau: {timer}s</Badge>
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
                            <Input type='text' id="cookie" className='form-control' />
                        </Col>
                        <Col sm="4">
                            <Label className="text-dark fs-5">Token: </Label>
                            <Input type='text' id="token" className='form-control' />
                        </Col>
                        <Col sm="2">
                            <Button color="primary" onClick={() => { addCookie() }}>
                               Cập Nhật
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {/* THÔNG TIN BÀI VIÉT */}
            <Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    Thông tin bài viết {counter()}
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
                                defaultValue={post.content}
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

            <Card>
                <CardFooter>
                    <Button color="primary" onClick={() => disableComment()}>
                        Kết Thúc Buổi Bán Hàng
                    </Button>
                </CardFooter>
            </Card>
            <CreateOrderModal products={post.products} comment={selectedComment} setSelectedComment={setSelectedComment} open={modal} handleModal={handleModal} />
        </TabPane >
    )
}
