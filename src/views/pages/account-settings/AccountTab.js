// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../../services/user'
import { yupResolver } from '@hookform/resolvers/yup'
// ** Utils
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
// ** Demo Components
// import DeleteAccount from './DeleteAccount'


const AccountTab = ({ data }) => {
  
  const updateSchema = yup.object().shape({
    fullname: yup.string().matches(/^([\w]{2,})+\s+([\w\s]{2,})+$/i, 'Tên không phù hợp').required('Bạn cần nhập họ và tên'),
    email: yup.string().email().required('Bạn cần nhập email'),
    birthdate: yup.date().required('Bạn cần nhập ngày sinh'),
    phone: yup.string().matches(/^[0-9]{10}$/, 'Bạn cần nhập số, không nhập chữ hoặc kí tự đặc biệt').required('Bạn cần nhập số điện thoại'),
  })

  const dispatch = useDispatch()
  const { userProfile, getUserProfileResult } = useSelector(state => state.userReducer);

  console.log(data.birthdate)

  const defaultValues = {
    fullName: data.fullname,
    email: data.email,
    phone: data.phone,
    birthdate: data.birthdate
  }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(updateSchema) })

  // ** States
  const [avatar, setAvatar] = useState('')

  const onChange = e => {
    const reader = new FileReader(),
      files = e.target.files
    reader.onload = function () {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  const onSubmit = data => {
    // if (Object.values(data).every(field => field.length > 0)) {
    //   return null
    // } else {
    //   for (const key in data) {
    //     if (data[key].length === 0) {
    //       setError(key, {
    //         type: 'manual'
    //       })
    //     }
    //   }
    // }
    console.log(data)
  }

  useEffect(() => {
    dispatch(getUserProfile())
  }, [])

  useEffect(() => {
    if (getUserProfileResult == true && userProfile != undefined) {
      console.log(userProfile.fullname)
      // setData(userProfile)
    }
  }, [getUserProfileResult])

  console.log(getUserProfileResult)

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
                <Label className='form-label' for='fullName'>
                  Họ và tên
                </Label>
                <Controller
                  name='fullName'
                  control={control}
                  render={({ field }) => (
                    <Input id='fullName' placeholder='Fullname' defaultValue={data.fullname} invalid={errors.fullname && true} {...field} />
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
                    <Input id='email' placeholder='Email' type='email' name='email' defaultValue={data.email} invalid={errors.email && true} {...field} />
                  )}
                />
                {errors && errors.email && <FormFeedback>Please enter a valid First Name</FormFeedback>}
              </Col>
              {/* <Col sm='6' className='mb-1'>
                <Label className='form-label' for='company'>
                  Company
                </Label>
                <Input defaultValue={data.company} id='company' name='company' placeholder='Company Name' />
              </Col> */}
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
                      defaultValue={data.phone}
                      placeholder='1 234 567 8900'
                      invalid={errors.phone && true} {...field}
                    />
                  )}
                />
                {errors && errors.phone && <FormFeedback>Please enter a valid First Name</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='updateDob'>
                  Ngày sinh
                </Label>
                <Controller
                  name='birthdate'
                  control={control}
                  render={({ field }) => (
                    <Flatpickr id='date-time-picker' className='form-control' name='birthdate' defaultValue={data.phone}/*onChange={(date) => setBirthDate(date)}*/ invalid={errors.birthdate && true} {...field}/>
                  )}
                />
                {errors && errors.birthdate && <FormFeedback>Please enter a valid First Name</FormFeedback>}              
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