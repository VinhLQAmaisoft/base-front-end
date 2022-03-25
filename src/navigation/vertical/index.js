import { User, Globe, Users, DollarSign, Aperture, Truck } from 'react-feather'
// import Post from '@src/assets/custom-icons/post.png'


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
    id: 'sellcampaign',
    title: 'Bán Hàng',
    icon: <Aperture size={20} />,
    navLink: '/shopkeeper/sell-campaign'
  },
  {
    id: 'postmanage',
    title: 'Quản Lý Bài Đăng',
    icon: <DollarSign size={20} />,
    navLink: '/shopkeeper/post-manage'
  },
  {
    id: 'ordermanage',
    title: 'Quản Lý Đơn Hàng',
    icon: <Truck size={20} />,
    navLink: '/shopkeeper/order-manage'
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
