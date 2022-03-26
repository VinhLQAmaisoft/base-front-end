// ** Custom Components
import Avatar from '@components/avatar'
import { formatMoney, formatTimeStamp } from '@utils'
// ** Third Party Components
import axios from 'axios'
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// ** Vars
const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const status = {
  1: { title: 'Current', color: 'light-primary' },
  2: { title: 'Professional', color: 'light-success' },
  3: { title: 'Rejected', color: 'light-danger' },
  4: { title: 'Resigned', color: 'light-warning' },
  5: { title: 'Applied', color: 'light-info' }
}

export let data = [{ full_name: 'Duc Anh', email: 'anhtd123@yomail.com', post: 'xasas', city: 'Dong Anh', start_date: '05/11/2000', salary: '25000' }]

export const advSearchColumns = [
  {
    name: 'Khách Hàng',
    sortable: true,
    minWidth: '200px',
    selector: row => renderCustomerName(row.customerName, row.customerId)
  },
  {
    name: 'SĐT',
    sortable: true,
    minWidth: '100px',
    selector: row => row.phone
  },
  {
    name: 'Địa Chỉ',
    sortable: true,
    minWidth: '150px',
    selector: row => row.address
  },
  {
    name: 'Shipper',
    sortable: true,
    minWidth: '150px',
    selector: row => row.customerName
  },
  {
    name: 'Thời Gian',
    sortable: true,
    minWidth: '150px',
    selector: row => formatTimeStamp(row.updateAt)
  },
  {
    name: 'Kết Quả',
    sortable: true,
    minWidth: '100px',
    selector: row => row.status
  },
  {
    name: 'Giá Tiền',
    sortable: true,
    minWidth: '100px',
    selector: row => formatMoney(calTotal(row.product))
  }
]

const renderCustomerName = (name, id) => {
  return (
    <a href={'https://facebook.com/' + id} target="_blank">{name}</a>
  )
}

function calTotal(products) {
  let sum = 0;
  for (const product of products) {
    sum += parseInt(product.quantity) * product.product.price;
  }
  return sum + "₫";
}
// ** Get initial Data
// axios.get('/api/datatables/initial-data').then(response => {
//   data = response.data
// })


// ** Table Adv Search Column\