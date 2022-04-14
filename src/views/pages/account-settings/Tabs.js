// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from 'reactstrap'

// ** Icons Imports
import { User, Lock, Bookmark, Link, Bell } from 'react-feather'

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav pills className='mb-2'>
      <NavItem>
        <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
          <User size={18} className='me-50' />
          <span className='fw-bold'>Tài khoản</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
          <Lock size={18} className='me-50' />
          <span className='fw-bold'>Bảo mật</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
          <Lock size={18} className='me-50' />
          <span className='fw-bold'>Thông tin khác</span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs
