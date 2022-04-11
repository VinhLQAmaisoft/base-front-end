import { User, Globe, Users, DollarSign, Aperture, Truck, Inbox } from 'react-feather'
// import Post from '@src/assets/custom-icons/post.png'


export const adminNavigation = [
  {
    id: 'usermanage',
    title: 'Quản lý người dùng',
    icon: <User size={20} />,
    navLink: '/admin/user-management'
  },
  {
    id: 'cookiemanage',
    title: 'Quản lý Cookie',
    icon: <Globe size={20} />,
    navLink: '/admin/cookie-management'
  },
  {
    id: 'customermanage',
    title: 'Quản lý khách hàng',
    icon: <Users size={20} />,
    navLink: '/admin/customer-management'
  },
]

export const shipperNavigation = [
  {
    id: 'shipperOrdermanage',
    title: 'Quản lý đơn hàng',
    icon: <User size={20} />,
    navLink: '/shipper/order-manage'
  },
]

export const shopkeeperNavigation = [
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
  },
  {
    id: 'productmanage',
    title: 'Quản Lý Sản Phẩm',
    icon: <Inbox size={20} />,
    navLink: '/shopkeeper/product-manage'
  },
  {
    id: 'shippermanage',
    title: 'Quản Lý Shipper',
    icon: <Users size={20} />,
    navLink: '/shopkeeper/shipper-manage'
  }

]
