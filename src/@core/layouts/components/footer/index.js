// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    // <div></div>
    <p className='clearfix mb-0'>

      <span className='float-md-start d-block mt-25'>
        Dự án được làm năm {new Date().getFullYear()}{' '} bởi
        <div>
          <a href='https://www.facebook.com/vingodino' target='_blank' rel='noopener noreferrer'>
            Lê Quang Vinh
          </a>
        </div>
        <div>
          <a href='https://www.facebook.com/ducanh5110' target='_blank' rel='noopener noreferrer'>
            Trần Đức Anh
          </a>
        </div>
        <div>
          <a href='https://www.facebook.com/profile.php?id=100004603997082' target='_blank' rel='noopener noreferrer'>
            Lê Sỹ Thanh	Long
          </a>
        </div>
        <div>
          <a href='https://www.facebook.com/thangnv611' target='_blank' rel='noopener noreferrer'>
            Nguyễn Việt Thắng
          </a>
        </div>
        <div>
          <a href='https://www.facebook.com/haxuhaxo' target='_blank' rel='noopener noreferrer'>
            Nguyễn Thị Ngọc	Hà
          </a>
        </div>
      </span>
      <span className='float-md-end d-none d-md-block'>
        Dự án này được làm bằng cả
        <Heart size={14} />
      </span>
    </p>
  )
}

export default Footer
