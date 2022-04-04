import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardHeader,
    CardSubtitle,
    Badge,
    CardBody,
    CardFooter
} from 'reactstrap'
export default function PostCard({ props, handleSelect }) {
    const [imageUrl, setImageUrl] = useState('https://i.pinimg.com/564x/78/90/e1/7890e13d8985d3a5360e3e62831575fd.jpg')

    console.log("Post Found: ", props)

    function renderAttachment(listAttachment) {
        let result = [];
        for (let attachment of listAttachment) {
            result.push(
                <Col key={`attachment-${result.length}`} className='d-flex pl-0 align-items-center justify-content-end mt-1 post-attachment-item' md='4' sm='12'>
                    {/* <img className='w-100' src={process.env.REACT_APP_BASE_SERVER_URL + '/' + attachment} /> */}
                    <img className='w-100' src={imageUrl} />
                </Col>)
        }
        return result
    }

    function getStatus(status) {
        status = parseInt(status)
        console.log("Post status: ", status)
        switch (status) {
            case 1: return 'Đang hoạt động'
            case -1: return 'Kết thúc'
        }
    }

    return (
        <Card>
            <CardHeader className='flex-md-col flex-column align-md-items-center align-items-start border-bottom'>
                <div className='d-flex w-100 mb-1' style={{ justifyContent: 'space-between' }}>
                    <CardTitle tag='h4' onClick={() => { handleSelect(props) }}><a href="#">{props.content.slice(0, 20) + '...'}</a></CardTitle>
                    <a className='ml-3' target='_blank' href={props.fb_url}> Trực quan</a>
                </div>
                <CardSubtitle
                    className="mb-0 text-secondary"
                    tag="h6"
                >
                    Nhóm: {props.group.name} (26/11/2021 - 10:20:00)
                </CardSubtitle>
            </CardHeader>

            <CardBody>
                {/* ATTACHMENTS IMAGE */}
                <Row className='justify-content-start mx-0 mb-1 post-attachment-list'>
                    {renderAttachment(props.attachment)}
                </Row>
                {/* CONTENT */}
                <Row className="mb-1">
                    <Col sm='12'>
                        <textarea className="form-control" rows="10" defaultValue={props.content}>

                        </textarea>
                    </Col>
                </Row>
            </CardBody>
            {/* FOOTER */}
            <CardFooter>
                <Row >
                    <Col >
                        <Badge color='secondary' style={{ margin: '5px' }} className='badge-glow'>Bình luận: {props.commentList.length}</Badge>
                        <Badge color='success' style={{ margin: '5px' }} className='badge-glow'>Đơn hàng:  {props.order.length}</Badge>
                        <Badge color='warning' style={{ margin: '5px' }} className='badge-glow'>Trạng thái: {getStatus(props.status)}</Badge>
                        <Badge color='info' style={{ margin: '5px' }} className='badge-glow'>Sản phẩm: {props.products.length}</Badge>
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    )
}
