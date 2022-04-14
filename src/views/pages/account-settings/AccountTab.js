import { Fragment, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast, Slide } from 'react-toastify'
import { updateUserProfile } from '../../../services/user'
import { yupResolver } from '@hookform/resolvers/yup'
import Flatpickr from 'react-flatpickr'
import { toast, Slide } from 'react-toastify'
import '@styles/react/libs/flatpickr/flatpickr.scss'

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

const AccountTab = ({ data }) => {

  const updateSchema = yup.object().shape({
    fullname: yup.string().matches(/^([\w]{2,})+\s+([\w\s]{2,})+$/i, 'Tên không phù hợp'),
    email: yup.string().email().required('Bạn cần nhập email'),
    birthdate: yup.date().required('Bạn cần nhập ngày sinh'),
    phone: yup.string().matches(/^[0-9]{10}$/, 'Bạn cần nhập số, không nhập chữ hoặc kí tự đặc biệt').required('Bạn cần nhập số điện thoại'),
  })

  const dispatch = useDispatch()
  const { userProfileUpdated, updateUserProfileResult } = useSelector(state => state.userReducer);

  // console.log(data.birthdate)

  const defaultValues = {
    fullname: data.fullname,
    email: data.email,
    phone: data.phone,
    birthdate: new Date(data.birthdate)
  }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(updateSchema) })

  // ** States
  // const [avatar, setAvatar] = useState('')

  const onSubmit = data => {
    console.log(Object.values(data).every(field => {
      console.log(field)
    }))
    if (Object.values(data).every(field => {
      console.log(field)
      field.length == 0
    })) {
      toast.info(
        <ToastContent name='mới' message='Không có gì thay đổi' />,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    } else {
      console.log(data)
    }

  }

  useEffect(() => {
    if (userProfileUpdated != null && updateUserProfileResult == true) {
      toast.success(
        <ToastContent name='thành công' message={userProfileUpdated.message}/>,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    }
  }, [getUserProfileResult])

  const handleImgReset = () => {
    setAvatar(require('@src/assets/images/avatars/avatar-blank.png').default)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Profile Details</CardTitle>
        </CardHeader>
        <CardBody className='py-2 my-25'>
          {/* <div className='d-flex'>
            <div className='me-25'>
              <img className='rounded me-50' src={avatar} alt='Generic placeholder image' height='100' width='100' />
            </div>
            <div className='d-flex align-items-end mt-75 ms-1'>
              <div>
                <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                  Upload
                  <Input type='file' onChange={onChange} hidden accept='image/*' />
                </Button>
                <Button className='mb-75' color='secondary' size='sm' outline onClick={handleImgReset}>
                  Reset
                </Button>
                <p className='mb-0'>Allowed JPG, GIF or PNG. Max size of 800kB</p>
              </div>
            </div>
          </div> */}
          <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='fullname'>
                  Họ và tên
                </Label>
                <Controller
                  name='fullname'
                  control={control}
                  render={({ field }) => (
                    <Input id='fullName' placeholder='Fullname' invalid={errors.fullname && true} {...field} />
                  )}
                />
                {errors && errors.fullname && <FormFeedback>{errors.fullname.message}</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='email'>
                  E-mail
                </Label>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input id='email' placeholder='Email' type='email' name='email' invalid={errors.email && true} {...field} />
                  )}
                />
                {errors && errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phone'>
                  Số điện thoại
                </Label>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='phone'
                      name='phone'
                      className='form-control'
                      placeholder='1 234 567 8900'
                      invalid={errors.phone && true} {...field}
                    />
                  )}
                />
                {errors && errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='birthdate'>
                  Ngày sinh
                </Label>
                <Controller
                  name='birthdate'
                  control={control}
                  render={({ field }) => (
                    <Flatpickr id='birthdate' className='form-control' name='birthdate'/*onChange={(date) => setBirthDate(date)}*/ invalid={errors.birthdate && true} {...field} />
                  )}
                />
                {errors && errors.birthdate && <FormFeedback>{errors.birthdate.message}</FormFeedback>}
              </Col>
              <Col className='mt-2' sm='12'>
                <Button type='submit' className='me-1' color='primary'>
                  Save changes
                </Button>
                {/* <Button color='secondary' outline>
                  Discard
                </Button> */}
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {/* <DeleteAccount /> */}
    </Fragment>
  )
}

export default AccountTab