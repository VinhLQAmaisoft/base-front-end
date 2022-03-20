// ** React Imports
import { useContext, useState, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/authentication'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import { toast, Slide } from 'react-toastify'
// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Label, Button, Form, Input, FormFeedback } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

const defaultValues = {
  fullname: '',
  email: '',
  username: '',
  password: '',
  phone: '',
  repeatpassword: '',
  birthdate: new Date(),
  role: null
}

const ToastContent = () => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <h6 className='toast-title fw-bold'>Chào mừng bạn</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Bạn đã đăng kí thành công, bạn đã trở thành thành viên của 3Sf</span>
    </div>
  </Fragment>
)

const roleOptions = [
  { value: '1', label: 'Shopkeeper' },
  { value: '2', label: 'Shipper' },
]

const Register = () => {
  // ** Hooks
  // const ability = useContext(AbilityContext)

  const SignupSchema = yup.object().shape({
    fullname: yup.string().matches(/^([\w]{2,})+\s+([\w\s]{2,})+$/i, 'Tên không phù hợp').required('Bạn cần nhập họ và tên'),
    email: yup.string().email().required('Bạn cần nhập email'),
    username: yup.string().min(5, 'Nhập ít nhất 5 kí tự').required('Bạn cần nhập tên tài khoản'),
    password: yup.string().min(8, 'Mật khẩu gồm ít nhất 8 kí tự').required('Bạn cần nhập mật khẩu').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 'Mật khẩu gồm ít nhất 8 kí tự, 1 chữ hoa, 1 chữ thường'),
    birthdate: yup.date().required('Bạn cần nhập ngày sinh'),
    repeatpassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Bạn hãy nhập đúng với mật khẩu vừa nhập'),
    phone: yup.string().matches(/^[0-9]{10}$/, 'Bạn cần nhập số, không nhập chữ hoặc kí tự đặc biệt').required('Bạn cần nhập số điện thoại'),
    role: yup.object().typeError('Bạn cần chọn vai trò').required('Bạn cần chọn vai trò')
  })

  const { skin } = useSkin()
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(SignupSchema) })

  const illustration = skin === 'dark' ? 'register-v2-dark.svg' : 'register-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = data => {
    const tempData = { ...data, rePassword: data.repeatpassword, type: data.role.value, birthday: data.birthdate.toLocaleDateString() }
    // delete tempData.repeatpassword
    delete tempData.role
    const { fullname, username, password, rePassword, email, phone, birthday, type } = tempData

    // console.log({ username, email, phone, birthdate, password, role: role.value })
    console.log(data)
    console.log({ fullname, username, password, rePassword, email, phone, birthday, type })
    useJwt
      .register({ fullname, username, password, rePassword, email, phone, birthday, type })
      .then(res => {
        if (res.data.error) {
          for (const property in res.data.error) {
            if (res.data.error[property] !== null) {
              setError(property, {
                type: 'manual',
                message: res.data.error[property]
              })
            }
          }
        } else {
          toast.success(
            <ToastContent/>,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          history.push('/')
        }
        console.log(res)
      })
      .catch(err => console.log(err))

    // console.log(tempData)
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 374 374' version='1.0' height='28'>
            <defs>
              <clipPath id="a">
                <path d="M 20.199219 20.199219 L 354.699219 20.199219 L 354.699219 354.699219 L 20.199219 354.699219 Z M 20.199219 20.199219" />
              </clipPath>
            </defs>
            <g clip-path="url(#a)">
              <path fill="#FC4368" d="M 187.394531 20.34375 C 95.027344 20.34375 20.148438 95.222656 20.148438 187.585938 C 20.148438 276.777344 89.96875 349.644531 177.929688 354.554688 C 178.820312 343.847656 179.59375 334.28125 180.214844 326.152344 C 182.105469 301.265625 161.394531 290.867188 150.78125 283.386719 C 88.554688 239.550781 122.980469 161.894531 126.207031 148.660156 C 128.5 139.175781 152.949219 73.808594 187.402344 73.808594 C 221.851562 73.808594 246.3125 139.175781 248.597656 148.660156 C 251.832031 161.894531 286.210938 239.488281 224.023438 283.386719 C 213.4375 290.867188 192.839844 301.265625 194.738281 326.152344 C 195.347656 334.273438 196.125 343.84375 197.003906 354.539062 C 284.898438 349.5625 354.648438 276.730469 354.648438 187.585938 C 354.648438 95.222656 279.765625 20.34375 187.394531 20.34375" />
            </g>
          </svg>
          <h2 className='brand-text text-primary ms-1'>3SF.</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Đăng kí
            </CardTitle>
            <CardText className='mb-2'>Hãy đăng kí để trở thành thành viên của 3SF.</CardText>

            <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='register-fullname'>
                  Họ và tên
                </Label>
                <Controller
                  id='fullname'
                  name='fullname'
                  control={control}
                  render={({ field }) => (
                    <Input autoFocus placeholder='Tran Anh' invalid={errors.fullname && true} {...field} />
                  )}
                />
                {errors.fullname ? <FormFeedback>{errors.fullname.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-username'>
                  Tên tài khoản
                </Label>
                <Controller
                  id='username'
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <Input autoFocus placeholder='dtran3565' invalid={errors.username && true} {...field} />
                  )}
                />
                {errors.username ? <FormFeedback>{errors.username.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-password'>
                  Mật khẩu
                </Label>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
                {errors.password ? <FormFeedback>{errors.password.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='repeat-password'>
                  Nhập lại mật khẩu
                </Label>
                <Controller
                  id='repeatpassword'
                  name='repeatpassword'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.repeatpassword && true} {...field} />
                  )}
                />
                {errors.repeatpassword ? <FormFeedback>{errors.repeatpassword.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input type='email' placeholder='Email' invalid={errors.email && true} {...field} />
                  )}
                />
                {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-phone'>
                  Số điện thoại
                </Label>
                <Controller
                  id='phone'
                  name='phone'
                  control={control}
                  render={({ field }) => (
                    <Input autoFocus placeholder='Số điện thoại' invalid={errors.phone && true} {...field} />
                  )}
                />
                {errors.phone ? <FormFeedback>{errors.phone.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-birthdate'>
                  Ngày sinh
                </Label>
                <Controller
                  id='birthdate'
                  name='birthdate'
                  control={control}
                  render={({ field }) => (
                    <Flatpickr id='date-time-picker' className='form-control' value={field.value} onChange={(date) => field.onChange(date)}/>
                  )}
                />
                {/* {errors.birthdate ? <FormFeedback>{errors.birthdate.message}</FormFeedback> : null} */}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='role'>
                  Bạn là
                </Label>
                <Controller
                  id='role'
                  control={control}
                  name='role'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={roleOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('role', { 'is-invalid': defaultValues !== null && field.value === null })} 
                      // className='role' 
                      {...field}
                    />
                  )}
                />
                {errors.role ? <FormFeedback>{errors.role.message}</FormFeedback> : null}
              </div>
              <Button type='submit' block color='primary'>
                Sign up
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/login'>
                <span>Sign in instead</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
