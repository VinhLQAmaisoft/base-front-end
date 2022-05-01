// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'

const NotAuthorized = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'not-authorized-dark.svg' : 'not-authorized.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className='misc-wrapper'>
      <Link className='brand-logo' to='/'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 374 374' version='1.0' height='28'>
          <defs>
            <clipPath id="a">
              <path d="M 20.199219 20.199219 L 354.699219 20.199219 L 354.699219 354.699219 L 20.199219 354.699219 Z M 20.199219 20.199219" />
            </clipPath>
          </defs>
          <g clip-path="url(#a)">
            <path fill="#FC4368" d="M 187.394531 20.34375 C 95.027344 20.34375 20.148438 95.222656 20.148438 187.585938 C 20.148438 276.777344 89.96875 349.644531 177.929688 354.554688 C 178.820312 343.847656 179.59375 334.28125 180.214844 326.152344 C 182.105469 301.265625 161.394531 290.867188 150.78125 283.386719 C 88.554688 239.550781 122.980469 161.894531 126.207031 148.660156 C 128.5 139.175781 152.949219 73.808594 187.402344 73.808594 C 221.851562 73.808594 246.3125 139.175781 248.597656 148.660156 C 251.832031 161.894531 286.210938 239.488281 224.023438 283.386719 C 213.4375 290.867188 192.839844 301.265625 194.738281 326.152344 C 195.347656 334.273438 196.125 343.84375 197.003906 354.539062 C 284.898438 349.5625 354.648438 276.730469 354.648438 187.585938 C 354.648438 95.222656 279.765625 20.34375 187.394531 20.34375" />
          </g>
        </svg>
        <h2 className='brand-text text-primary ms-1'>3SF.</h2>
      </Link>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Bạn không có quyền truy cập! 🔐</h2>
          <p className='mb-2'>
            Vui lòng quay trở lại trang đăng nhập để đăng nhập.
          </p>
          <Button tag={Link} to='/login' color='primary' className='btn-sm-block mb-1'>
            Quay lại trang đăng nhập
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default NotAuthorized
