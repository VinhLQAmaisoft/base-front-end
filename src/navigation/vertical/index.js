import { User, Globe, Users } from 'react-feather'

export const adminNavigation = [
  {
    id: 'usermanage',
    title: 'User Management',
    icon: <User size={20} />,
    navLink: '/home'
  },
  {
    id: 'cookiemanage',
    title: 'Cookie Management',
    icon: <Globe size={20} />,
    navLink: '/second-page'
  },
  {
    id: 'customermanage',
    title: 'Customer Management',
    icon: <Users size={20} />,
    navLink: '/third-page'
  },
  {
    id: 'postmanage',
    title: 'Quản Lý Bài Đăng',
    icon: <Users size={20} />,
    navLink: '/shopkeeper/post-manage'
  }
]

export const shipperNavigation = [
  {
    id: 'usermanage',
    title: 'User Management',
    icon: <User size={20} />,
    navLink: '/home'
  },
  {
    id: 'cookiemanage',
    title: 'Cookie Management',
    icon: <Globe size={20} />,
    navLink: '/second-page'
  },
]

export const shopkeeperNavigation = [
  {
    id: 'usermanage',
    title: 'User Management',
    icon: <User size={20} />,
    navLink: '/home'
  },
  {
    id: 'customermanage',
    title: 'Customer Management',
    icon: <Users size={20} />,
    navLink: '/third-page'
  }
]
