import { lazy } from 'react'

// ** Document title
const TemplateTitle = '3SF'

// ** Default Route
const DefaultRoute = (role) => {
  console.log(role)
  if (role == 0) {
    return '/shipper/order-manage'
  } else if (role == 1) {
    return '/shopkeeper/post-manage'
  } else if (role == 2) {
    return '/admin/user-management'
  } else {
    return '/login'
  }
}

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/pages/Home'))
  },
  {
    path: '/account-settings',
    component: lazy(() => import('../../views/pages/account-settings'))
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

const outsiderRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/authentication/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/pages/authentication/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('../../views/pages/authentication/ForgotPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/reset-password',
    component: lazy(() => import('../../views/pages/authentication/ResetPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
]

const shipperRoutes = [
  {
    path: '/shipper/order-manage',
    component: lazy(() => import('../../views/apps/shipper/OrderManage')),
  },
]

const adminRoutes = [
  {
    path: '/admin/user-management',
    component: lazy(() => import('../../views/apps/admin/UserManagement'))
  },
  {
    path: '/admin/cookie-management',
    component: lazy(() => import('../../views/apps/admin/CookieManagement'))
  },
  {
    path: '/admin/customer-management',
    component: lazy(() => import('../../views/apps/admin/CustomerManagement'))
  }
]

const shopkeeperRoutes = [
  {
    path: '/shopkeeper/post-manage',
    component: lazy(() => import('../../views/apps/shopkeeper/PostManage')),
    layout: 'VerticalLayout'
  },
  {
    path: '/shopkeeper/sell-campaign',
    component: lazy(() => import('../../views/apps/shopkeeper/SellCampaign')),
    layout: 'VerticalLayout'
  },
  {
    path: '/shopkeeper/order-manage',
    component: lazy(() => import('../../views/apps/shopkeeper/OrderManage')),
    layout: 'VerticalLayout'
  },
  {
    path: '/shopkeeper/product-manage',
    component: lazy(() => import('../../views/apps/shopkeeper/ProductManage')),
    layout: 'VerticalLayout'
  },
  {
    path: '/shopkeeper/shipper-manage',
    component: lazy(() => import('../../views/apps/shopkeeper/ShipperManage')),
    layout: 'VerticalLayout'
  },
  {
    path: '/shopkeeper/figure-manage',
    component: lazy(() => import('../../views/apps/shopkeeper/FigureManage')),
    layout: 'VerticalLayout'
  },
  {
    path: '/shipper/order-manage',
    component: lazy(() => import('../../views/apps/shipper/OrderManage')),
    layout: 'VerticalLayout'
  },
]

export { DefaultRoute, TemplateTitle, Routes, adminRoutes, shopkeeperRoutes, outsiderRoutes, shipperRoutes }
