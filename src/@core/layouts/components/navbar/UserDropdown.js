// ** React Imports
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {useDispatch} from 'react-redux'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
// import { isUserLoggedIn } from '@utils'
import { logoutAction } from '../../../../redux/authentication'

// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import shipperAvatar from '@src/assets/images/portrait/small/cute-shipper-avatar.jpg'
import shopkeeperAvatar from '@src/assets/images/portrait/small/cute-shopkeeper-avatar.jpg'
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'

const UserDropdown = () => {
  // ** State
  const dispatch = useDispatch()
  const userData = JSON.parse(localStorage.getItem('userData'))
  let role
  let userAvatar
  if (userData.type === 0) {
    role = 'Người giao hàng'
    userAvatar = shipperAvatar
  } else if (userData.type === 1) {
    role = 'Chủ cửa hàng'
    userAvatar = shopkeeperAvatar
  } else if (userData.type === 2) {
    role = 'Admin'
    userAvatar = shipperAvatar
  } else {
    role = ''
    userAvatar = defaultAvatar
  }


 

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{userData.fullname}</span>
          <span className='user-status'>{role}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag='a' href='/account-settings'>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Cài đặt</span>
        </DropdownItem>
        <DropdownItem tag={Link} onClick={() => dispatch(logoutAction())}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Đăng xuất</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
