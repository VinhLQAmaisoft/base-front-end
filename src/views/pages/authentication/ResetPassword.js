// ** React Imports
import { Link, useHistory } from 'react-router-dom'
import { useEffect, Fragment } from 'react'
// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserPassword } from '../../../services/admin'
// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Button, Input, FormFeedback } from 'reactstrap'

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

const ResetPassword = () => {

  const defaultValues = {
    username: '',
    oldPassword: '',
    newPassword: '',
    retypeNewPassword: ''
  }

  const SignupSchema = yup.object().shape({
    username: yup.string().required('Bạn cần nhập tên tài khoản'),
    oldPassword: yup.string().required('Bạn cần nhập mật khẩu cũ'),
    newPassword: yup.string().min(8, 'Mật khẩu gồm ít nhất 8 kí tự')
      .required('Bạn cần nhập mật khẩu mới')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 'Mật khẩu gồm ít nhất 8 kí tự, 1 chữ hoa, 1 chữ thường'),
    retypeNewPassword: yup.string()
      .oneOf([yup.ref('newPassword'), null], 'Bạn hãy nhập đúng với mật khẩu vừa nhập'),
  })
  // ** Hooks
  const dispatch = useDispatch()
  const history = useHistory()
  // const { passwordUpdated, updatedPasswordResult } = useSelector(state => state.adminReducer);
  const { passwordUpdated, updatedPasswordResult } = useSelector(state => state.adminReducer);

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
      dispatch(updateUserPassword({
        // _id: data._id,
        username: submitData.username,
        oldPassword: submitData.oldPassword,
        newpassword: submitData.newPassword,
        repass: submitData.retypeNewPassword
      }))
      console.log(submitData)
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

  useEffect(() => {
    if (passwordUpdated != null ) {
      if (passwordUpdated.data == null && updatedPasswordResult == true) {
        toast.error(
          <ToastContent name='lỗi' message={passwordUpdated.message}/>,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      } else if (passwordUpdated.data != null && updatedPasswordResult == true) {
        toast.success(
          <ToastContent name='thành công' message={passwordUpdated.message}/>,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
        history.push('/login')
      }
    }
  }, [passwordUpdated, updatedPasswordResult])

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <svg viewBox='0 0 139 95' version='1.1' height='28'>
                <defs>
                  <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
                    <stop stopColor='#000000' offset='0%'></stop>
                    <stop stopColor='#FFFFFF' offset='100%'></stop>
                  </linearGradient>
                  <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
                    <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                    <stop stopColor='#FFFFFF' offset='100%'></stop>
                  </linearGradient>
                </defs>
                <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                  <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
                    <g id='Group' transform='translate(400.000000, 178.000000)'>
                      <path
                        d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                        id='Path'
                        className='text-primary'
                        style={{ fill: 'currentColor' }}
                      ></path>
                      <path
                        d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                        id='Path'
                        fill='url(#linearGradient-1)'
                        opacity='0.2'
                      ></path>
                      <polygon
                        id='Path-2'
                        fill='#000000'
                        opacity='0.049999997'
                        points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                      ></polygon>
                      <polygon
                        id='Path-2'
                        fill='#000000'
                        opacity='0.099999994'
                        points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                      ></polygon>
                      <polygon
                        id='Path-3'
                        fill='url(#linearGradient-2)'
                        opacity='0.099999994'
                        points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                      ></polygon>
                    </g>
                  </g>
                </g>
              </svg>
              <h2 className='brand-text text-primary ms-1'>Vuexy</h2>
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Reset Password 🔒
            </CardTitle>
            <CardText className='mb-2'>Your new password must be different from previously used passwords</CardText>
            <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
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
                <Controller
                  control={control}
                  id='oldPassword'
                  name='oldPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Mật khẩu cũ'
                      htmlFor='oldPassword'
                      className='input-group-merge'
                      invalid={errors.oldPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.oldPassword && (
                  <FormFeedback className='d-block'>{errors.oldPassword.message}</FormFeedback>
                )}
              </div>
              <div className='mb-1'>
                <Controller
                  control={control}
                  id='newPassword'
                  name='newPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Mật khẩu mới'
                      htmlFor='newPassword'
                      className='input-group-merge'
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.newPassword && (
                  <FormFeedback className='d-block'>{errors.newPassword.message}</FormFeedback>
                )}
              </div>
              <div className='mb-1'>
                <Controller
                  control={control}
                  id='retypeNewPassword'
                  name='retypeNewPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Nhập lại mật khẩu mới'
                      htmlFor='retypeNewPassword'
                      className='input-group-merge'
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.retypeNewPassword && (
                  <FormFeedback className='d-block'>{errors.retypeNewPassword.message}</FormFeedback>
                )}
              </div>
              <Button type='submit' color='primary' block>
                Set New Password
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/pages/login-basic'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword
