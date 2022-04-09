import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSkin } from '@hooks/useSkin'
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { useForm, Controller } from 'react-hook-form'
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'
import '@styles/react/pages/page-authentication.scss'
import { sendUserLogin } from '../../../services/auth/index'
import { toast, Slide } from 'react-toastify'
import { getRoleByType } from '../../../utility/Utils'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <h6 className='toast-title fw-bold'>Chào mừng, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Bạn đã đăng nhập thành công với vai trò là {role} trong 3SF. Bây giờ bạn có thể làm việc!</span>
    </div>
  </Fragment>
)

const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

const defaultValues = {
  loginPassword: '123456789',
  loginUsername: 'admin'
}

const Login = () => {
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const history = useHistory()
  const { currentUser, isAuth } = useSelector(state => state.auth);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      console.log({ username: data.loginUsername, password: data.loginPassword })
      dispatch(sendUserLogin({ username: data.loginUsername, password: data.loginPassword }))
      console.log(currentUser)
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
    // console.log(data)
  }

  useEffect(() => {
    if (currentUser === null) {
      console.log('hahaha')
    } else {
      setCookie('token', currentUser.token, 99)
      const userData = {
        fullname: currentUser.fullname,
        birthdate: currentUser.birthdate,
        email: currentUser.email,
        phone: currentUser.phone,
        type: currentUser.type
      }
      localStorage.setItem('userData', JSON.stringify(userData))
      if (userData && userData.type) {
        switch (userData.type) {
          case 0:
            history.push('/shopkeeper/order-manage')
            break;
          case 1:
            history.push('/shopkeeper/post-manage')
            break;
          case 2:
            history.push('/home')
            break;
          default: history.push('/login')
            break;
        }
      }
      toast.success(
        <ToastContent name={currentUser.fullname} role={getRoleByType(currentUser.type)} />,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    }
  }, [currentUser])


  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          {/* <svg viewBox='0 0 139 95' version='1.1' height='28'>
            
          </svg> */}
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
              Chào mừng bạn đến với 3SF! 👋
            </CardTitle>
            <CardText className='mb-2'>Đăng nhập vào tài khoản của bạn và bắt đầu công việc</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-username'>
                  Tên tài khoản
                </Label>
                <Controller
                  id='loginUsername'
                  name='loginUsername'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      placeholder='Tên tài khoản'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                    // console.log(field)
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Mật khẩu
                  </Label>
                  <Link to='/pages/forgot-password-cover'>
                    <small>Quên mật khẩu?</small>
                  </Link>
                </div>
                <Controller
                  id='loginPassword'
                  name='loginPassword'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.loginPassword && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Duy trì đăng nhập
                </Label>
              </div>
              <Button color='primary' block>
                Đăng nhập
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Bạn là người mới?</span>
              <Link to='/register'>
                <span>Tạo tài khoản ngay</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
