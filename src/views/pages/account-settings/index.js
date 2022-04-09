// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from 'reactstrap'

// ** Demo Components
import Tabs from './Tabs'
import Breadcrumbs from '@components/breadcrumbs'
import AccountTabContent from './AccountTab'
import SecurityTabContent from './SecurityTab'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState('1')
  // const [data, setData] = useState(null)
  const data = JSON.parse(localStorage.getItem('userData'))

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Account Settings' breadCrumbParent='Pages' breadCrumbActive='Account Settings' />
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />

            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <AccountTabContent data={data} />
              </TabPane>
              <TabPane tabId='2'>
                <SecurityTabContent />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  )
}

export default AccountSettings
