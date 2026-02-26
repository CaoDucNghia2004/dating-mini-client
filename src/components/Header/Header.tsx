import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from '../../constants/path'
import { AppContext } from '../../contexts/app.context'
import { clearLS } from '../../utils/auth'
import { toast } from 'react-toastify'

export default function Header() {
  const { isAuthenticated, profile, reset } = useContext(AppContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearLS()
    reset()
    toast.success('Đăng xuất thành công!')
    navigate(path.home)
  }

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Link to={path.home} className='text-2xl font-semibold text-gray-800'>
              Hẹn Hò
            </Link>

            {isAuthenticated && profile && (
              <nav className='flex items-center gap-4'>
                <Link
                  to={path.profileList}
                  className='px-4 py-2 text-gray-700 font-medium hover:text-blue-500 transition'
                >
                  List Profile
                </Link>
                <Link
                  to={path.likedProfiles}
                  className='px-4 py-2 text-gray-700 font-medium hover:text-blue-500 transition'
                >
                  Đã Like
                </Link>
                <Link to={path.matches} className='px-4 py-2 text-gray-700 font-medium hover:text-pink-500 transition'>
                  Matches
                </Link>
                <Link
                  to={path.myProfile}
                  className='px-4 py-2 text-gray-700 font-medium hover:text-blue-500 transition'
                >
                  Profile của tôi
                </Link>
              </nav>
            )}
          </div>

          <div className='flex items-center gap-3'>
            {isAuthenticated && profile ? (
              <>
                <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold'>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <span className='text-gray-700 font-medium'>Xin chào, {profile.name}</span>
                <button
                  onClick={handleLogout}
                  className='px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition'
                >
                  Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to={path.profile}
                  className='px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition'
                >
                  Tạo Profile
                </Link>
                <Link
                  to={path.login}
                  className='px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition'
                >
                  Đăng Nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
