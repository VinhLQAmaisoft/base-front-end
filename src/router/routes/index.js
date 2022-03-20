import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/apps/admin/UserManagement'))
  },
  {
    path: '/second-page',
    component: lazy(() => import('../../views/apps/admin/CustomerManagement'))
  },
  {
    path: '/account-settings',
    component: lazy(() => import('../../views/pages/account-settings'))
  },
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
    path: '/shopkeeper/post-manage',
    component: lazy(() => import('../../views/apps/shopkeeper/postManage')),
    layout: 'VerticalLayout'
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
