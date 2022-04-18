// ** React Imports
import { Fragment, useEffect } from 'react'
import {
    Row, Col, Card, Form, Button, CardBody, CardTitle, CardHeader, FormFeedback, Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap'
import { updateUserPassword } from '../../../services/admin'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import InputPasswordToggle from '@components/input-password-toggle'

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

const ChangePasswordModal = ({ show, setShow, data }) => {



    const SignupSchema = yup.object().shape({
        newPassword: yup.string().min(8, 'Mật khẩu gồm ít nhất 8 kí tự')
            .required('Bạn cần nhập mật khẩu mới')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 'Mật khẩu gồm ít nhất 8 kí tự, 1 chữ hoa, 1 chữ thường'),
        retypeNewPassword: yup.string()
            .oneOf([yup.ref('newPassword'), null], 'Bạn hãy nhập đúng với mật khẩu vừa nhập'),
    })
    // ** Hooks
    const dispatch = useDispatch()
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
            _id: data._id,
            username: data.username,
            oldpassword: data.password,
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

    // console.log(userPasswordUpdated)

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
          }
        }
      }, [passwordUpdated, updatedPasswordResult])




    return (
        <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-4'>
                <h1 className='text-center mb-1'>Thay đổi mật khẩu</h1>
                <p className='text-center'>Bạn đang thay đổi mật khẩu của người dùng: {data.fullname}</p>
                <Fragment>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Controller
                                    control={control}
                                    id='currentPassword'
                                    name='currentPassword'
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            label='Mật khẩu hiện tại'
                                            htmlFor='currentPassword'
                                            className='input-group-merge'
                                            invalid={errors.currentPassword && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.currentPassword && (
                                    <FormFeedback className='d-block'>{errors.currentPassword.message}</FormFeedback>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm='6' className='mb-1'>
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
                            </Col>
                            <Col xs={12}>
                                <p className='fw-bolder'>Yêu cầu mật khẩu:</p>
                                <ul className='ps-1 ms-25'>
                                    <li className='mb-50'>Ít nhất là 8 kí tự</li>
                                    <li className='mb-50'>Ít nhất 1 chữ hoa</li>
                                    <li>Ít nhất 1 số hoặc 1 kí tự đặc biệt</li>
                                </ul>
                            </Col>
                            <Col className='mt-1' sm='12'>
                                <Button type='submit' className='me-1' color='primary'>
                                    Cập nhật
                                </Button>
                                <Button color='secondary' outline>
                                    Huỷ
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Fragment>
            </ModalBody>
        </Modal>

    )
}

export default ChangePasswordModal