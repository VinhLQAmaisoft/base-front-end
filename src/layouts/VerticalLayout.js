// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import {adminNavigation, shipperNavigation} from '@src/navigation/vertical'

const VerticalLayout = props => {
  // const [menuData, setMenuData] = useState([])

  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout menuData={shipperNavigation} {...props}>
      {props.children}
    </Layout>
  )
}

export default VerticalLayout
