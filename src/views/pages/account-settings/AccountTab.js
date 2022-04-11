// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../../services/user'
// ** Utils
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
// ** Demo Components
// import DeleteAccount from './DeleteAccount'


const AccountTab = ({data}) => {
  // ** Hooks
  const dispatch = useDispatch()
  const { userProfile, getUserProfileResult } = useSelector(state => state.userReducer);
  // const [data, setData] = useState()
  const defaultValues = {
    lastName: '',
    // firstName: data.fullName.split(' ')[0]
    firstName: ''
  }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

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
    if (Object.values(data).every(field => field.length > 0)) {
      return null
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
    dispatch(getUserProfile())
  }, [])

  useEffect(() => {
    if (getUserProfileResult == true && userProfile != undefined ) {
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
                  Fullname
                </Label>
                <Controller
                  name='fullName'
                  control={control}
                  render={({ field }) => (
                    <Input id='fullName' placeholder='Fullname' defaultValue={data.fullname} invalid={errors.fullname && true} {...field} />
                  )}
                />
                {errors && errors.fullName && <FormFeedback>Please enter a valid First Name</FormFeedback>}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='email'>
                  E-mail
                </Label>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input id='email' placeholder='email' defaultValue={data.email} invalid={errors.email && true} {...field} />
                  )}
                />
                {errors && errors.email && <FormFeedback>Please enter a valid First Name</FormFeedback>}
                <Input id='emailInput' type='email' name='email' placeholder='Email' defaultValue={data.email} />
              </Col>
              {/* <Col sm='6' className='mb-1'>
                <Label className='form-label' for='company'>
                  Company
                </Label>
                <Input defaultValue={data.company} id='company' name='company' placeholder='Company Name' />
              </Col> */}
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phNumber'>
                  Phone Number
                </Label>
                <Cleave
                  id='phNumber'
                  name='phNumber'
                  className='form-control'
                  placeholder='1 234 567 8900'
                  options={{ phone: true, phoneRegionCode: 'US' }}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='updateDob'>
                  Ngày sinh
                </Label>
                <Flatpickr id='date-time-picker' className='form-control'  /*onChange={(date) => setBirthDate(date)}*/ />
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