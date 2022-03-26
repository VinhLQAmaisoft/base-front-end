// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import { adminNavigation, shipperNavigation, shopkeeperNavigation} from '@src/navigation/vertical'

const VerticalLayout = props => {

  const userData = JSON.parse(localStorage.getItem('userData'))
  let navigation = []
  if (userData.type === 2) {
    navigation = adminNavigation
  } else if (userData.type === 0) {
    navigation = shopkeeperNavigation
  } else if (userData.type === 1) {
    navigation = shipperNavigation
  }

  return (
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  )
}

export default VerticalLayout
