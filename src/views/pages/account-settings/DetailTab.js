// ** React Imports
import { Fragment } from 'react'
import { Row, Col, Card, Button, CardBody, CardTitle, CardHeader, Label, Input, Badge } from 'reactstrap'
import { UserServices } from '@services'
import { formatTimeStamp } from '../../../utility/Utils'

const DetailTab = ({ data }) => {

  const handleUpdateSyntax =async () => {
    let dom = Array.from(document.getElementsByClassName('replySyntax'));
    let newSyntax = dom.map(dom => dom.value)
    console.log(newSyntax)
    let newData = JSON.parse(JSON.stringify(data))
    newData.replySyntaxs = newSyntax
    await UserServices.updateProfile(newData).then(data => alert(data.data.message))
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Thông tin khác</CardTitle>
        </CardHeader>
        <CardBody className='pt-1'>
          <Row>
            <Col sm="6" className="mb-2">
              <Label>ID hệ thống</Label>
              <Input type='text' disabled={true} defaultValue={data._id} />
            </Col>
            {data.type == 1 && <Col sm="12">
              <Label>Cú pháp phản hồi</Label>
              {data.type === 1 && data.replySyntaxs.map((str, index) =>
                (<Input type='text' className="mb-1 replySyntax" disabled={false} defaultValue={str} />)
              )}
              <Button color="primary" onClick={() => handleUpdateSyntax()}>
                Cập nhật
              </Button>
            </Col>}
            {data.type == 1 && <Col sm="12">
              <Label>Nhân sự hiện tại</Label><br></br>
              {data.type === 1 && data.shippers.map(shipper =>
                (<Badge color="info" className="me-1 mt-1 p-1">{shipper.split('---')[0]}</Badge>)
              )}
            </Col>}
            {data.type == 0 && <Col sm="12">
              <Label>Công việc hiện tại</Label><br></br>
              {data.type === 0 && data.jobs.map(job =>
                (<Badge color="info" className="me-1 mt-1 p-1">Cửa hàng của <b className="fs-6">{job.owner}</b> ({formatTimeStamp(job.createAt)})</Badge>)
              )}
            </Col>}
          </Row>
        </CardBody>
      </Card>
    </Fragment >
  )
}

export default DetailTab
