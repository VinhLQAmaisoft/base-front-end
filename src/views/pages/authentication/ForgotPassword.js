// ** React Imports
import { Link } from 'react-router-dom'
import { useState, useEffect, Fragment } from 'react'
// ** Icons Imports
import { ChevronLeft } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { sendMailResetPassword } from '../../../services/auth'
// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button, FormFeedback } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

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

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState(false)

    const { sendMail, sendMailResult } = useSelector(state => state.auth);

    const dispatch = useDispatch()

    const validateEmail = (e) => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (emailRegex.test(e.target.value)) {
            setEmailError(false)
        } else {
            setEmailError(true)
        }
    }

    const validateUsername = (e) => {
        const usernameRegex = /^.{3,}$/
        if (usernameRegex.test(e.target.value)) {
            setUsernameError(false)
        } else {
            setUsernameError(true)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email.length == 0 || username.length == 0) {
            toast.warn(
                <ToastContent name='mới' message={'Bạn phải nhập cả tên tài khoản và email'} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
        } else if (emailError || usernameError) {
            toast.error(
                <ToastContent name='lỗi' message={'Bạn phải nhập đúng cả tên tài khoản và email'} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
        } else {
            dispatch(sendMailResetPassword({ email, username }))
        }
    }

    useEffect(() => {
        if (sendMail == true && sendMailResult != null) {
            if(sendMailResult.error){
                toast.error(
                    <ToastContent name='lỗi' message={sendMailResult.message} />,
                    { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
            } else {
                toast.success(
                    <ToastContent name='thành công' message={sendMailResult.message} />,
                    { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
            }
        } 
    }, [sendMail, sendMailResult])


    return (
        <div className='auth-wrapper auth-basic px-2'>
            <div className='auth-inner my-2'>
                <Card className='mb-0'>
                    <CardBody>
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
                        <CardTitle tag='h4' className='mb-1'>
                            Quên mật khẩu? 🔒
                        </CardTitle>
                        <CardText className='mb-2'>
                            Nhập email của bạn và chúng tôi sẽ gửi lại mật khẩu mới cho bạn
                        </CardText>
                        <Form className='auth-forgot-password-form mt-2' onSubmit={handleSubmit}>
                            <div className='mb-1'>
                                <Label className='form-label' for='login-username'>
                                    Tên tài khoản
                                </Label>
                                <Input type='text' id='login-username' placeholder='abcd1234' autoFocus invalid={usernameError} onChange={(e) => {
                                    validateUsername(e)
                                    setUsername(e.target.value)
                                }} />
                                {usernameError ? <FormFeedback>Tên tài khoản không phù hợp</FormFeedback> : null}
                            </div>
                            <div className='mb-1'>
                                <Label className='form-label' for='login-email'>
                                    Email
                                </Label>
                                <Input type='text' id='login-email' placeholder='example@example.com' autoFocus invalid={emailError} onChange={(e) => {
                                    validateEmail(e)
                                    setEmail(e.target.value)
                                }} />
                                {emailError ? <FormFeedback>Email không phù hợp</FormFeedback> : null}
                            </div>
                            <Button color='primary' block>
                                Gửi mã khôi phục
                            </Button>
                        </Form>
                        <p className='text-center mt-2'>
                            <Link to='/login'>
                                <ChevronLeft className='rotate-rtl me-25' size={14} />
                                <span className='align-middle'>Quay lại trang đăng nhập</span>
                            </Link>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword
