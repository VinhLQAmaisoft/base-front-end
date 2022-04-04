// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import { adminNavigation, shipperNavigation, shopkeeperNavigation } from '@src/navigation/vertical'

const VerticalLayout = props => {

  // try {
  const userData = JSON.parse(localStorage.getItem('userData'))
  let navigation = []
  if (!userData || !userData.type) {
    window.location.href = "/login";
  } else if (userData.type === 0) {
    navigation = shipperNavigation
  } else if (userData.type === 1) {
    navigation = shopkeeperNavigation
  } else if (userData.type === 2) {
    navigation = adminNavigation
  }

  return (
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  )
  // } catch (error) {
  //   window.location.href = '/login'
  // }
}

export default VerticalLayout
