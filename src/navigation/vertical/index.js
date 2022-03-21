import { User, Globe, Users } from 'react-feather'

export default [
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
