import React, { useEffect, useState } from 'react'
import { Card, CardBody, Label, Input, Button, CardTitle, Col, Row, TabPane, Badge, FormGroup, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter, Spinner } from 'reactstrap'
import { CommentServices, UserServices, PostServices } from '@services';
import CreateOrderModal from '../Modals/CreateOrderModal'
import { formatMoney, alert } from '@utils'
export default function PostDetailTab(props) {
    // console.log("PostDetailTab PROPS: ", props)
    const [modal, setModal] = useState(false);
    const [isScan, setIsScan] = useState(true)
    const [isComment, setIsComment] = useState(true)
    const [post, SetPost] = useState(props?.post);

    const [comments, setComments] = useState([]);
    const [replySyntax, setReplySyntax] = useState([]);
    const [commentFilter, setCommentFilter] = useState([-1, 0, 1])
    const [selectedComment, setSelectedComment] = useState({})
    const [commentRender, setCommentRender] = useState([])

    const [timer, setTimer] = useState(120);
    const [cookie, setCookie] = React.useState('');
    const [token, setToken] = React.useState('');
    useEffect(() => {
        CommentServices.scanComment({
            postId: post._id
        }).then(data => {
            const baseDot = ['Uppp', "Mại Zô", "Lênn", ".", '...']
            if (!data.data?.data) {
                alert.success(data.data.message)
            }
            CommentServices.createComment({ content: baseDot[Math.floor(Math.random() * baseDot.length)], postId: post.fb_id })
                .then(res => {
                    if (res.data.data == null) {
                        alert.warning(res.data.message)
                    }
                    CommentServices.getComment(`?post_id=${post._id}`)
                        .then((data) => {
                            if (data.data.data) {
                                setComments(sortComment(data.data.data));
                                setCommentRender(renderComment(comments));
                            }

                        })
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
        console.log("Init Interval Task!!!!!!!!!!!!!!!!!!!")
        let x = setCounter()
        let y = createScanInterval(120)

        return () => {
            console.log("Leave Page!!!!!!!!!!!!!!!y!!!!")
            if (y) {
                console.log("hủy job scan")
                window.clearInterval(y)
            }
            if (x) {
                console.log("hủy job counter")
                window.clearInterval(x)
            }
        };
    }, []);

    function setCounter() {
        console.log("START TIMER")
        return setInterval(() => {
            setTimer((old) => {
                if (old > 0)
                    return --old
                else {
                    return 0
                }
            })
        }, 1000)
    }

    function updateComment() {
        CommentServices.getComment(`?post_id=${post._id}`)
            .then((data) => {
                if (data.data.data) {
                    setComments(sortComment(data.data.data));
                    setCommentRender(renderComment(comments));
                }

            })
    }

    async function handleUpdate() {
        let content = document.getElementById('content').value + '\n #3SF';
        if (content == post.content) {
            alert.warning('Nội dung chưa được thay đổi');
            return
        }
        PostServices.editPost({
            fb_id: post.fb_id,
            content,
            attachments: post.attachment
        }).then(res => {
            alert.success(res.data.message)
        })
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
        let x = setInterval(async () => {
            let comment = document.getElementById('isCommentDot').value
            let scan = document.getElementById('isScanComment').value
            let now = new Date()
            if (scan) {
                console.log(`${now.toLocaleString()} Bắt Đầu Quét ${isScan}`)
                await CommentServices.scanComment({
                    postId: post._id
                }).then(data => {
                    if (!data.data?.data) {
                        alert.error(data.data.message)
                        setIsScan(false);
                        setIsComment(false);
                    } else {
                        let now2 = new Date()
                        if (comment) {
                            console.log(`${now2.toLocaleString()} Bắt Đầu Chấm Bài ${isComment}`)
                            CommentServices.createComment({ content: baseDot[Math.floor(Math.random() * baseDot.length)], postId: post.fb_id })
                        }
                    }
                    CommentServices.getComment(`?post_id=${post._id}`)
                        .then((data) => {
                            setComments(sortComment(data.data.data));
                            setCommentRender(renderComment(comments));
                        })
                })
            }
            setTimer(second)
        }, second * 1000)
        return x
    }

    const addCookie = () => {
        let fbToken = document.getElementById('token').value;
        let fbCookie = document.getElementById('cookie').value;
        if (fbCookie === "")
            return alert.error("Không được bỏ trống Token hoặc Cookie")
        // KHỞI TẠO COOKIE & TOKEN
        UserServices.addCookie({ fbCookie, fbToken })
            .then(data => {
                alert.success(data.data.message)
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
        alert.info(`Cancel Order ${commentId}`)
    }

    const disableComment = () => {
        PostServices.disablePost({ postId: post.fb_id }).then(data => {
            if (data.data.data) {
                alert.success(data.data.message)
                setTimeout(() => { window.location.reload() }, 2000)
            } else alert.error(data.data.message)

        })
    }

    const replyComment = (commentId, syntax) => {
        alert.info(`Reply Comment ${commentId}: ${syntax}`)
        CommentServices.replyComment({
            postId: post.fb_id,
            content: syntax,
            commentId: commentId,
        }).then(data => alert.success(data.data.message))
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
                // console.log("Hủy đơn =  " + comment.data.isCancelled)
                match = -1
            };
            let rating = match == -1 ? -1 : match == 0 ? 0 : 1;
            if (commentFilter.includes(rating))
                result.push(
                    <Card style={{ "backgroundColor": (match == -1 ? '#fcefee' : match == 0 ? '#fdfdfd' : '#e2f3f5') }} className={`${comment.parentId ? 'ms-5' : ''} p-1 mb-1`} key={JSON.stringify(comment)}>
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
                            <p style={{color:'#2d4059'}} >{comment.content}</p>
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
        return <Badge color="success">Cập nhật sau: {timer}s</Badge>
    }

    function renderAttachment(listAttachment) {
        let result = [];
        for (let attachment of listAttachment) {
            result.push(
                <Col key={`attachment-${result.length}`} className='d-flex pl-0 align-items-center justify-content-end mt-1 post-attachment-item' md='4' sm='12'>
                    {/* <img className='w-100' src={process.env.REACT_APP_BASE_SERVER_URL + '/' + attachment} /> */}
                    <img className='w-100' src={attachment} />
                </Col>)
        }
        return result
    }

    return (
        <TabPane tabId={post.fb_id}>
            <Card className="bg-light p-1 mb-1">
                <CardTitle className="text-primary mb-0 fs-4">
                    Cookie
                </CardTitle>
                <hr className="bg-primary" />
                <CardBody>
                    <Row className="justify-content-center align-items-center">
                        <Col sm="4">
                            <Label className="text-dark fs-5">Cookie: </Label>
                            <Input type='text' id="cookie" className='form-control' />
                            <a target="_blank" href="https://chrome.google.com/webstore/detail/get-cookie/naciaagbkifhpnoodlkhbejjldaiffcm">
                                Lấy cookie facebook tại đây
                            </a>
                        </Col>
                        <Col sm="4">
                            <Label className="text-dark fs-5">Token: </Label>
                            <Input type='text' id="token" className='form-control' />
                            <a target="_blank"
                                href="https://chrome.google.com/webstore/detail/get-facebook-access-token/coaoigakadjdinfmepjlhfiichelcjpn">
                                Lấy token facebook tại đây
                            </a>
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
                <input type="hidden" value={isComment} id="isCommentDot" />
                <input type="hidden" value={isScan} id="isScanComment" />

                <hr className="bg-primary" />
                <CardBody>
                    <Row >
                        {/* NHÓM CHỈ ĐỊNH */}
                        <Col sm="6" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Group đăng bài: </Label>
                            <a href={`https://facebook.com/${post.group.groupId}`} target="_blank" className="text-info fs-6">{post.group.name}</a>
                        </Col >
                        <Col sm="3">
                            <a target="_blank" href={`https://facebook.com/${post.fb_id}`}>
                                <Button color="primary">
                                    Chi tiết
                                </Button>
                            </a>
                        </Col>
                        <Col sm="12" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Tự động quét comment: </Label>
                            <Button size="sm" color={isScan ? 'warning' : 'success'} onClick={() => { setIsScan(!isScan); }}>
                                {isScan ? 'Dừng' : 'Bắt Đầu'}
                            </Button>
                        </Col >
                        <Col sm="12" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Tự động chấm bài: </Label>
                            <Button size="sm" color={isComment ? 'warning' : 'success'} onClick={() => { setIsComment(!isComment); }}>
                                {isComment ? 'Dừng' : 'Bắt Đầu'}
                            </Button>
                            {/* <Input
                                type="checkbox"
                                checked={isComment}
                                onChange={(e) => {
                                    console.log("Input = " + e.target.checked)
                                    setIsComment(e.target.checked)
                                    setTimeout(() => {
                                        console.log("New IS COMMENT: ", isComment)
                                    }, 1000)

                                }} /> */}
                        </Col >
                        <Col sm="12" className="d-flex mb-1">
                            <Label className="text-dark fs-5 me-1">Group đăng bài: </Label>
                            <a href={`https://facebook.com/${post.group.groupId}`} target="_blank" className="text-info fs-6">{post.group.name}</a>
                        </Col >
                        {/* NỘI DUNG */}
                        <Col sm="12" className="mb-2">
                            <Label className="text-dark fs-5" for="exampleText">
                                Nội Dung
                            </Label><br></br>
                            <Label className="text-warning fs-6" >
                                <i> Chỉ có thể chỉnh sửa tối đa 2 lần!!!</i>
                            </Label>
                            <Input
                                id="content"
                                name="text"
                                type="textarea"
                                defaultValue={post.content.replace('#3SF','')}
                                style={{ minHeight: '200px', marginBottom: '5px' }}
                                editable="true"
                                className="mb-1"
                            />
                            <Button color="primary" size="sm" onClick={() => handleUpdate()}>Cập nhật</Button>
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
                                {renderAttachment(post.attachment)}
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
                <hr className="bg-primary" />
                <CardBody>
                    {/* {commentRender} */}
                    {comments.length == 0 && (<Row><Col sm="12" className="text-center"><Spinner animation="border" variant="primary" /></Col></Row>)}
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
            <CreateOrderModal products={post.products} comment={selectedComment} setComments={updateComment} open={modal} handleModal={handleModal} />
        </TabPane >
    )
}
