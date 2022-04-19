// ** React Imports
import { Fragment, useEffect } from 'react'
import { Row, Col, Card, Form, Button, CardBody, CardTitle, CardHeader, FormFeedback, Label, Input, Badge } from 'reactstrap'
import { UserServices } from '@services'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import InputPasswordToggle from '@components/input-password-toggle'
import { formatTimeStamp } from '../../../utility/Utils'

const defaultValues = {
  newPassword: '',
  currentPassword: '',
  retypeNewPassword: ''
}

const ToastContent = ({ name, message }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <h6 className='toast-title fw-bold'>Thông báo {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>{message}</span>
    </div>
  </Fragment>
)

const DetailTab = ({ data }) => {
  const SignupSchema = yup.object().shape({
    currentPassword: yup.string()
      .required('Bạn cần nhập mật khẩu hiện tại'),
    newPassword: yup.string().min(8, 'Mật khẩu gồm ít nhất 8 kí tự')
      .required('Bạn cần nhập mật khẩu')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 'Mật khẩu gồm ít nhất 8 kí tự, 1 chữ hoa, 1 chữ thường'),
    retypeNewPassword: yup.string()
      .oneOf([yup.ref('newPassword'), null], 'Bạn hãy nhập đúng với mật khẩu vừa nhập'),
  })
  // ** Hooks
  const dispatch = useDispatch()
  const { userPasswordUpdated, updateUserPasswordResult } = useSelector(state => state.userReducer);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = submitData => {
    if (Object.values(submitData).every(field => field.length > 0)) {
      dispatch(changeUserPassword({
        username: data.username,
        oldpassword: submitData.currentPassword,
        newpassword: submitData.newPassword,
        repass: submitData.retypeNewPassword
      }))
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  console.log(userPasswordUpdated)

  // useEffect(() => {
  //   if (userPasswordUpdated != null) {
  //     if (userPasswordUpdated.data == null && updateUserPasswordResult == true) {
  //       toast.error(
  //         <ToastContent name='lỗi' message={userPasswordUpdated.message} />,
  //         { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
  //       )
  //     } else if (userPasswordUpdated.data != null && updateUserPasswordResult == true) {
  //       // toast.success(
  //       //   <ToastContent name='thành công' message={userPasswordUpdated.message} />,
  //       //   { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
  //       // )
  //     }
  //   }
  // }, [userPasswordUpdated, updateUserPasswordResult])

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
      {/* <TwoFactorAuth />
      <CreateApiKey />
      <ApiKeysList />
      <RecentDevices /> */}
    </Fragment >
  )
}

export default DetailTab
