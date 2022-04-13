// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Row, Col, TabContent, TabPane } from 'reactstrap'

// ** Demo Components
import Tabs from './Tabs'
import Breadcrumbs from '@components/breadcrumbs'
import AccountTabContent from './AccountTab'
import SecurityTabContent from './SecurityTab'
import { getUserProfile } from '../../../services/user'
import { useDispatch, useSelector } from 'react-redux'
import '@styles/react/pages/page-account-settings.scss'

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState('1')
  const [data, setData] = useState(null)
  const dispatch = useDispatch()
  const { userProfile, getUserProfileResult } = useSelector(state => state.userReducer);
  // const data = JSON.parse(localStorage.getItem('userData'))

  useEffect(() => {
    dispatch(getUserProfile())
  }, [])

  useEffect(() => {
    if (getUserProfileResult == true && userProfile != undefined) {
      setData(userProfile)
    } else if (getUserProfileResult == true && userProfile == undefined) {
      setData({fullname: '', email: '', phone: '', birthdate: new Date()})
    }
  }, [getUserProfileResult])

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Cài đặt thông tin' breadCrumbParent='Pages' breadCrumbActive='Account Settings' />
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />

            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <AccountTabContent data={data} />
              </TabPane>
              <TabPane tabId='2'>
                <SecurityTabContent data={data} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  )
}

export default AccountSettings
